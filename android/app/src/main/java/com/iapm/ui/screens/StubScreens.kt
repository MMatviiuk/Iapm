package com.iapm.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit,
    onBackToLogin: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Реєстрація",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            )
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(onClick = onRegisterSuccess) {
            Text("Зареєструватися")
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onBackToLogin) {
            Text("Вже маєте обліковий запис?")
        }
    }
}

@Composable
fun ForgotPasswordScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Відновлення паролю",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            )
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(onClick = onBack) {
            Text("Назад")
        }
    }
}

@Composable
fun DemoScreen(
    onDemoSelected: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Демонстрація",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            )
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(onClick = onDemoSelected) {
            Text("Запустити демо")
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onBack) {
            Text("Назад")
        }
    }
}

@Composable
fun OnboardingScreen(
    onComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Налаштування",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            )
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(onClick = onComplete) {
            Text("Завершити")
        }
    }
}

@Composable
fun DashboardScreen(
    onNavigateToAddMedication: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

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
                    text = "Вітаємо!",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "Ваші ліки на сьогодні",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold
                    )
                )
            }

            IconButton(onClick = onNavigateToSettings) {
                Text("⚙️", fontSize = 24.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Today's medications
        Text(
            text = "Сьогоднішні дози",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Medication cards
        repeat(3) { index ->
            MedicationCard(
                name = "Аспірин ${index + 1}00mg",
                time = "08:00",
                dosage = "1 таблетка",
                taken = index == 0, // First one is taken
                onMarkTaken = { /* TODO */ }
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick stats
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Статистика сьогодні",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    StatItem(
                        title = "Прийнято",
                        value = "2/3",
                        icon = "✅"
                    )
                    StatItem(
                        title = "Пропущено",
                        value = "0",
                        icon = "❌"
                    )
                    StatItem(
                        title = "Дотримання",
                        value = "67%",
                        icon = "📊"
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Action buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = { /* TODO: Show all medications */ },
                modifier = Modifier.weight(1f)
            ) {
                Text("Всі ліки")
            }

            Button(
                onClick = onNavigateToAddMedication,
                modifier = Modifier.weight(1f)
            ) {
                Text("➕ Додати")
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Upcoming reminders
        Text(
            text = "Найближчі нагадування",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        ReminderItem(
            medication = "Вітамін D",
            time = "14:00",
            dosage = "1 капсула"
        )

        Spacer(modifier = Modifier.height(8.dp))

        ReminderItem(
            medication = "Омега-3",
            time = "20:00",
            dosage = "2 капсули"
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Logout button
        TextButton(
            onClick = onLogout,
            modifier = Modifier.align(Alignment.CenterHorizontally)
        ) {
            Text(
                text = "Вийти з облікового запису",
                color = MaterialTheme.colorScheme.error
            )
        }
    }
}

@Composable
fun MedicationCard(
    name: String,
    time: String,
    dosage: String,
    taken: Boolean,
    onMarkTaken: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (taken)
                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.1f)
            else
                MaterialTheme.colorScheme.surface
        )
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
                    text = name,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Text(
                    text = "$dosage • $time",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (taken) {
                Text(
                    text = "✅ Прийнято",
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.labelMedium
                )
            } else {
                Button(onClick = onMarkTaken) {
                    Text("Прийняти")
                }
            }
        }
    }
}

@Composable
fun StatItem(
    title: String,
    value: String,
    icon: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = icon, fontSize = 24.sp)
        Text(
            text = value,
            style = MaterialTheme.typography.headlineSmall.copy(
                fontWeight = FontWeight.Bold
            ),
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = title,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun ReminderItem(
    medication: String,
    time: String,
    dosage: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = medication,
                    style = MaterialTheme.typography.titleSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    )
                )
                Text(
                    text = "$dosage • $time",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Text(
                text = "⏰",
                fontSize = 20.sp
            )
        }
    }
}

