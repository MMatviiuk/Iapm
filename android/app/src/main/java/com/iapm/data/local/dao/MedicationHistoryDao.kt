package com.iapm.data.local.dao

import androidx.room.*
import com.iapm.data.local.entity.MedicationHistoryEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.util.*

@Dao
interface MedicationHistoryDao {
    
    @Query("SELECT * FROM medication_history WHERE userId = :userId ORDER BY date DESC, time DESC")
    fun getMedicationHistoryByUser(userId: UUID): Flow<List<MedicationHistoryEntity>>
    
    @Query("SELECT * FROM medication_history WHERE medicationId = :medicationId ORDER BY date DESC, time DESC")
    fun getMedicationHistoryByMedication(medicationId: UUID): Flow<List<MedicationHistoryEntity>>
    
    @Query("SELECT * FROM medication_history WHERE userId = :userId AND date = :date ORDER BY time ASC")
    suspend fun getMedicationHistoryForDate(userId: UUID, date: LocalDate): List<MedicationHistoryEntity>
    
    @Query("SELECT * FROM medication_history WHERE medicationId = :medicationId AND date = :date AND time = :time")
    suspend fun getMedicationHistoryEntry(medicationId: UUID, date: LocalDate, time: String): MedicationHistoryEntity?
    
    @Query("SELECT * FROM medication_history WHERE isSynced = 0")
    suspend fun getUnsyncedHistory(): List<MedicationHistoryEntity>
    
    @Query("SELECT COUNT(*) FROM medication_history WHERE userId = :userId AND taken = 1 AND date >= :startDate")
    suspend fun getTakenDosesCount(userId: UUID, startDate: LocalDate): Int
    
    @Query("SELECT COUNT(*) FROM medication_history WHERE userId = :userId AND date >= :startDate")
    suspend fun getTotalDosesCount(userId: UUID, startDate: LocalDate): Int
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMedicationHistory(history: MedicationHistoryEntity)
    
    @Update
    suspend fun updateMedicationHistory(history: MedicationHistoryEntity)
    
    @Delete
    suspend fun deleteMedicationHistory(history: MedicationHistoryEntity)
    
    @Query("UPDATE medication_history SET isSynced = 1, lastSyncAt = :syncTime WHERE id = :id")
    suspend fun markAsSynced(id: UUID, syncTime: LocalDateTime)
    
    @Query("DELETE FROM medication_history WHERE id = :id")
    suspend fun deleteMedicationHistoryById(id: UUID)
}