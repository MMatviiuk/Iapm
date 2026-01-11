package com.iapm.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

private data class MedicationSummary(
    val id: String,
    val name: String,
    val dosage: String,
    val schedule: String,
    val nextDose: String,
    val adherence: Int
)

private data class MedicationDetail(
    val id: String,
    val name: String,
    val dosage: String,
    val schedule: String,
    val instruction: String,
    val duration: String,
    val prescriber: String
)

private data class HistoryEntry(
    val time: String,
    val medication: String,
    val status: String
)

private data class RewardBadge(
    val title: String,
    val description: String
)

private data class WeekSchedule(
    val day: String,
    val items: List<String>
)

private data class CaregiverPatientSummary(
    val id: String,
    val name: String,
    val age: Int,
    val adherence: Int,
    val medications: Int,
    val lastTaken: String
)

@Composable
fun PatientMedicationsScreen(
    onBack: () -> Unit,
    onMedicationSelected: (String) -> Unit,
    onAddMedication: () -> Unit,
    modifier: Modifier = Modifier
) {
    val medications = remember {
        listOf(
            MedicationSummary(
                id = "med_1",
                name = "Аспірин",
                dosage = "100 мг",
                schedule = "08:00, 20:00",
                nextDose = "сьогодні о 20:00",
                adherence = 92
            ),
            MedicationSummary(
                id = "med_2",
                name = "Вітамін D",
                dosage = "1 капсула",
                schedule = "09:00",
                nextDose = "завтра о 09:00",
                adherence = 87
            ),
            MedicationSummary(
                id = "med_3",
                name = "Омега-3",
                dosage = "2 капсули",
                schedule = "13:00",
                nextDose = "сьогодні о 13:00",
                adherence = 78
            )
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Мої ліки", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(medications) { medication ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    onClick = { onMedicationSelected(medication.id) }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = medication.name,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.SemiBold
                            )
                        )
                        Text(
                            text = "${medication.dosage} • ${medication.schedule}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Наступна доза: ${medication.nextDose}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Прихильність: ${medication.adherence}%",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = onAddMedication,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Додати ліки")
        }
    }
}

@Composable
fun PatientMedicationDetailsScreen(
    medicationId: String,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val details = remember(medicationId) {
        val sample = listOf(
            MedicationDetail(
                id = "med_1",
                name = "Аспірин",
                dosage = "100 мг",
                schedule = "08:00, 20:00",
                instruction = "Приймати після їжі",
                duration = "30 днів",
                prescriber = "Лікар Коваль"
            ),
            MedicationDetail(
                id = "med_2",
                name = "Вітамін D",
                dosage = "1 капсула",
                schedule = "09:00",
                instruction = "Запивати водою",
                duration = "60 днів",
                prescriber = "Сімейний лікар"
            )
        )
        sample.firstOrNull { it.id == medicationId } ?: MedicationDetail(
            id = medicationId,
            name = "Препарат",
            dosage = "1 доза",
            schedule = "08:00",
            instruction = "Дотримуватися інструкції лікаря",
            duration = "14 днів",
            prescriber = "Лікар"
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Деталі ліків", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = details.name,
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Дозування: ${details.dosage}")
                Text(text = "Розклад: ${details.schedule}")
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Інструкції: ${details.instruction}",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Тривалість: ${details.duration}")
                Text(text = "Призначив: ${details.prescriber}")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
            )
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Нагадування",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text("Наступна доза: сьогодні о 20:00")
                Text("Повторюється щодня")
            }
        }
    }
}

