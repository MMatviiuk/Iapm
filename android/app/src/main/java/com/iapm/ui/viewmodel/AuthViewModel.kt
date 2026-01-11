package com.iapm.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.iapm.domain.model.User
import com.iapm.domain.repository.AuthRepository
import com.iapm.domain.repository.RegisterData
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _loginState = MutableStateFlow<AuthState>(AuthState.Idle)
    val loginState: StateFlow<AuthState> = _loginState

    private val _registerState = MutableStateFlow<AuthState>(AuthState.Idle)
    val registerState: StateFlow<AuthState> = _registerState

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser

    init {
        checkCurrentUser()
    }

    fun login(email: String, password: String, rememberMe: Boolean = false) {
        viewModelScope.launch {
            _loginState.value = AuthState.Loading

            val result = authRepository.login(email, password, rememberMe)
            result.fold(
                onSuccess = { user ->
                    _currentUser.value = user
                    _loginState.value = AuthState.Success(user)
                },
                onFailure = { error ->
                    _loginState.value = AuthState.Error(error.message ?: "Login failed")
                }
            )
        }
    }

    fun register(
        email: String,
        password: String,
        name: String,
        role: String,
        dateOfBirth: LocalDate
    ) {
        viewModelScope.launch {
            _registerState.value = AuthState.Loading

            val userRole = when (role.lowercase()) {
                "caregiver" -> com.iapm.domain.model.UserRole.CAREGIVER
                "doctor" -> com.iapm.domain.model.UserRole.DOCTOR
                else -> com.iapm.domain.model.UserRole.PATIENT
            }

            val registerData = RegisterData(
                email = email,
                password = password,
                name = name,
                role = userRole,
                dateOfBirth = dateOfBirth
            )

            val result = authRepository.register(registerData)
            result.fold(
                onSuccess = { user ->
                    _currentUser.value = user
                    _registerState.value = AuthState.Success(user)
                },
                onFailure = { error ->
                    _registerState.value = AuthState.Error(error.message ?: "Registration failed")
                }
            )
        }
    }

    fun loginWithGoogle() {
        viewModelScope.launch {
            _loginState.value = AuthState.Loading

            val result = authRepository.loginWithGoogle()
            result.fold(
                onSuccess = { user ->
                    _currentUser.value = user
                    _loginState.value = AuthState.Success(user)
                },
                onFailure = { error ->
                    _loginState.value = AuthState.Error("Google login not available")
                }
            )
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _currentUser.value = null
            _loginState.value = AuthState.Idle
        }
    }

    private fun checkCurrentUser() {
        viewModelScope.launch {
            val result = authRepository.getCurrentUser()
            result.fold(
                onSuccess = { user ->
                    _currentUser.value = user
                },
                onFailure = {
                    _currentUser.value = null
                }
            )
        }
    }

    fun clearStates() {
        _loginState.value = AuthState.Idle
        _registerState.value = AuthState.Idle
    }

    sealed class AuthState {
        object Idle : AuthState()
        object Loading : AuthState()
        data class Success(val user: User) : AuthState()
        data class Error(val message: String) : AuthState()
    }
}