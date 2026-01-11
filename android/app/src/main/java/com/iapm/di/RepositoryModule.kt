package com.iapm.di

import com.iapm.data.remote.SupabaseClient
import com.iapm.data.repository.AuthRepositoryImpl
import com.iapm.data.repository.MedicationRepositoryImpl
import com.iapm.domain.repository.AuthRepository
import com.iapm.domain.repository.MedicationRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideAuthRepository(
        supabaseClient: SupabaseClient
    ): AuthRepository {
        return AuthRepositoryImpl(
            profileDao = TODO("Implement profile DAO"),
            supabaseClient = supabaseClient
        )
    }

    @Provides
    @Singleton
    fun provideMedicationRepository(
        medicationRepositoryImpl: MedicationRepositoryImpl
    ): MedicationRepository = medicationRepositoryImpl

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return SupabaseClient()
    }
}