@Composable
fun PatientHistoryScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val history = remember {
        listOf(
            HistoryEntry("09:00", "Вітамін D", "Прийнято"),
            HistoryEntry("08:00", "Аспірин", "Прийнято"),
            HistoryEntry("Вчора 20:00", "Омега-3", "Пропущено"),
            HistoryEntry("Вчора 08:00", "Аспірин", "Прийнято")
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Історія прийому", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(history) { entry ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = entry.medication,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                            Text(
                                text = entry.time,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            text = entry.status,
                            style = MaterialTheme.typography.bodyMedium,
                            color = if (entry.status == "Прийнято")
                                MaterialTheme.colorScheme.primary
                            else
                                MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun PatientRewardsScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val rewards = remember {
        listOf(
            RewardBadge("Тиждень без пропусків", "7 днів поспіль всі дози виконано"),
            RewardBadge("Стабільний графік", "90% прихильності за місяць"),
            RewardBadge("Перший місяць", "30 днів з додатком")
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Нагороди", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Ваш прогрес",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text("Поточна серія: 5 днів")
                Text("Середня прихильність: 86%")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(rewards) { reward ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Star,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = reward.title,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                            Text(
                                text = reward.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PatientWeekViewScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val schedule = remember {
        listOf(
            WeekSchedule("Понеділок", listOf("08:00 Аспірин", "20:00 Аспірин")),
            WeekSchedule("Вівторок", listOf("09:00 Вітамін D", "20:00 Омега-3")),
            WeekSchedule("Середа", listOf("08:00 Аспірин", "13:00 Омега-3")),
            WeekSchedule("Четвер", listOf("09:00 Вітамін D")),
            WeekSchedule("П'ятниця", listOf("08:00 Аспірин", "20:00 Аспірин")),
            WeekSchedule("Субота", listOf("09:00 Вітамін D")),
            WeekSchedule("Неділя", listOf("08:00 Аспірин"))
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Тижневий план", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(schedule) { day ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = day.day,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.SemiBold
                            )
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        day.items.forEach { item ->
                            Text(
                                text = item,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PatientProfileScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var name by remember { mutableStateOf("Марія Петренко") }
    var birthDate by remember { mutableStateOf("12.04.1952") }
    var phone by remember { mutableStateOf("+380 67 123 45 67") }
    var email by remember { mutableStateOf("maria.petrenko@email.com") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Профіль", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("ПІБ") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = birthDate,
            onValueChange = { birthDate = it },
            label = { Text("Дата народження") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Телефон") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = { },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Зберегти зміни")
        }
    }
}

@Composable
fun PatientNotificationsScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var medicationReminders by remember { mutableStateOf(true) }
    var caregiverAlerts by remember { mutableStateOf(false) }
    var weeklySummary by remember { mutableStateOf(true) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Сповіщення", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        NotificationToggle(
            title = "Нагадування про ліки",
            subtitle = "Надсилати сповіщення перед прийомом",
            checked = medicationReminders,
            onCheckedChange = { medicationReminders = it }
        )
        NotificationToggle(
            title = "Оповіщення для опікуна",
            subtitle = "Повідомляти про пропущені дози",
            checked = caregiverAlerts,
            onCheckedChange = { caregiverAlerts = it }
        )
        NotificationToggle(
            title = "Щотижневий підсумок",
            subtitle = "Отримувати звіт про прихильність",
            checked = weeklySummary,
            onCheckedChange = { weeklySummary = it }
        )
    }
}

@Composable
fun PatientShareProfileScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Поділитися профілем", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Посилання для доступу",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "iapm.app/share/ABCD-1234",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedButton(onClick = { }) {
                    Icon(imageVector = Icons.Filled.Share, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Скопіювати посилання")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Кому відкрито доступ",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(8.dp))

        AccessItem(name = "Катерина Беннет", role = "Опікун")
        AccessItem(name = "Лікар Олена Литвин", role = "Лікар")
    }
}

@Composable
fun CaregiverAnalyticsScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Аналітика", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            AnalyticsCard(title = "Підопічних", value = "4")
            AnalyticsCard(title = "Середня прихильність", value = "89%")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Підопічні з ризиком",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text("Іван Сидоров • 68% прихильності")
                Text("Ольга Коваленко • 72% прихильності")
            }
        }
    }
}

@Composable
fun CaregiverAddPatientScreen(
    onBack: () -> Unit,
    onSave: () -> Unit,
    modifier: Modifier = Modifier
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var relationship by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Додати підопічного", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("ПІБ") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Телефон") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = relationship,
            onValueChange = { relationship = it },
            label = { Text("Стосунок") },
            placeholder = { Text("донька, син, опікун") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onSave,
            modifier = Modifier.fillMaxWidth(),
            enabled = name.isNotBlank() && email.isNotBlank()
        ) {
            Text("Зберегти")
        }
    }
}

