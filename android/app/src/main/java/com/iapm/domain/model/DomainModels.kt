package com.iapm.domain.model

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.UUID

data class User(
    val id: UUID,
    val email: String,
    val firstName: String,
    val lastName: String,
    val dateOfBirth: LocalDate,
    val gender: String,
    val role: UserRole,
    val photoUrl: String? = null,
    val onboardingComplete: Boolean = false,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class UserRole {
    PATIENT, CAREGIVER, DOCTOR
}

data class Medication(
    val id: UUID,
    val userId: UUID,
    val name: String,
    val dosage: String,
    val form: MedicationForm = MedicationForm.TABLET,
    val frequency: String,
    val timesPerDay: List<LocalTime>,
    val mealTiming: MealTiming = MealTiming.ANYTIME,
    val daysOfWeek: List<DayOfWeek> = DayOfWeek.values().toList(),
    val startDate: LocalDate,
    val endDate: LocalDate? = null,
    val duration: String? = null,
    val instructions: String? = null,
    val condition: String? = null,
    val prescribedBy: String? = null,
    val photoUrl: String? = null,
    val active: Boolean = true,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class MedicationForm {
    TABLET, CAPSULE, LIQUID, INJECTION, PATCH, OTHER
}

enum class MealTiming {
    BEFORE_MEAL, WITH_MEAL, AFTER_MEAL, ANYTIME
}

enum class DayOfWeek {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

data class MedicationHistory(
    val id: UUID,
    val medicationId: UUID,
    val userId: UUID,
    val date: LocalDate,
    val time: LocalTime,
    val taken: Boolean,
    val skippedReason: String? = null,
    val takenAt: LocalDateTime = LocalDateTime.now(),
    val createdAt: LocalDateTime = LocalDateTime.now()
)

data class MedicationAdherence(
    val medicationId: UUID,
    val medicationName: String,
    val totalDoses: Int,
    val takenDoses: Int,
    val percentage: Double,
    val last7Days: Double,
    val last30Days: Double
)

data class DashboardStats(
    val totalMedications: Int,
    val activeMedications: Int,
    val todaysDoses: Int,
    val dosesTaken: Int,
    val adherenceRate: Double,
    val upcomingDoses: List<UpcomingDose>
)

data class UpcomingDose(
    val medicationId: UUID,
    val medicationName: String,
    val time: LocalTime,
    val dosage: String
)