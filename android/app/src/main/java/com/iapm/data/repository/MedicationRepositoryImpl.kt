package com.iapm.data.repository

import com.iapm.data.local.dao.MedicationDao
import com.iapm.data.local.dao.MedicationHistoryDao
import com.iapm.data.remote.SupabaseClient
import com.iapm.domain.model.*
import com.iapm.domain.repository.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MedicationRepositoryImpl @Inject constructor(
    private val medicationDao: MedicationDao,
    private val medicationHistoryDao: MedicationHistoryDao,
    private val supabaseClient: SupabaseClient
) : MedicationRepository {

    override fun getActiveMedicationsByUser(userId: UUID): Flow<List<Medication>> {
        return medicationDao.getActiveMedicationsByUser(userId)
            .map { entities -> entities.map { it.toDomain() } }
    }

    override fun getAllMedicationsByUser(userId: UUID): Flow<List<Medication>> {
        return medicationDao.getAllMedicationsByUser(userId)
            .map { entities -> entities.map { it.toDomain() } }
    }

    override suspend fun getMedicationById(id: UUID): Result<Medication> {
        return try {
            val entity = medicationDao.getMedicationById(id)
            if (entity != null) {
                Result.success(entity.toDomain())
            } else {
                Result.failure(Exception("Medication not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun addMedication(medication: Medication): Result<Medication> {
        return try {
            // Add to local database first
            val entity = medication.toEntity()
            medicationDao.insertMedication(entity)

            // Try to sync with remote (don't fail if offline)
            try {
                val remoteMedication = supabaseClient.insertMedication(entity.toDto())
                if (remoteMedication != null) {
                    medicationDao.markAsSynced(entity.id, LocalDateTime.now())
                }
            } catch (e: Exception) {
                // Continue with local-only medication
            }

            Result.success(medication)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateMedication(medication: Medication): Result<Medication> {
        return try {
            val entity = medication.toEntity().copy(
                syncAction = "UPDATE",
                isSynced = false,
                updatedAt = LocalDateTime.now()
            )
            medicationDao.updateMedication(entity)

            // Try to sync with remote
            try {
                val remoteMedication = supabaseClient.updateMedication(
                    entity.id.toString(),
                    mapOf(
                        "name" to entity.name,
                        "dosage" to entity.dosage,
                        "active" to entity.active
                    )
                )
                if (remoteMedication != null) {
                    medicationDao.markAsSynced(entity.id, LocalDateTime.now())
                }
            } catch (e: Exception) {
                // Continue with local changes
            }

            Result.success(medication)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteMedication(id: UUID): Result<Unit> {
        return try {
            // Soft delete for sync
            medicationDao.softDeleteMedication(id, LocalDateTime.now())

            // Try to sync with remote
            try {
                val success = supabaseClient.deleteMedication(id.toString())
                if (success) {
                    medicationDao.deleteMedicationById(id)
                }
            } catch (e: Exception) {
                // Keep soft-deleted for later sync
            }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun markMedicationTaken(id: UUID, timestamp: LocalDateTime): Result<MedicationHistory> {
        return try {
            val medication = medicationDao.getMedicationById(id)
                ?: return Result.failure(Exception("Medication not found"))

            val history = MedicationHistory(
                id = UUID.randomUUID(),
                medicationId = id,
                userId = medication.userId,
                date = timestamp.toLocalDate(),
                time = timestamp.toLocalTime(),
                taken = true,
                takenAt = timestamp
            )

            val historyEntity = history.toEntity()
            medicationHistoryDao.insertMedicationHistory(historyEntity)

            // Try to sync
            try {
                supabaseClient.insertMedicationHistory(historyEntity.toDto())
                medicationHistoryDao.markAsSynced(history.id, LocalDateTime.now())
            } catch (e: Exception) {
                // Continue locally
            }

            Result.success(history)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getMedicationHistory(userId: UUID): Flow<List<MedicationHistory>> {
        return medicationHistoryDao.getMedicationHistoryByUser(userId)
            .map { entities -> entities.map { it.toDomain() } }
    }

    override suspend fun getTodaysDoses(userId: UUID, date: LocalDate): Result<List<UpcomingDose>> {
        return try {
            val medications = medicationDao.getMedicationsForDate(userId, date)
            val doses = mutableListOf<UpcomingDose>()

            for (medication in medications) {
                val entity = medication.toEntity()
                for (time in entity.timesPerDay) {
                    // Check if already taken today
                    val existingHistory = medicationHistoryDao.getMedicationHistoryEntry(
                        entity.id, date, time.toString()
                    )

                    if (existingHistory == null || !existingHistory.taken) {
                        doses.add(UpcomingDose(
                            medicationId = entity.id,
                            medicationName = entity.name,
                            time = time,
                            dosage = entity.dosage
                        ))
                    }
                }
            }

            Result.success(doses.sortedBy { it.time })
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}