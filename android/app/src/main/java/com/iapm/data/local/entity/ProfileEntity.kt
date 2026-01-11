package com.iapm.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Entity(tableName = "profiles")
data class ProfileEntity(
    @PrimaryKey
    val id: UUID,
    val email: String?,
    val firstName: String?,
    val lastName: String?,
    val dateOfBirth: LocalDate?,
    val gender: String?,
    val role: String,
    val photoUrl: String?,
    val onboardingComplete: Boolean = false,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val isSynced: Boolean = false,
    val lastSyncAt: LocalDateTime? = null
)