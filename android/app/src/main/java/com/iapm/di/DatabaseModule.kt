package com.iapm.di

import android.content.Context
import androidx.room.Room
import com.iapm.data.local.database.IapmDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideIapmDatabase(
        @ApplicationContext context: Context
    ): IapmDatabase {
        return Room.databaseBuilder(
            context.applicationContext,
            IapmDatabase::class.java,
            IapmDatabase.DATABASE_NAME
        )
        .fallbackToDestructiveMigration()
        .build()
    }
    
    @Provides
    fun provideProfileDao(database: IapmDatabase): com.iapm.data.local.dao.ProfileDao {
        return database.profileDao()
    }
    
    @Provides
    fun provideMedicationDao(database: IapmDatabase): com.iapm.data.local.dao.MedicationDao {
        return database.medicationDao()
    }
    
    @Provides
    fun provideMedicationHistoryDao(database: IapmDatabase): com.iapm.data.local.dao.MedicationHistoryDao {
        return database.medicationHistoryDao()
    }
}