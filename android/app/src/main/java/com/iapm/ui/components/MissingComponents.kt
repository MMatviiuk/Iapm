package com.iapm.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// Спрощена реалізація ExposedDropdownMenuBox для старіших версій Compose
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SimpleDropdownMenuBox(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Box(modifier = modifier) {
        content()
    }
}

@Composable
fun SimpleExposedDropdownMenuDefaults() = object {
    @Composable
    fun TrailingIcon(expanded: Boolean) = Icon(
        imageVector = if (expanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown,
        contentDescription = null
    )
}

// Спрощена реалізація FlowRow
@Composable
fun SimpleFlowRow(
    modifier: Modifier = Modifier,
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    maxItemsInEachRow: Int = Int.MAX_VALUE,
    content: @Composable () -> Unit
) {
    // Спрощена реалізація — поки використовуємо Column
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.Start,
        verticalArrangement = verticalArrangement
    ) {
        content()
    }
}

// Спрощена реалізація FilterChip
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SimpleFilterChip(
    selected: Boolean,
    onClick: () -> Unit,
    label: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = label,
        modifier = modifier,
        enabled = enabled
    )
}
