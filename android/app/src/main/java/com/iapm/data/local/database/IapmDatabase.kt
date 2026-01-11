package com.iapm.data.local.database

import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.iapm.data.local.dao.*
import com.iapm.data.local.entity.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import javax.inject.Inject
import javax.inject.Provider

@Database(
    entities = [
        ProfileEntity::class,
        MedicationEntity::class,
        MedicationHistoryEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class IapmDatabase : RoomDatabase() {
    
    abstract fun profileDao(): ProfileDao
    abstract fun medicationDao(): MedicationDao
    abstract fun medicationHistoryDao(): MedicationHistoryDao
    
    class Callback @Inject constructor(
        private val database: Provider<IapmDatabase>
    ) : RoomDatabase.Callback() {
        
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            val iapmDb = database.get()
            iapmDb.scope.launch {
                populateDatabase(iapmDb)
            }
        }
    }
    
    companion object {
        const val DATABASE_NAME = "iapm_database"
    }
}

class Converters {
    @TypeConverter
    fun fromStringList(value: List<String>): String {
        return value.joinToString(",")
    }
    
    @TypeConverter
    fun toStringList(value: String): List<String> {
        return if (value.isEmpty()) emptyList() else value.split(",")
    }
    
    @TypeConverter
    fun fromLocalDateTime(value: LocalDateTime): String {
        return value.toString()
    }
    
    @TypeConverter
    fun toLocalDateTime(value: String): LocalDateTime {
        return LocalDateTime.parse(value)
    }
    
    @TypeConverter
    fun fromLocalDate(value: java.time.LocalDate): String {
        return value.toString()
    }
    
    @TypeConverter
    fun toLocalDate(value: String): java.time.LocalDate {
        return java.time.LocalDate.parse(value)
    }
    
    @TypeConverter
    fun fromUUID(value: UUID): String {
        return value.toString()
    }
    
    @TypeConverter
    fun toUUID(value: String): UUID {
        return UUID.fromString(value)
    }
}