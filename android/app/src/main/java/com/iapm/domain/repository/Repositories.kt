package com.iapm.domain.repository

import com.iapm.domain.model.*
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

interface AuthRepository {
    suspend fun login(email: String, password: String, rememberMe: Boolean = false): Result<User>
    suspend fun register(userData: RegisterData): Result<User>
    suspend fun loginWithGoogle(): Result<User>
    suspend fun logout(): Result<Unit>
    suspend fun getCurrentUser(): Result<User>
    suspend fun deleteAccount(): Result<Unit>
}

interface MedicationRepository {
    fun getActiveMedicationsByUser(userId: UUID): Flow<List<Medication>>
    fun getAllMedicationsByUser(userId: UUID): Flow<List<Medication>>
    suspend fun getMedicationById(id: UUID): Result<Medication>
    suspend fun addMedication(medication: Medication): Result<Medication>
    suspend fun updateMedication(medication: Medication): Result<Medication>
    suspend fun deleteMedication(id: UUID): Result<Unit>
    suspend fun markMedicationTaken(id: UUID, timestamp: LocalDateTime): Result<MedicationHistory>
    suspend fun getMedicationHistory(userId: UUID): Flow<List<MedicationHistory>>
    suspend fun getTodaysDoses(userId: UUID, date: LocalDate): Result<List<UpcomingDose>>
}

interface AnalyticsRepository {
    suspend fun getAdherenceStats(userId: UUID): Result<List<MedicationAdherence>>
    suspend fun getDashboardStats(userId: UUID): Result<DashboardStats>
    suspend fun getMedicationHistoryForDate(userId: UUID, date: LocalDate): Result<List<MedicationHistory>>
}

interface SyncRepository {
    suspend fun syncAll(userId: UUID): Result<SyncResult>
    suspend fun syncProfiles(userId: UUID): Result<List<SyncOperation>>
    suspend fun syncMedications(userId: UUID): Result<List<SyncOperation>>
    suspend fun syncMedicationHistory(userId: UUID): Result<List<SyncOperation>>
}

data class RegisterData(
    val email: String,
    val password: String,
    val name: String,
    val role: UserRole,
    val dateOfBirth: LocalDate
)

data class SyncResult(
    val success: Boolean,
    val operations: List<SyncOperation>,
    val timestamp: LocalDateTime,
    val error: String? = null
)

data class SyncOperation(
    val table: String,
    val recordId: String,
    val action: String,
    val success: Boolean,
    val error: String? = null
)