@Composable
fun AddMedicationScreen(
    onMedicationAdded: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    // Form state
    var medicationName by remember { mutableStateOf("") }
    var dosage by remember { mutableStateOf("") }
    var form by remember { mutableStateOf("tablet") }
    var frequency by remember { mutableStateOf("once daily") }
    var timesPerDay by remember { mutableStateOf(listOf("08:00")) }
    var mealTiming by remember { mutableStateOf("anytime") }
    var daysOfWeek by remember { mutableStateOf(
        listOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")
    ) }
    var startDate by remember { mutableStateOf(java.time.LocalDate.now()) }
    var duration by remember { mutableStateOf("30 days") }
    var instructions by remember { mutableStateOf("") }
    var condition by remember { mutableStateOf("") }
    var prescribedBy by remember { mutableStateOf("") }

    val forms = listOf("tablet", "capsule", "liquid", "injection", "patch", "other")
    val mealTimings = listOf("before meal", "with meal", "after meal", "anytime")
    val weekDays = listOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Text("⬅️", fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = "Додати ліки",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Bold
                )
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Basic Information
        Text(
            text = "Основна інформація",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Medication name
        OutlinedTextField(
            value = medicationName,
            onValueChange = { medicationName = it },
            label = { Text("Назва ліків *") },
            placeholder = { Text("наприклад: Аспірин, Вітамін D") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

    // Dosage and Form
    Row(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = dosage,
            onValueChange = { dosage = it },
            label = { Text("Дозування *") },
            placeholder = { Text("100mg, 5ml") },
            modifier = Modifier.weight(1f)
        )
        Spacer(modifier = Modifier.width(12.dp))

        // Simple form selector - just show current form, tap to cycle
        OutlinedTextField(
            value = form,
            onValueChange = { },
            readOnly = true,
            label = { Text("Форма") },
            trailingIcon = {
                IconButton(onClick = {
                    val currentIndex = forms.indexOf(form)
                    form = forms[(currentIndex + 1) % forms.size]
                }) {
                    Text("🔄", fontSize = 16.sp)
                }
            },
            modifier = Modifier.weight(1f)
        )
    }

        Spacer(modifier = Modifier.height(24.dp))

        // Schedule
        Text(
            text = "Розклад прийому",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Frequency
        OutlinedTextField(
            value = frequency,
            onValueChange = { frequency = it },
            label = { Text("Частота") },
            placeholder = { Text("раз на день, двічі на день") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Times per day
        Text(
            text = "Час прийому",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))

        timesPerDay.forEachIndexed { index, time ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = time,
                    onValueChange = { newTime ->
                        val newTimes = timesPerDay.toMutableList()
                        newTimes[index] = newTime
                        timesPerDay = newTimes
                    },
                    label = { Text("Час ${index + 1}") },
                    modifier = Modifier.weight(1f)
                )
                if (timesPerDay.size > 1) {
                    IconButton(onClick = {
                        timesPerDay = timesPerDay.toMutableList().apply { removeAt(index) }
                    }) {
                        Text("🗑️", fontSize = 16.sp)
                    }
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        Button(
            onClick = {
                timesPerDay = timesPerDay + "08:00"
            },
            modifier = Modifier.align(Alignment.Start)
        ) {
            Text("➕ Додати час")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Meal timing
        Text(
            text = "Зв'язок з їжею",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))

        Row(modifier = Modifier.fillMaxWidth()) {
            mealTimings.forEach { timing ->
                FilterChip(
                    selected = mealTiming == timing,
                    onClick = { mealTiming = timing },
                    label = { Text(timing) },
                    modifier = Modifier.padding(end = 8.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Days of week
        Text(
            text = "Дні тижня",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))

        LazyRow(modifier = Modifier.fillMaxWidth()) {
            items(weekDays.size) { index ->
                val day = weekDays[index]
                FilterChip(
                    selected = day in daysOfWeek,
                    onClick = {
                        daysOfWeek = if (day in daysOfWeek) {
                            daysOfWeek - day
                        } else {
                            daysOfWeek + day
                        }
                    },
                    label = { Text(day.substring(0, 3).uppercase()) },
                    modifier = Modifier.padding(end = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Duration
        Text(
            text = "Тривалість курсу",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
                value = duration,
                onValueChange = { duration = it },
                label = { Text("Тривалість") },
                placeholder = { Text("30 днів, 3 місяці") },
                modifier = Modifier.weight(1f)
            )
            Spacer(modifier = Modifier.width(12.dp))
            // Start date picker would go here
            OutlinedTextField(
                value = startDate.toString(),
                onValueChange = { },
                label = { Text("Дата початку") },
                readOnly = true,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Additional Information
        Text(
            text = "Додаткова інформація",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = instructions,
            onValueChange = { instructions = it },
            label = { Text("Інструкції") },
            placeholder = { Text("як приймати, особливі вказівки") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = condition,
            onValueChange = { condition = it },
            label = { Text("Для лікування") },
            placeholder = { Text("діагноз або стан здоров'я") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = prescribedBy,
            onValueChange = { prescribedBy = it },
            label = { Text("Призначив") },
            placeholder = { Text("лікар або спеціаліст") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Save button
        Button(
            onClick = onMedicationAdded,
            modifier = Modifier.fillMaxWidth(),
            enabled = medicationName.isNotBlank() && dosage.isNotBlank()
        ) {
            Text(
                text = "💊 Зберегти ліки",
                style = MaterialTheme.typography.titleMedium
            )
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Налаштування",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            )
        )

        Spacer(modifier = Modifier.height(32.dp))

        TextButton(onClick = onBack) {
            Text("Назад")
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onLogout) {
            Text("Вийти")
        }
    }
}

@Composable
fun FullSettingsScreen(
    onBack: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    // Settings state
    var notificationsEnabled by remember { mutableStateOf(true) }
    var reminderTime by remember { mutableStateOf(15) }
    var soundEnabled by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(false) }
    var autoScroll by remember { mutableStateOf(true) }
    var todayFocus by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Text("⬅️", fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = "Налаштування",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Bold
                )
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Profile section
        SettingsSection(title = "Профіль") {
            SettingsItem(
                title = "Особисті дані",
                subtitle = "Ім'я, дата народження, фото",
                icon = "👤",
                onClick = { /* TODO */ }
            )

            SettingsItem(
                title = "Роль користувача",
                subtitle = "Пацієнт, сиделка, лікар",
                icon = "👨‍⚕️",
                onClick = { /* TODO */ }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Notifications section
        SettingsSection(title = "Сповіщення") {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Нагадування про ліки",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "Отримувати сповіщення про прийом ліків",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = notificationsEnabled,
                    onCheckedChange = { notificationsEnabled = it }
                )
            }

            if (notificationsEnabled) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Час нагадування заздалегідь",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "${reminderTime} хв",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }

                Slider(
                    value = reminderTime.toFloat(),
                    onValueChange = { reminderTime = it.toInt() },
                    valueRange = 0f..60f,
                    steps = 12,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Звук сповіщень",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "Відтворювати звук при нагадуваннях",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = soundEnabled,
                    onCheckedChange = { soundEnabled = it }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Appearance section
        SettingsSection(title = "Зовнішній вигляд") {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Темна тема",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "Використовувати темну колірну схему",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = darkMode,
                    onCheckedChange = { darkMode = it }
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Автопрокрутка",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "Автоматично прокручувати до поточної дози",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = autoScroll,
                    onCheckedChange = { autoScroll = it }
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Фокус на сьогодні",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "Показувати тільки сьогоднішні ліки на головній",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = todayFocus,
                    onCheckedChange = { todayFocus = it }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Data & Privacy section
        SettingsSection(title = "Дані та конфіденційність") {
            SettingsItem(
                title = "Експорт даних",
                subtitle = "Завантажити всі ваші дані",
                icon = "📤",
                onClick = { /* TODO */ }
            )

            SettingsItem(
                title = "Резервна копія",
                subtitle = "Створити резервну копію даних",
                icon = "💾",
                onClick = { /* TODO */ }
            )

            SettingsItem(
                title = "Історія прийому",
                subtitle = "Переглянути історію прийому ліків",
                icon = "📋",
                onClick = { /* TODO */ }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Support section
        SettingsSection(title = "Підтримка") {
            SettingsItem(
                title = "Допомога",
                subtitle = "Посібник користувача",
                icon = "❓",
                onClick = { /* TODO */ }
            )

            SettingsItem(
                title = "Зв'язатися з нами",
                subtitle = "Надіслати відгук або повідомити про проблему",
                icon = "📧",
                onClick = { /* TODO */ }
            )

            SettingsItem(
                title = "Про додаток",
                subtitle = "Версія, умови використання, політика конфіденційності",
                icon = "ℹ️",
                onClick = { /* TODO */ }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Account section
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.1f)
            )
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Обліковий запис",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = MaterialTheme.colorScheme.error
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedButton(
                    onClick = { /* TODO: Show delete account dialog */ },
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = MaterialTheme.colorScheme.error
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("🗑️ Видалити обліковий запис")
                }

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = onLogout,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.error
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("🚪 Вийти")
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
fun SettingsSection(
    title: String,
    content: @Composable () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(vertical = 8.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            content()
        }
    }
}

@Composable
fun SettingsItem(
    title: String,
    subtitle: String,
    icon: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = icon,
                fontSize = 24.sp,
                modifier = Modifier.padding(end = 16.dp)
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Text("➡️", fontSize = 16.sp)
    }
}