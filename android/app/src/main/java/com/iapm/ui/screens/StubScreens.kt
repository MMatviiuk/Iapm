package com.iapm.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.InsertChart
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

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
    onNavigateToMedications: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToRewards: () -> Unit,
    onNavigateToWeekView: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToNotifications: () -> Unit,
    onNavigateToShareProfile: () -> Unit,
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
        // Заголовок
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
                Icon(
                    imageVector = Icons.Filled.Settings,
                    contentDescription = "Налаштування"
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Ліки на сьогодні
        Text(
            text = "Сьогоднішні дози",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Картки ліків
        repeat(3) { index ->
            MedicationCard(
                name = "Аспірин ${index + 1}00mg",
                time = "08:00",
                dosage = "1 таблетка",
                taken = index == 0, // Перша доза вже прийнята
                onMarkTaken = { /* TODO: додати збереження прийому */ }
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Швидка статистика
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
                        icon = Icons.Filled.CheckCircle
                    )
                    StatItem(
                        title = "Пропущено",
                        value = "0",
                        icon = Icons.Filled.Warning
                    )
                    StatItem(
                        title = "Дотримання",
                        value = "67%",
                        icon = Icons.Filled.InsertChart
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Кнопки дій
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onNavigateToMedications,
                modifier = Modifier.weight(1f)
            ) {
                Text("Всі ліки")
            }

            Button(
                onClick = onNavigateToAddMedication,
                modifier = Modifier.weight(1f)
            ) {
                Text("Додати")
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Швидкі дії",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        ActionButton(
            title = "Мої ліки",
            onClick = onNavigateToMedications
        )
        ActionButton(
            title = "Історія прийому",
            onClick = onNavigateToHistory
        )
        ActionButton(
            title = "Нагороди",
            onClick = onNavigateToRewards
        )
        ActionButton(
            title = "Тижневий план",
            onClick = onNavigateToWeekView
        )
        ActionButton(
            title = "Сповіщення",
            onClick = onNavigateToNotifications
        )
        ActionButton(
            title = "Профіль",
            onClick = onNavigateToProfile
        )
        ActionButton(
            title = "Поділитися профілем",
            onClick = onNavigateToShareProfile
        )

        // Найближчі нагадування
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

        // Кнопка виходу
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
fun ActionButton(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Text(title)
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
                    text = "Прийнято",
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
    icon: ImageVector
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary
        )
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

            Icon(
                imageVector = Icons.Filled.AccessTime,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
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

    // Стан форми
    var medicationName by remember { mutableStateOf("") }
    var dosage by remember { mutableStateOf("") }
    var form by remember { mutableStateOf("таблетка") }
    var frequency by remember { mutableStateOf("раз на день") }
    var timesPerDay by remember { mutableStateOf(listOf("08:00")) }
    var mealTiming by remember { mutableStateOf("будь-коли") }
    var daysOfWeek by remember { mutableStateOf(
        listOf("Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя")
    ) }
    var startDate by remember { mutableStateOf(java.time.LocalDate.now()) }
    var duration by remember { mutableStateOf("30 days") }
    var instructions by remember { mutableStateOf("") }
    var condition by remember { mutableStateOf("") }
    var prescribedBy by remember { mutableStateOf("") }

    val forms = listOf("таблетка", "капсула", "рідина", "ін'єкція", "пластир", "інше")
    val mealTimings = listOf("до їжі", "під час їжі", "після їжі", "будь-коли")
    val weekDays = listOf("Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя")

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Заголовок
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Filled.ArrowBack,
                    contentDescription = "Назад"
                )
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

        // Основна інформація
        Text(
            text = "Основна інформація",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Назва ліків
        OutlinedTextField(
            value = medicationName,
            onValueChange = { medicationName = it },
            label = { Text("Назва ліків *") },
            placeholder = { Text("наприклад: Аспірин, Вітамін D") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

    // Дозування та форма
    Row(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = dosage,
            onValueChange = { dosage = it },
            label = { Text("Дозування *") },
            placeholder = { Text("100mg, 5ml") },
            modifier = Modifier.weight(1f)
        )
        Spacer(modifier = Modifier.width(12.dp))

        // Простий вибір форми — показуємо поточну, натисканням перемикаємо
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
                        Icon(
                            imageVector = Icons.Filled.Refresh,
                            contentDescription = "Змінити форму"
                        )
                    }
                },
                modifier = Modifier.weight(1f)
            )
    }

        Spacer(modifier = Modifier.height(24.dp))

        // Розклад
        Text(
            text = "Розклад прийому",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Частота
        OutlinedTextField(
            value = frequency,
            onValueChange = { frequency = it },
            label = { Text("Частота") },
            placeholder = { Text("раз на день, двічі на день") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Час прийому
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
                            Icon(
                                imageVector = Icons.Filled.Delete,
                                contentDescription = "Видалити час"
                            )
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
            Text("Додати час")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Зв'язок з їжею
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

        // Дні тижня
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

        // Тривалість
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
            // Тут буде вибір дати початку
            OutlinedTextField(
                value = startDate.toString(),
                onValueChange = { },
                label = { Text("Дата початку") },
                readOnly = true,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Додаткова інформація
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

        // Кнопка збереження
        Button(
            onClick = onMedicationAdded,
            modifier = Modifier.fillMaxWidth(),
            enabled = medicationName.isNotBlank() && dosage.isNotBlank()
        ) {
            Text(
                text = "Зберегти ліки",
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

    // Стан налаштувань
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
        // Заголовок
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Filled.ArrowBack,
                    contentDescription = "Назад"
                )
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

        // Розділ профілю
        SettingsSection(title = "Профіль") {
            SettingsItem(
                title = "Особисті дані",
                subtitle = "Ім'я, дата народження, фото",
                icon = Icons.Filled.Person,
                onClick = { /* TODO: додати редагування профілю */ }
            )

            SettingsItem(
                title = "Роль користувача",
                subtitle = "Пацієнт, опікун, лікар",
                icon = Icons.Filled.VerifiedUser,
                onClick = { /* TODO: додати зміну ролі */ }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Розділ сповіщень
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

        // Розділ зовнішнього вигляду
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

        // Розділ даних і конфіденційності
        SettingsSection(title = "Дані та конфіденційність") {
            SettingsItem(
                title = "Експорт даних",
                subtitle = "Завантажити всі ваші дані",
                icon = Icons.Filled.CloudDownload,
                onClick = { /* TODO: додати експорт даних */ }
            )

            SettingsItem(
                title = "Резервна копія",
                subtitle = "Створити резервну копію даних",
                icon = Icons.Filled.CloudUpload,
                onClick = { /* TODO: додати резервне копіювання */ }
            )

            SettingsItem(
                title = "Історія прийому",
                subtitle = "Переглянути історію прийому ліків",
                icon = Icons.Filled.History,
                onClick = { /* TODO: показати історію */ }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Розділ підтримки
        SettingsSection(title = "Підтримка") {
            SettingsItem(
                title = "Допомога",
                subtitle = "Посібник користувача",
                icon = Icons.Filled.Help,
                onClick = { /* TODO: відкрити довідку */ }
            )

            SettingsItem(
                title = "Зв'язатися з нами",
                subtitle = "Надіслати відгук або повідомити про проблему",
                icon = Icons.Filled.Email,
                onClick = { /* TODO: відкрити форму звернення */ }
            )

            SettingsItem(
                title = "Про додаток",
                subtitle = "Версія, умови використання, політика конфіденційності",
                icon = Icons.Filled.Info,
                onClick = { /* TODO: відкрити інформацію про додаток */ }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Розділ облікового запису
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
                    onClick = { /* TODO: додати діалог видалення */ },
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = MaterialTheme.colorScheme.error
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Filled.Delete,
                        contentDescription = null
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Видалити обліковий запис")
                }

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = onLogout,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.error
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Filled.ExitToApp,
                        contentDescription = null
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Вийти")
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
    icon: ImageVector,
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
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .size(24.dp)
                    .padding(end = 16.dp)
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
        Icon(
            imageVector = Icons.Filled.ChevronRight,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
