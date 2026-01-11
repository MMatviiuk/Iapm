package com.iapm.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.iapm.ui.screens.*
import com.iapm.ui.viewmodel.AuthViewModel

@Composable
fun IapmNavigation() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = hiltViewModel()
    val currentUser by authViewModel.currentUser.collectAsState()

    val startDestination = if (currentUser != null) {
        Screen.Dashboard.route
    } else {
        Screen.Landing.route
    }

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // Public screens
        composable(Screen.Landing.route) {
            LandingScreen(
                onGetStarted = { navController.navigate(Screen.Register.route) },
                onSignIn = { navController.navigate(Screen.Login.route) },
                onQuickDemo = { navController.navigate(Screen.Demo.route) }
            )
        }

        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = { navController.navigate(Screen.Dashboard.route) },
                onSignUp = { navController.navigate(Screen.Register.route) },
                onForgotPassword = { navController.navigate(Screen.ForgotPassword.route) },
                onDemo = { navController.navigate(Screen.Demo.route) }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                onRegisterSuccess = { navController.navigate(Screen.Onboarding.route) },
                onBackToLogin = { navController.navigate(Screen.Login.route) }
            )
        }

        composable(Screen.ForgotPassword.route) {
            ForgotPasswordScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Demo.route) {
            DemoScreen(
                onDemoSelected = { navController.navigate(Screen.Dashboard.route) },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onComplete = { navController.navigate(Screen.Dashboard.route) }
            )
        }

        // Authenticated screens
        composable(Screen.Dashboard.route) {
            val currentUser by authViewModel.currentUser.collectAsState()

            when (currentUser?.role) {
                com.iapm.domain.model.UserRole.CAREGIVER -> {
                    CaregiverDashboardScreen(
                        onNavigateToPatient = { patientId ->
                            // TODO: Navigate to patient details
                        },
                        onNavigateToAddPatient = {
                            // TODO: Navigate to add patient
                        },
                        onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                    )
                }
                com.iapm.domain.model.UserRole.DOCTOR -> {
                    DoctorDashboardScreen(
                        onNavigateToPatient = { patientId ->
                            // TODO: Navigate to patient details
                        },
                        onNavigateToAddPatient = {
                            // TODO: Navigate to add patient
                        },
                        onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                    )
                }
                else -> { // PATIENT or null
                    DashboardScreen(
                        onNavigateToAddMedication = { navController.navigate(Screen.AddMedication.route) },
                        onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                        onLogout = {
                            authViewModel.logout()
                            navController.navigate(Screen.Landing.route) {
                                popUpTo(Screen.Landing.route) { inclusive = true }
                            }
                        }
                    )
                }
            }
        }

        composable(Screen.AddMedication.route) {
            AddMedicationScreen(
                onMedicationAdded = { navController.popBackStack() },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            FullSettingsScreen(
                onBack = { navController.popBackStack() },
                onLogout = {
                    authViewModel.logout()
                    navController.navigate(Screen.Landing.route) {
                        popUpTo(Screen.Landing.route) { inclusive = true }
                    }
                }
            )
        }
    }
}

sealed class Screen(val route: String) {
    object Landing : Screen("landing")
    object Login : Screen("login")
    object Register : Screen("register")
    object ForgotPassword : Screen("forgot_password")
    object Demo : Screen("demo")
    object Onboarding : Screen("onboarding")
    object Dashboard : Screen("dashboard")
    object AddMedication : Screen("add_medication")
    object PatientDetails : Screen("patient_details")
    object AddPatient : Screen("add_patient")
    object Settings : Screen("settings")
}