package com.iapm.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Entity(tableName = "medications")
data class MedicationEntity(
    @PrimaryKey
    val id: UUID,
    val userId: UUID,
    val name: String,
    val dosage: String,
    val form: String = "tablet",
    val frequency: String,
    val timesPerDay: List<String>,
    val mealTiming: String = "anytime",
    val daysOfWeek: List<String> = listOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"),
    val startDate: LocalDate,
    val endDate: LocalDate?,
    val duration: String?,
    val instructions: String?,
    val condition: String?,
    val prescribedBy: String?,
    val photoUrl: String?,
    val active: Boolean = true,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val isSynced: Boolean = false,
    val lastSyncAt: LocalDateTime? = null,
    val syncAction: String? = null // "INSERT", "UPDATE", "DELETE"
)