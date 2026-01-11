package com.iapm.data.repository

import android.util.Log
import com.iapm.data.local.dao.ProfileDao
import com.iapm.data.remote.SupabaseClient
import com.iapm.domain.model.User
import com.iapm.domain.model.UserRole
import com.iapm.domain.repository.AuthRepository
import com.iapm.domain.repository.RegisterData
import kotlinx.coroutines.flow.first
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val profileDao: ProfileDao,
    private val supabaseClient: SupabaseClient
) : AuthRepository {

    private val TAG = "AuthRepository"

    override suspend fun login(email: String, password: String, rememberMe: Boolean): Result<User> {
        return try {
            Log.d(TAG, "Attempting login for: $email")

            val response = supabaseClient.auth.signInWithPassword(
                email = email,
                password = password
            )

            if (response.user != null) {
                // Get or create profile
                val profile = supabaseClient.getProfile(response.user?.id ?: "")
                if (profile != null) {
                    val user = profile.toDomain()
                    profileDao.insertProfile(user.toEntity())

                    Log.d(TAG, "Login successful for user: ${user.email}")
                    Result.success(user)
                } else {
                    Result.failure(Exception("Profile not found"))
                }
            } else {
                Log.e(TAG, "Login failed: invalid credentials")
                Result.failure(Exception("Invalid email or password"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Login error", e)
            Result.failure(e)
        }
    }

    override suspend fun register(userData: RegisterData): Result<User> {
        return try {
            Log.d(TAG, "Attempting registration for: ${userData.email}")

            val response = supabaseClient.auth.signUpWith(
                Email = userData.email,
                Password = userData.password,
                data = mapOf(
                    "name" to userData.name,
                    "role" to userData.role.name.lowercase(),
                    "date_of_birth" to userData.dateOfBirth.toString()
                )
            )

            if (response.user != null) {
                // Create profile
                val profileDto = mapOf(
                    "id" to response.user?.id,
                    "email" to userData.email,
                    "first_name" to userData.name.split(" ").firstOrNull() ?: "",
                    "last_name" to userData.name.split(" ").getOrNull(1) ?: "",
                    "date_of_birth" to userData.dateOfBirth.toString(),
                    "gender" to "other",
                    "role" to userData.role.name.lowercase(),
                    "onboarding_complete" to false
                )

                supabaseClient.updateProfile(response.user?.id ?: "", profileDto)

                val user = User(
                    id = UUID.fromString(response.user?.id ?: ""),
                    email = userData.email,
                    firstName = userData.name.split(" ").firstOrNull() ?: "",
                    lastName = userData.name.split(" ").getOrNull(1) ?: "",
                    dateOfBirth = userData.dateOfBirth,
                    gender = "other",
                    role = userData.role,
                    onboardingComplete = false
                )

                profileDao.insertProfile(user.toEntity())

                Log.d(TAG, "Registration successful for user: ${user.email}")
                Result.success(user)
            } else {
                Result.failure(Exception("Registration failed"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Registration error", e)
            Result.failure(e)
        }
    }

    override suspend fun loginWithGoogle(): Result<User> {
        return try {
            // For now, return failure - OAuth needs more setup
            Result.failure(Exception("Google login not implemented yet"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun logout(): Result<Unit> {
        return try {
            supabaseClient.auth.signOut()
            // Clear local data will be handled by ViewModel
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCurrentUser(): Result<User> {
        return try {
            val currentUser = supabaseClient.auth.currentUserOrNull()
            if (currentUser != null) {
                val profile = supabaseClient.getProfile(currentUser.id)
                if (profile != null) {
                    Result.success(profile.toDomain())
                } else {
                    Result.failure(Exception("Profile not found"))
                }
            } else {
                Result.failure(Exception("No authenticated user"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteAccount(): Result<Unit> {
        return try {
            val currentUser = supabaseClient.auth.currentUserOrNull()
            if (currentUser != null) {
                supabaseClient.auth.admin.deleteUser(currentUser.id)
                Result.success(Unit)
            } else {
                Result.failure(Exception("No authenticated user"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}