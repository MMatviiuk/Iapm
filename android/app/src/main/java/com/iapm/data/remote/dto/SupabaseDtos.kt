package com.iapm.data.remote.dto

import kotlinx.serialization.Serializable
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Serializable
data class ProfileDto(
    val id: UUID,
    val email: String? = null,
    val first_name: String? = null,
    val last_name: String? = null,
    val date_of_birth: String? = null, // ISO date string
    val gender: String? = null,
    val role: String,
    val photo_url: String? = null,
    val onboarding_complete: Boolean = false,
    val created_at: String? = null, // ISO datetime string
    val updated_at: String? = null
)

@Serializable
data class MedicationDto(
    val id: UUID,
    val user_id: UUID,
    val name: String,
    val dosage: String,
    val form: String = "tablet",
    val frequency: String,
    val times_per_day: List<String>,
    val meal_timing: String = "anytime",
    val days_of_week: List<String> = listOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"),
    val start_date: String, // ISO date string
    val end_date: String? = null,
    val duration: String? = null,
    val instructions: String? = null,
    val condition: String? = null,
    val prescribed_by: String? = null,
    val photo_url: String? = null,
    val active: Boolean = true,
    val created_at: String? = null,
    val updated_at: String? = null
)

@Serializable
data class MedicationHistoryDto(
    val id: UUID,
    val medication_id: UUID,
    val user_id: UUID,
    val date: String, // ISO date string
    val time: String, // ISO time string
    val taken: Boolean,
    val skipped_reason: String? = null,
    val taken_at: String? = null, // ISO datetime string
    val created_at: String? = null
)

@Serializable
data class SyncLogDto(
    val id: UUID,
    val user_id: UUID,
    val table_name: String,
    val record_id: UUID,
    val action: String, // "INSERT", "UPDATE", "DELETE"
    val timestamp: String, // ISO datetime string
    val synced_at: String? = null,
    val device_id: String? = null
)