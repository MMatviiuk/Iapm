package com.iapm.data.local.dao

import androidx.room.*
import com.iapm.data.local.entity.ProfileEntity
import kotlinx.coroutines.flow.Flow
import java.util.*

@Dao
interface ProfileDao {
    
    @Query("SELECT * FROM profiles WHERE id = :id")
    suspend fun getProfileById(id: UUID): ProfileEntity?
    
    @Query("SELECT * FROM profiles WHERE email = :email")
    suspend fun getProfileByEmail(email: String): ProfileEntity?
    
    @Query("SELECT * FROM profiles WHERE isSynced = 0")
    suspend fun getUnsyncedProfiles(): List<ProfileEntity>
    
    @Query("SELECT * FROM profiles")
    fun getAllProfiles(): Flow<List<ProfileEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProfile(profile: ProfileEntity)
    
    @Update
    suspend fun updateProfile(profile: ProfileEntity)
    
    @Delete
    suspend fun deleteProfile(profile: ProfileEntity)
    
    @Query("UPDATE profiles SET isSynced = 1, lastSyncAt = :syncTime WHERE id = :id")
    suspend fun markAsSynced(id: UUID, syncTime: LocalDateTime)
    
    @Query("DELETE FROM profiles WHERE id = :id")
    suspend fun deleteProfileById(id: UUID)
}