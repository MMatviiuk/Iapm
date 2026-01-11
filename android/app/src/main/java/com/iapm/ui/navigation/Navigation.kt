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
        // Публічні екрани
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

        // Екрани після входу
        composable(Screen.Dashboard.route) {
            val currentUser by authViewModel.currentUser.collectAsState()

            when (currentUser?.role) {
                com.iapm.domain.model.UserRole.CAREGIVER -> {
                    CaregiverDashboardScreen(
                        onNavigateToPatient = { patientId ->
                            navController.navigate(Screen.CaregiverPatientDetails.createRoute(patientId))
                        },
                        onNavigateToAddPatient = {
                            navController.navigate(Screen.CaregiverAddPatient.route)
                        },
                        onNavigateToAnalytics = {
                            navController.navigate(Screen.CaregiverAnalytics.route)
                        },
                        onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                    )
                }
                com.iapm.domain.model.UserRole.DOCTOR -> {
                    DoctorDashboardScreen(
                        onNavigateToPatient = { patientId ->
                            // TODO: Додати перехід на деталі пацієнта
                        },
                        onNavigateToAddPatient = {
                            // TODO: Додати перехід на додавання пацієнта
                        },
                        onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                    )
                }
                else -> { // Пацієнт або null
                    DashboardScreen(
                        onNavigateToAddMedication = { navController.navigate(Screen.AddMedication.route) },
                        onNavigateToMedications = { navController.navigate(Screen.PatientMedications.route) },
                        onNavigateToHistory = { navController.navigate(Screen.PatientHistory.route) },
                        onNavigateToRewards = { navController.navigate(Screen.PatientRewards.route) },
                        onNavigateToWeekView = { navController.navigate(Screen.PatientWeekView.route) },
                        onNavigateToProfile = { navController.navigate(Screen.PatientProfile.route) },
                        onNavigateToNotifications = { navController.navigate(Screen.PatientNotifications.route) },
                        onNavigateToShareProfile = { navController.navigate(Screen.PatientShareProfile.route) },
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

        composable(Screen.PatientMedications.route) {
            PatientMedicationsScreen(
                onBack = { navController.popBackStack() },
                onMedicationSelected = { medicationId ->
                    navController.navigate(Screen.PatientMedicationDetails.createRoute(medicationId))
                },
                onAddMedication = { navController.navigate(Screen.AddMedication.route) }
            )
        }

        composable(Screen.PatientMedicationDetails.route) { backStackEntry ->
            val medicationId = backStackEntry.arguments?.getString("medicationId") ?: ""
            PatientMedicationDetailsScreen(
                medicationId = medicationId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.PatientHistory.route) {
            PatientHistoryScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.PatientRewards.route) {
            PatientRewardsScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.PatientWeekView.route) {
            PatientWeekViewScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.PatientProfile.route) {
            PatientProfileScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.PatientNotifications.route) {
            PatientNotificationsScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.PatientShareProfile.route) {
            PatientShareProfileScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.CaregiverAnalytics.route) {
            CaregiverAnalyticsScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.CaregiverAddPatient.route) {
            CaregiverAddPatientScreen(
                onBack = { navController.popBackStack() },
                onSave = { navController.popBackStack() }
            )
        }

        composable(Screen.CaregiverPatientDetails.route) { backStackEntry ->
            val patientId = backStackEntry.arguments?.getString("patientId") ?: ""
            CaregiverPatientDetailsScreen(
                patientId = patientId,
                onBack = { navController.popBackStack() },
                onEdit = {
                    navController.navigate(Screen.CaregiverEditPatient.createRoute(patientId))
                },
                onAddMedication = {
                    navController.navigate(Screen.CaregiverAddMedication.createRoute(patientId))
                }
            )
        }

        composable(Screen.CaregiverEditPatient.route) { backStackEntry ->
            val patientId = backStackEntry.arguments?.getString("patientId") ?: ""
            val patientName = if (patientId == "2") "Іван Сидоров" else "Марія Петренко"
            CaregiverEditPatientScreen(
                patientName = patientName,
                onBack = { navController.popBackStack() },
                onSave = { navController.popBackStack() }
            )
        }

        composable(Screen.CaregiverAddMedication.route) { backStackEntry ->
            val patientId = backStackEntry.arguments?.getString("patientId") ?: ""
            CaregiverAddMedicationScreen(
                patientName = if (patientId.isBlank()) "Підопічний" else "Марія Петренко",
                onBack = { navController.popBackStack() },
                onSave = { navController.popBackStack() }
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
    object PatientMedications : Screen("patient_medications")
    object PatientMedicationDetails : Screen("patient_medication_details/{medicationId}") {
        fun createRoute(medicationId: String) = "patient_medication_details/$medicationId"
    }
    object PatientHistory : Screen("patient_history")
    object PatientRewards : Screen("patient_rewards")
    object PatientWeekView : Screen("patient_week_view")
    object PatientProfile : Screen("patient_profile")
    object PatientNotifications : Screen("patient_notifications")
    object PatientShareProfile : Screen("patient_share_profile")
    object CaregiverAnalytics : Screen("caregiver_analytics")
    object CaregiverAddPatient : Screen("caregiver_add_patient")
    object CaregiverPatientDetails : Screen("caregiver_patient_details/{patientId}") {
        fun createRoute(patientId: String) = "caregiver_patient_details/$patientId"
    }
    object CaregiverEditPatient : Screen("caregiver_edit_patient/{patientId}") {
        fun createRoute(patientId: String) = "caregiver_edit_patient/$patientId"
    }
    object CaregiverAddMedication : Screen("caregiver_add_medication/{patientId}") {
        fun createRoute(patientId: String) = "caregiver_add_medication/$patientId"
    }
    object Settings : Screen("settings")
}
