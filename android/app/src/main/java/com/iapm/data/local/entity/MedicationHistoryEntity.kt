package com.iapm.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.UUID

@Entity(tableName = "medication_history")
data class MedicationHistoryEntity(
    @PrimaryKey
    val id: UUID,
    val medicationId: UUID,
    val userId: UUID,
    val date: LocalDate,
    val time: LocalTime,
    val taken: Boolean,
    val skippedReason: String?,
    val takenAt: LocalDateTime = LocalDateTime.now(),
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val isSynced: Boolean = false,
    val lastSyncAt: LocalDateTime? = null,
    val syncAction: String? = null
)