@Composable
fun CaregiverEditPatientScreen(
    patientName: String,
    onBack: () -> Unit,
    onSave: () -> Unit,
    modifier: Modifier = Modifier
) {
    var name by remember { mutableStateOf(patientName) }
    var phone by remember { mutableStateOf("+380 67 987 65 43") }
    var notes by remember { mutableStateOf("Потрібні нагадування після обіду") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Редагувати підопічного", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("ПІБ") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Телефон") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = notes,
            onValueChange = { notes = it },
            label = { Text("Нотатки") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onSave,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Оновити дані")
        }
    }
}

@Composable
fun CaregiverPatientDetailsScreen(
    patientId: String,
    onBack: () -> Unit,
    onEdit: () -> Unit,
    onAddMedication: () -> Unit,
    modifier: Modifier = Modifier
) {
    val patient = remember(patientId) {
        CaregiverPatientSummary(
            id = patientId,
            name = "Марія Петренко",
            age = 72,
            adherence = 85,
            medications = 5,
            lastTaken = "2 години тому"
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Підопічний", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = patient.name,
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Text(
                    text = "${patient.age} років",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text("Ліків: ${patient.medications}")
                Text("Прихильність: ${patient.adherence}%")
                Text("Останній прийом: ${patient.lastTaken}")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Контакти",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Spacer(modifier = Modifier.height(8.dp))
                ContactRow(icon = Icons.Filled.Phone, value = "+380 67 123 45 67")
                ContactRow(icon = Icons.Filled.Email, value = "maria.petrenko@email.com")
                ContactRow(icon = Icons.Filled.Call, value = "Бажаний час дзвінка: 10:00")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Поточні ліки",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(8.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Аспірин • 08:00, 20:00")
                Divider(modifier = Modifier.padding(vertical = 8.dp))
                Text("Вітамін D • 09:00")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedButton(
                onClick = onEdit,
                modifier = Modifier.weight(1f)
            ) {
                Text("Редагувати")
            }
            Button(
                onClick = onAddMedication,
                modifier = Modifier.weight(1f)
            ) {
                Text("Додати ліки")
            }
        }
    }
}

@Composable
fun CaregiverAddMedicationScreen(
    patientName: String,
    onBack: () -> Unit,
    onSave: () -> Unit,
    modifier: Modifier = Modifier
) {
    var name by remember { mutableStateOf("") }
    var dosage by remember { mutableStateOf("") }
    var schedule by remember { mutableStateOf("") }
    var instructions by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ScreenHeader(title = "Ліки для $patientName", onBack = onBack)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Назва ліків") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = dosage,
            onValueChange = { dosage = it },
            label = { Text("Дозування") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = schedule,
            onValueChange = { schedule = it },
            label = { Text("Розклад") },
            placeholder = { Text("08:00, 20:00") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = instructions,
            onValueChange = { instructions = it },
            label = { Text("Інструкції") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onSave,
            modifier = Modifier.fillMaxWidth(),
            enabled = name.isNotBlank() && dosage.isNotBlank()
        ) {
            Text("Зберегти ліки")
        }
    }
}

@Composable
private fun ScreenHeader(
    title: String,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onBack) {
            Icon(
                imageVector = Icons.Filled.ArrowBack,
                contentDescription = "Назад"
            )
        }
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.headlineSmall.copy(
                fontWeight = FontWeight.Bold
            )
        )
    }
}

@Composable
private fun NotificationToggle(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(bottom = 12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Icon(
                imageVector = Icons.Filled.Notifications,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Switch(checked = checked, onCheckedChange = onCheckedChange)
        }
    }
}

@Composable
private fun AccessItem(
    name: String,
    role: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(bottom = 8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Filled.Person,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = name,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Text(
                    text = role,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun AnalyticsCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.weight(1f),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Filled.Assessment,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold
                )
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun ContactRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(text = value, style = MaterialTheme.typography.bodyMedium)
    }
}
