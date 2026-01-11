package com.iapm.data.sync

import android.util.Log
import com.iapm.data.local.dao.*
import com.iapm.data.local.entity.*
import com.iapm.data.remote.SupabaseClient
import com.iapm.data.remote.dto.*
import kotlinx.coroutines.flow.first
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SyncManager @Inject constructor(
    private val supabaseClient: SupabaseClient,
    private val profileDao: ProfileDao,
    private val medicationDao: MedicationDao,
    private val medicationHistoryDao: MedicationHistoryDao
) {
    
    private val TAG = "SyncManager"
    private val dateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE
    
    suspend fun syncAll(userId: UUID): SyncResult {
        return try {
            Log.d(TAG, "Starting full sync for user: $userId")
            
            val results = mutableListOf<SyncOperationResult>()
            
            // Sync profiles
            results.addAll(syncProfiles(userId))
            
            // Sync medications
            results.addAll(syncMedications(userId))
            
            // Sync medication history
            results.addAll(syncMedicationHistory(userId))
            
            val successCount = results.count { it.success }
            val totalCount = results.size
            
            Log.d(TAG, "Sync completed: $successCount/$totalCount operations successful")
            
            SyncResult(
                success = successCount == totalCount,
                operations = results,
                timestamp = LocalDateTime.now()
            )
        } catch (e: Exception) {
            Log.e(TAG, "Sync failed", e)
            SyncResult(
                success = false,
                operations = emptyList(),
                timestamp = LocalDateTime.now(),
                error = e.message
            )
        }
    }
    
    private suspend fun syncProfiles(userId: UUID): List<SyncOperationResult> {
        val results = mutableListOf<SyncOperationResult>()
        
        try {
            // Get unsynced local profiles
            val unsyncedProfiles = profileDao.getUnsyncedProfiles()
            
            for (profile in unsyncedProfiles) {
                val result = when (profile.syncAction) {
                    "INSERT", null -> {
                        val profileDto = profile.toDto()
                        val remoteProfile = supabaseClient.updateProfile(profile.id.toString(), mapOf(
                            "first_name" to profileDto.first_name,
                            "last_name" to profileDto.last_name,
                            "date_of_birth" to profileDto.date_of_birth,
                            "gender" to profileDto.gender,
                            "photo_url" to profileDto.photo_url,
                            "onboarding_complete" to profileDto.onboarding_complete
                        ))
                        
                        if (remoteProfile != null) {
                            profileDao.markAsSynced(profile.id, LocalDateTime.now())
                            SyncOperationResult("profile", profile.id.toString(), "UPDATE", true)
                        } else {
                            SyncOperationResult("profile", profile.id.toString(), "UPDATE", false, "Failed to update remote profile")
                        }
                    }
                    else -> SyncOperationResult("profile", profile.id.toString(), profile.syncAction ?: "UNKNOWN", false, "Unknown sync action")
                }
                results.add(result)
            }
            
            // Pull remote changes
            val remoteProfile = supabaseClient.getProfile(userId.toString())
            if (remoteProfile != null) {
                val localProfile = profileDao.getProfileById(userId)
                if (localProfile == null || remoteProfile.updated_at > localProfile.updatedAt.format(dateTimeFormatter)) {
                    profileDao.insertProfile(remoteProfile.toEntity())
                    results.add(SyncOperationResult("profile", userId.toString(), "PULL", true))
                }
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Profile sync failed", e)
            results.add(SyncOperationResult("profile", "", "SYNC", false, e.message))
        }
        
        return results
    }
    
    private suspend fun syncMedications(userId: UUID): List<SyncOperationResult> {
        val results = mutableListOf<SyncOperationResult>()
        
        try {
            // Push local changes
            val unsyncedMedications = medicationDao.getUnsyncedMedications()
            
            for (medication in unsyncedMedications) {
                val result = when (medication.syncAction) {
                    "INSERT", null -> {
                        val medicationDto = medication.toDto()
                        val remoteMedication = supabaseClient.insertMedication(medicationDto)
                        
                        if (remoteMedication != null) {
                            medicationDao.markAsSynced(medication.id, LocalDateTime.now())
                            SyncOperationResult("medication", medication.id.toString(), "INSERT", true)
                        } else {
                            SyncOperationResult("medication", medication.id.toString(), "INSERT", false, "Failed to insert remote medication")
                        }
                    }
                    "UPDATE" -> {
                        val medicationDto = medication.toDto()
                        val remoteMedication = supabaseClient.updateMedication(medication.id.toString(), mapOf(
                            "name" to medicationDto.name,
                            "dosage" to medicationDto.dosage,
                            "form" to medicationDto.form,
                            "frequency" to medicationDto.frequency,
                            "times_per_day" to medicationDto.times_per_day,
                            "meal_timing" to medicationDto.meal_timing,
                            "days_of_week" to medicationDto.days_of_week,
                            "start_date" to medicationDto.start_date,
                            "end_date" to medicationDto.end_date,
                            "duration" to medicationDto.duration,
                            "instructions" to medicationDto.instructions,
                            "condition" to medicationDto.condition,
                            "prescribed_by" to medicationDto.prescribed_by,
                            "photo_url" to medicationDto.photo_url,
                            "active" to medicationDto.active
                        ))
                        
                        if (remoteMedication != null) {
                            medicationDao.markAsSynced(medication.id, LocalDateTime.now())
                            SyncOperationResult("medication", medication.id.toString(), "UPDATE", true)
                        } else {
                            SyncOperationResult("medication", medication.id.toString(), "UPDATE", false, "Failed to update remote medication")
                        }
                    }
                    "DELETE" -> {
                        val success = supabaseClient.deleteMedication(medication.id.toString())
                        if (success) {
                            medicationDao.deleteMedicationById(medication.id)
                            SyncOperationResult("medication", medication.id.toString(), "DELETE", true)
                        } else {
                            SyncOperationResult("medication", medication.id.toString(), "DELETE", false, "Failed to delete remote medication")
                        }
                    }
                    else -> SyncOperationResult("medication", medication.id.toString(), medication.syncAction ?: "UNKNOWN", false, "Unknown sync action")
                }
                results.add(result)
            }
            
            // Pull remote changes
            val remoteMedications = supabaseClient.getMedications(userId.toString())
            for (remoteMedication in remoteMedications) {
                val localMedication = medicationDao.getMedicationById(remoteMedication.id)
                if (localMedication == null || remoteMedication.updated_at > localMedication.updatedAt.format(dateTimeFormatter)) {
                    medicationDao.insertMedication(remoteMedication.toEntity())
                    results.add(SyncOperationResult("medication", remoteMedication.id.toString(), "PULL", true))
                }
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Medication sync failed", e)
            results.add(SyncOperationResult("medication", "", "SYNC", false, e.message))
        }
        
        return results
    }
    
    private suspend fun syncMedicationHistory(userId: UUID): List<SyncOperationResult> {
        val results = mutableListOf<SyncOperationResult>()
        
        try {
            // Push local changes
            val unsyncedHistory = medicationHistoryDao.getUnsyncedHistory()
            
            for (history in unsyncedHistory) {
                val historyDto = history.toDto()
                val remoteHistory = supabaseClient.insertMedicationHistory(historyDto)
                
                if (remoteHistory != null) {
                    medicationHistoryDao.markAsSynced(history.id, LocalDateTime.now())
                    results.add(SyncOperationResult("medication_history", history.id.toString(), "INSERT", true))
                } else {
                    results.add(SyncOperationResult("medication_history", history.id.toString(), "INSERT", false, "Failed to insert remote history"))
                }
            }
            
            // Pull remote changes (last 100 records to avoid large transfers)
            val remoteHistory = supabaseClient.getMedicationHistory(userId.toString())
            for (remote in remoteHistory.takeLast(100)) {
                val local = medicationHistoryDao.getMedicationHistoryEntry(
                    remote.medication_id,
                    java.time.LocalDate.parse(remote.date),
                    remote.time
                )
                if (local == null) {
                    medicationHistoryDao.insertMedicationHistory(remote.toEntity())
                    results.add(SyncOperationResult("medication_history", remote.id.toString(), "PULL", true))
                }
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Medication history sync failed", e)
            results.add(SyncOperationResult("medication_history", "", "SYNC", false, e.message))
        }
        
        return results
    }
}

// Extension functions for converting between entities and DTOs
fun ProfileEntity.toDto(): ProfileDto {
    return ProfileDto(
        id = id,
        email = email,
        first_name = firstName,
        last_name = lastName,
        date_of_birth = dateOfBirth?.format(DateTimeFormatter.ISO_LOCAL_DATE),
        gender = gender,
        role = role,
        photo_url = photoUrl,
        onboarding_complete = onboardingComplete,
        created_at = createdAt.format(dateTimeFormatter),
        updated_at = updatedAt.format(dateTimeFormatter)
    )
}

fun ProfileDto.toEntity(): ProfileEntity {
    return ProfileEntity(
        id = id,
        email = email,
        firstName = first_name,
        lastName = last_name,
        dateOfBirth = date_of_birth?.let { java.time.LocalDate.parse(it) },
        gender = gender,
        role = role,
        photoUrl = photo_url,
        onboardingComplete = onboarding_complete,
        createdAt = created_at?.let { LocalDateTime.parse(it) } ?: LocalDateTime.now(),
        updatedAt = updated_at?.let { LocalDateTime.parse(it) } ?: LocalDateTime.now(),
        isSynced = true,
        lastSyncAt = LocalDateTime.now()
    )
}

fun MedicationEntity.toDto(): MedicationDto {
    return MedicationDto(
        id = id,
        user_id = userId,
        name = name,
        dosage = dosage,
        form = form,
        frequency = frequency,
        times_per_day = timesPerDay,
        meal_timing = mealTiming,
        days_of_week = daysOfWeek,
        start_date = startDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
        end_date = endDate?.format(DateTimeFormatter.ISO_LOCAL_DATE),
        duration = duration,
        instructions = instructions,
        condition = condition,
        prescribed_by = prescribedBy,
        photo_url = photoUrl,
        active = active,
        created_at = createdAt.format(dateTimeFormatter),
        updated_at = updatedAt.format(dateTimeFormatter)
    )
}

fun MedicationDto.toEntity(): MedicationEntity {
    return MedicationEntity(
        id = id,
        userId = user_id,
        name = name,
        dosage = dosage,
        form = form,
        frequency = frequency,
        timesPerDay = times_per_day,
        mealTiming = meal_timing,
        daysOfWeek = days_of_week,
        startDate = java.time.LocalDate.parse(start_date),
        endDate = end_date?.let { java.time.LocalDate.parse(it) },
        duration = duration,
        instructions = instructions,
        condition = condition,
        prescribedBy = prescribed_by,
        photoUrl = photo_url,
        active = active,
        createdAt = created_at?.let { LocalDateTime.parse(it) } ?: LocalDateTime.now(),
        updatedAt = updated_at?.let { LocalDateTime.parse(it) } ?: LocalDateTime.now(),
        isSynced = true,
        lastSyncAt = LocalDateTime.now()
    )
}

fun MedicationHistoryEntity.toDto(): MedicationHistoryDto {
    return MedicationHistoryDto(
        id = id,
        medication_id = medicationId,
        user_id = userId,
        date = date.format(DateTimeFormatter.ISO_LOCAL_DATE),
        time = time.toString(),
        taken = taken,
        skipped_reason = skippedReason,
        taken_at = takenAt.format(dateTimeFormatter),
        created_at = createdAt.format(dateTimeFormatter)
    )
}

fun MedicationHistoryDto.toEntity(): MedicationHistoryEntity {
    return MedicationHistoryEntity(
        id = id,
        medicationId = medication_id,
        userId = user_id,
        date = java.time.LocalDate.parse(date),
        time = java.time.LocalTime.parse(time),
        taken = taken,
        skippedReason = skipped_reason,
        takenAt = taken_at?.let { LocalDateTime.parse(it) } ?: LocalDateTime.now(),
        createdAt = created_at?.let { LocalDateTime.parse(it) } ?: LocalDateTime.now(),
        isSynced = true,
        lastSyncAt = LocalDateTime.now()
    )
}

data class SyncResult(
    val success: Boolean,
    val operations: List<SyncOperationResult>,
    val timestamp: LocalDateTime,
    val error: String? = null
)

data class SyncOperationResult(
    val table: String,
    val recordId: String,
    val action: String,
    val success: Boolean,
    val error: String? = null
)