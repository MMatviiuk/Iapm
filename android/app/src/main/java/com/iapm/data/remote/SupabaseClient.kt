package com.iapm.data.remote

import com.iapm.BuildConfig
import com.iapm.data.remote.dto.*
import io.github.jan-tennert.supabase.SupabaseClient
import io.github.jan-tennert.supabase.auth.Auth
import io.github.jan-tennert.supabase.auth.auth
import io.github.jan-tennert.supabase.postgrest.Postgrest
import io.github.jan-tennert.supabase.postgrest.postgrest
import io.github.jan-tennert.supabase.realtime.Realtime
import io.github.jan-tennert.supabase.realtime.realtime
import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseClient @Inject constructor() {
    
    private val client = SupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_ANON_KEY
    ) {
        install(Postgrest)
        install(Auth)
        install(Realtime)
        
        val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    isLenient = true
                })
            }
            
            install(Logging) {
                logger = Logger.DEFAULT
                level = LogLevel.INFO
            }
        }
        
        defaultHttpClient = httpClient
    }
    
    val auth: Auth = client.auth
    val postgrest: Postgrest = client.postgrest
    val realtime: Realtime = client.realtime
    
    // Profile operations
    suspend fun getProfile(userId: String): ProfileDto? {
        return try {
            postgrest["profiles"]
                .select {
                    eq("id", userId)
                }
                .decodeSingleOrNull<ProfileDto>()
        } catch (e: Exception) {
            null
        }
    }
    
    suspend fun updateProfile(userId: String, updates: Map<String, Any>): ProfileDto? {
        return try {
            postgrest["profiles"]
                .update(updates) {
                    eq("id", userId)
                }
                .decodeSingleOrNull<ProfileDto>()
        } catch (e: Exception) {
            null
        }
    }
    
    // Medication operations
    suspend fun getMedications(userId: String): List<MedicationDto> {
        return try {
            postgrest["medications"]
                .select {
                    eq("user_id", userId)
                    order("created_at", order = Order.ASCENDING)
                }
                .decodeList<MedicationDto>()
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    suspend fun insertMedication(medication: MedicationDto): MedicationDto? {
        return try {
            postgrest["medications"]
                .insert(medication)
                .decodeSingleOrNull<MedicationDto>()
        } catch (e: Exception) {
            null
        }
    }
    
    suspend fun updateMedication(id: String, updates: Map<String, Any>): MedicationDto? {
        return try {
            postgrest["medications"]
                .update(updates) {
                    eq("id", id)
                }
                .decodeSingleOrNull<MedicationDto>()
        } catch (e: Exception) {
            null
        }
    }
    
    suspend fun deleteMedication(id: String): Boolean {
        return try {
            postgrest["medications"]
                .delete {
                    eq("id", id)
                }
                .decodeSingleOrNull<MedicationDto>()
            true
        } catch (e: Exception) {
            false
        }
    }
    
    // Medication History operations
    suspend fun getMedicationHistory(userId: String): List<MedicationHistoryDto> {
        return try {
            postgrest["medication_history"]
                .select {
                    eq("user_id", userId)
                    order("created_at", order = Order.DESCENDING)
                }
                .decodeList<MedicationHistoryDto>()
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    suspend fun insertMedicationHistory(history: MedicationHistoryDto): MedicationHistoryDto? {
        return try {
            postgrest["medication_history"]
                .insert(history)
                .decodeSingleOrNull<MedicationHistoryDto>()
        } catch (e: Exception) {
            null
        }
    }
    
    // Sync operations
    suspend fun getSyncLogs(userId: String, since: String? = null): List<SyncLogDto> {
        return try {
            val query = postgrest["sync_log"]
                .select {
                    eq("user_id", userId)
                    order("timestamp", order = Order.ASCENDING)
                }
            
            if (since != null) {
                query.gte("timestamp", since)
            }
            
            query.decodeList<SyncLogDto>()
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    suspend fun insertSyncLog(syncLog: SyncLogDto): SyncLogDto? {
        return try {
            postgrest["sync_log"]
                .insert(syncLog)
                .decodeSingleOrNull<SyncLogDto>()
        } catch (e: Exception) {
            null
        }
    }
    
    // Realtime subscriptions
    fun subscribeToMedications(userId: String): Flow<MedicationDto> {
        return realtime.channel("medications_user_$userId") {
            postgrest.listen("medications") {
                eq("user_id", userId)
            }
        }.map { it.data as MedicationDto }
    }
    
    fun subscribeToProfile(userId: String): Flow<ProfileDto> {
        return realtime.channel("profile_user_$userId") {
            postgrest.listen("profiles") {
                eq("id", userId)
            }
        }.map { it.data as ProfileDto }
    }
}