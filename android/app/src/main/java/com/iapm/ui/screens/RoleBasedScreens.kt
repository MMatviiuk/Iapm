package com.iapm.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun CaregiverDashboardScreen(
    onNavigateToPatient: (String) -> Unit,
    onNavigateToAddPatient: () -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    // Mock data for demonstration
    val patients = listOf(
        PatientCardData(
            id = "1",
            name = "Марія Петренко",
            age = 72,
            medicationsCount = 5,
            adherenceRate = 85,
            lastTaken = "2 години тому",
            nextDose = "Аспірин через 3 години"
        ),
        PatientCardData(
            id = "2",
            name = "Іван Сидоров",
            age = 68,
            medicationsCount = 3,
            adherenceRate = 92,
            lastTaken = "1 годину тому",
            nextDose = "Вітамін D через 5 годин"
        )
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Мої пацієнти",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold
                    )
                )
                Text(
                    text = "Стежте за прийомом ліків близьких",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            IconButton(onClick = onNavigateToSettings) {
                Text("⚙️", fontSize = 24.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick stats
        Row(modifier = Modifier.fillMaxWidth()) {
            StatCard(
                title = "Пацієнтів",
                value = patients.size.toString(),
                icon = "👥",
                modifier = Modifier.weight(1f)
            )
            Spacer(modifier = Modifier.width(12.dp))
            StatCard(
                title = "Середня прихильність",
                value = "88%",
                icon = "📊",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Patients list
        Text(
            text = "Пацієнти",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        patients.forEach { patient ->
            PatientCard(
                patient = patient,
                onClick = { onNavigateToPatient(patient.id) }
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Actions
        OutlinedButton(
            onClick = onNavigateToAddPatient,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("➕ Додати пацієнта")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { /* TODO: Navigate to analytics */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("📈 Аналітика")
        }
    }
}

@Composable
fun DoctorDashboardScreen(
    onNavigateToPatient: (String) -> Unit,
    onNavigateToAddPatient: () -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    // Mock data for demonstration
    val patients = listOf(
        DoctorPatientData(
            id = "1",
            name = "Марія Петренко",
            age = 72,
            condition = "Гіпертонія, діабет",
            medicationsCount = 8,
            adherenceRate = 85,
            riskLevel = "Середній",
            lastVisit = "2 тижні тому"
        ),
        DoctorPatientData(
            id = "2",
            name = "Іван Сидоров",
            age = 68,
            condition = "Артрит",
            medicationsCount = 4,
            adherenceRate = 92,
            riskLevel = "Низький",
            lastVisit = "1 тиждень тому"
        ),
        DoctorPatientData(
            id = "3",
            name = "Ольга Коваленко",
            age = 75,
            condition = "Серцева недостатність",
            medicationsCount = 6,
            adherenceRate = 78,
            riskLevel = "Високий",
            lastVisit = "3 тижні тому"
        )
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Мої пацієнти",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold
                    )
                )
                Text(
                    text = "Моніторте стан здоров'я пацієнтів",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            IconButton(onClick = onNavigateToSettings) {
                Text("⚙️", fontSize = 24.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick stats
        Row(modifier = Modifier.fillMaxWidth()) {
            StatCard(
                title = "Пацієнтів",
                value = patients.size.toString(),
                icon = "👥",
                modifier = Modifier.weight(1f)
            )
            Spacer(modifier = Modifier.width(12.dp))
            StatCard(
                title = "Високий ризик",
                value = patients.count { it.riskLevel == "Високий" }.toString(),
                icon = "⚠️",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Patients list
        Text(
            text = "Пацієнти",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        patients.forEach { patient ->
            DoctorPatientCard(
                patient = patient,
                onClick = { onNavigateToPatient(patient.id) }
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Actions
        OutlinedButton(
            onClick = onNavigateToAddPatient,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("➕ Додати пацієнта")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { /* TODO: Navigate to analytics */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("📊 Звіти та аналітика")
        }
    }
}

data class PatientCardData(
    val id: String,
    val name: String,
    val age: Int,
    val medicationsCount: Int,
    val adherenceRate: Int,
    val lastTaken: String,
    val nextDose: String
)

data class DoctorPatientData(
    val id: String,
    val name: String,
    val age: Int,
    val condition: String,
    val medicationsCount: Int,
    val adherenceRate: Int,
    val riskLevel: String,
    val lastVisit: String
)

@Composable
fun PatientCard(
    patient: PatientCardData,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = patient.name,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                    Text(
                        text = "${patient.age} років",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "${patient.adherenceRate}%",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = when {
                                patient.adherenceRate >= 90 -> MaterialTheme.colorScheme.primary
                                patient.adherenceRate >= 70 -> MaterialTheme.colorScheme.tertiary
                                else -> MaterialTheme.colorScheme.error
                            }
                        )
                    )
                    Text(
                        text = "прихильність",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "💊 ${patient.medicationsCount} ліків",
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = "🕒 ${patient.lastTaken}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "➡️ ${patient.nextDose}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun DoctorPatientCard(
    patient: DoctorPatientData,
    onClick: () -> Unit
) {
    val riskColor = when (patient.riskLevel) {
        "Високий" -> MaterialTheme.colorScheme.error
        "Середній" -> MaterialTheme.colorScheme.tertiary
        else -> MaterialTheme.colorScheme.primary
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = patient.name,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.SemiBold
                            ),
                            modifier = Modifier.weight(1f)
                        )
                        Surface(
                            color = riskColor.copy(alpha = 0.1f),
                            shape = MaterialTheme.shapes.small
                        ) {
                            Text(
                                text = patient.riskLevel,
                                style = MaterialTheme.typography.labelSmall,
                                color = riskColor,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Text(
                        text = "${patient.age} років • ${patient.condition}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "💊 ${patient.medicationsCount} ліків",
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = "${patient.adherenceRate}% прихильність",
                    style = MaterialTheme.typography.bodyMedium,
                    color = when {
                        patient.adherenceRate >= 90 -> MaterialTheme.colorScheme.primary
                        patient.adherenceRate >= 70 -> MaterialTheme.colorScheme.tertiary
                        else -> MaterialTheme.colorScheme.error
                    }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "📅 Останній візит: ${patient.lastVisit}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: String,
    modifier: Modifier = Modifier
) {
    Card(modifier = modifier) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = icon, fontSize = 32.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Bold
                )
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}