package com.iapm.data.local.dao

import androidx.room.*
import com.iapm.data.local.entity.MedicationEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.util.*

@Dao
interface MedicationDao {
    
    @Query("SELECT * FROM medications WHERE userId = :userId AND active = 1 ORDER BY name")
    fun getActiveMedicationsByUser(userId: UUID): Flow<List<MedicationEntity>>
    
    @Query("SELECT * FROM medications WHERE userId = :userId ORDER BY name")
    fun getAllMedicationsByUser(userId: UUID): Flow<List<MedicationEntity>>
    
    @Query("SELECT * FROM medications WHERE id = :id")
    suspend fun getMedicationById(id: UUID): MedicationEntity?
    
    @Query("SELECT * FROM medications WHERE userId = :userId AND startDate <= :date AND (endDate IS NULL OR endDate >= :date) AND active = 1")
    suspend fun getMedicationsForDate(userId: UUID, date: LocalDate): List<MedicationEntity>
    
    @Query("SELECT * FROM medications WHERE isSynced = 0")
    suspend fun getUnsyncedMedications(): List<MedicationEntity>
    
    @Query("SELECT * FROM medications WHERE syncAction = 'DELETE' AND isSynced = 0")
    suspend fun getPendingDeletes(): List<MedicationEntity>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMedication(medication: MedicationEntity)
    
    @Update
    suspend fun updateMedication(medication: MedicationEntity)
    
    @Delete
    suspend fun deleteMedication(medication: MedicationEntity)
    
    @Query("UPDATE medications SET isSynced = 1, lastSyncAt = :syncTime, syncAction = NULL WHERE id = :id")
    suspend fun markAsSynced(id: UUID, syncTime: LocalDateTime)
    
    @Query("DELETE FROM medications WHERE id = :id")
    suspend fun deleteMedicationById(id: UUID)
    
    // Soft delete - помечаем как удаленное для синхронизации
    @Query("UPDATE medications SET active = 0, syncAction = 'DELETE', isSynced = 0, updatedAt = :updateTime WHERE id = :id")
    suspend fun softDeleteMedication(id: UUID, updateTime: LocalDateTime)
}