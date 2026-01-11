package com.iapm.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// Simple implementation of ExposedDropdownMenuBox for older Compose versions
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
    fun TrailingIcon(expanded: Boolean) = Text(if (expanded) "🔽" else "🔼")
}

// Simple FlowRow implementation
@Composable
fun SimpleFlowRow(
    modifier: Modifier = Modifier,
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    maxItemsInEachRow: Int = Int.MAX_VALUE,
    content: @Composable () -> Unit
) {
    // Simple implementation - just use Column for now
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.Start,
        verticalArrangement = verticalArrangement
    ) {
        content()
    }
}

// Simple FilterChip implementation
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