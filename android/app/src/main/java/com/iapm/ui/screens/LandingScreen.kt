package com.iapm.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.iapm.ui.components.FeatureCard
import com.iapm.ui.components.PillShieldLogo

@Composable
fun LandingScreen(
    onGetStarted: () -> Unit,
    onSignIn: () -> Unit,
    onQuickDemo: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
                .background(Color(0xFFE3F2FD)),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.padding(24.dp)
            ) {
                PillShieldLogo(size = 80.dp)
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "IAPM",
                    style = MaterialTheme.typography.headlineLarge.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 48.sp
                    ),
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Інтелектуальна система управління ліками",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    textAlign = TextAlign.Center
                )
            }
        }

        // Main content
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Залишайтеся здоровим з розумним управлінням ліками",
                style = MaterialTheme.typography.headlineMedium,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Автоматичні нагадування, відстеження прийому та синхронізація між пристроями",
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Features
            FeatureCard(
                title = "Розумне планування",
                description = "Залишайтеся в графіку з інтелектуальними нагадуваннями. Координуйте з прийомами їжі та відстежуйте дотримання автоматично.",
                benefit = "95% дотримання графіку"
            )

            Spacer(modifier = Modifier.height(16.dp))

            FeatureCard(
                title = "Оффлайн режим",
                description = "Працює без інтернету. Всі дані зберігаються локально та синхронізуються при підключенні.",
                benefit = "Завжди доступно"
            )

            Spacer(modifier = Modifier.height(16.dp))

            FeatureCard(
                title = "Сімейна підтримка",
                description = "Опікці можуть відстежувати прийом ліків своїх близьких. Лікарі отримують аналітику пацієнтів.",
                benefit = "Для всієї родини"
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Action buttons
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onGetStarted,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Text(
                        text = "Почати",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }

                OutlinedButton(
                    onClick = onSignIn,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                ) {
                    Text(
                        text = "Вхід",
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                TextButton(onClick = onQuickDemo) {
                    Text(
                        text = "Швидка демонстрація",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            Spacer(modifier = Modifier.height(48.dp))

            // Footer
            Text(
                text = "© 2024 IAPM. Інтелектуальна система управління ліками",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
    }
}