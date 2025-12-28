# Medication History Generator - Usage Guide

## Overview
The medication history generator creates realistic 3-month tracking data with variable adherence patterns. Use it for analytics, testing, and demo purposes.

---

## Quick Start

### 1. Generate History
```typescript
import { generateMedicationHistory } from './utils/medicationHistoryGenerator';
import type { Prescription } from './types';

// Your medications
const medications: Prescription[] = [
  {
    id: '1',
    name: 'Aspirin 100mg',
    dosage: '100mg',
    frequency: 'Once daily',
    timesPerDay: ['08:00'],
    active: true,
    startDate: '2024-08-05',
  },
  // ... more medications
];

// Generate 3 months of history
const history = generateMedicationHistory(medications);

console.log(`Generated ${history.length} entries`);
// Output: Generated 270 entries (for 1 medication over 90 days)
```

---

### 2. Calculate Statistics
```typescript
import { calculateAdherenceStats } from './utils/medicationHistoryGenerator';

const stats = calculateAdherenceStats(history);

console.log('Overall Adherence:', stats.overall + '%');
console.log('Last 7 Days:', stats.last7Days + '%');
console.log('Last 30 Days:', stats.last30Days + '%');
console.log('Total Doses:', stats.totalDoses);
console.log('Taken:', stats.takenDoses);
console.log('Missed:', stats.missedDoses);

// Per-medication breakdown
Object.entries(stats.byMedication).forEach(([name, medStats]) => {
  console.log(`${name}: ${medStats.percentage}% (${medStats.taken}/${medStats.total})`);
});
```

---

### 3. Get Chart Data
```typescript
import { 
  getDailyAdherenceData, 
  getWeeklyAdherenceData 
} from './utils/medicationHistoryGenerator';

// Daily data for last 30 days
const dailyData = getDailyAdherenceData(history, 30);
// Returns: [{ date: '2024-11-05', adherence: 100, taken: 4, total: 4 }, ...]

// Weekly data for last 12 weeks
const weeklyData = getWeeklyAdherenceData(history, 12);
// Returns: [{ week: 'Week 1', adherence: 92.5, taken: 185, total: 200 }, ...]
```

---

### 4. Analyze Skip Reasons
```typescript
import { getSkipReasons } from './utils/medicationHistoryGenerator';

const reasons = getSkipReasons(history);

console.log('Top Skip Reasons:');
reasons.slice(0, 5).forEach((r, i) => {
  console.log(`${i + 1}. ${r.reason}: ${r.count} times`);
});
// Output:
// 1. Forgot: 25 times
// 2. Away from home: 12 times
// 3. Ran out: 8 times
// ...
```

---

## Integration Examples

### Dashboard Component
```typescript
import { useEffect, useState } from 'react';
import { 
  generateMedicationHistory,
  calculateAdherenceStats,
  getDailyAdherenceData
} from '../utils/medicationHistoryGenerator';

export default function Dashboard({ medications }) {
  const [adherenceData, setAdherenceData] = useState(null);

  useEffect(() => {
    // Generate history
    const history = generateMedicationHistory(medications);
    
    // Calculate stats
    const stats = calculateAdherenceStats(history);
    
    // Get chart data
    const dailyData = getDailyAdherenceData(history, 30);
    
    setAdherenceData({ stats, dailyData });
  }, [medications]);

  if (!adherenceData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Adherence: {adherenceData.stats.overall}%</h2>
      {/* Render charts with dailyData */}
    </div>
  );
}
```

---

### Analytics Page with Recharts
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics({ medications }) {
  const history = generateMedicationHistory(medications);
  const dailyData = getDailyAdherenceData(history, 30);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dailyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="adherence" 
          stroke="#2196F3" 
          strokeWidth={2}
          name="Adherence %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

### Progress Indicator
```typescript
export default function MedicationProgress({ medication }) {
  const history = generateMedicationHistory([medication]);
  const stats = calculateAdherenceStats(history);
  const medStats = stats.byMedication[medication.name];

  return (
    <div>
      <h3>{medication.name}</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${medStats.percentage}%` }}
        />
      </div>
      <p>{medStats.taken} of {medStats.total} doses taken</p>
    </div>
  );
}
```

---

## Adherence Patterns

### Base Rates
- Once daily: 92% adherence
- Twice daily: 88% adherence
- Three times daily: 82% adherence

### Medication Type Adjustments
- Vitamins/Supplements: -5% (lower priority)
- Pain medications: +3% (needed for comfort)
- Heart/Blood pressure: +5% (critical)

### Day of Week
- Weekdays: Normal adherence
- Weekends: -5% (routine disruption)
- Mondays: -3% (restart routine)

### Time of Day
- Morning (6-9am): +3% (best adherence)
- Afternoon (12-5pm): Normal
- Evening (6-8pm): Normal
- Late night (9pm+): -4% (forget before bed)

### Random Variation
- ±5% natural fluctuation
- Creates realistic patterns
- Avoids artificial-looking data

---

## Custom Start Date
```typescript
// Start from 6 months ago
const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
const history = generateMedicationHistory(medications, sixMonthsAgo);

// Start from specific date
const customDate = new Date('2024-01-01');
const history2 = generateMedicationHistory(medications, customDate);
```

---

## Filter History
```typescript
// Get only taken doses
const takenDoses = history.filter(h => h.taken);

// Get only missed doses
const missedDoses = history.filter(h => !h.taken);

// Get specific medication
const aspirinHistory = history.filter(h => h.medicationId === '1');

// Get specific date range
const last7Days = history.filter(h => {
  const date = new Date(h.date);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo;
});
```

---

## Backend Integration

### Save to Database
```typescript
import api from './services/api';

async function saveHistory(medications) {
  const history = generateMedicationHistory(medications);
  
  // Send to backend
  try {
    await api.saveMedicationHistory(history);
    toast.success('History generated and saved');
  } catch (error) {
    toast.error('Failed to save history');
  }
}
```

### Load from Database
```typescript
async function loadHistory(userId) {
  try {
    const history = await api.getMedicationHistory(userId);
    const stats = calculateAdherenceStats(history);
    return stats;
  } catch (error) {
    console.error('Failed to load history:', error);
    return null;
  }
}
```

---

## Testing

### Unit Test Example
```typescript
import { generateMedicationHistory, calculateAdherenceStats } from './medicationHistoryGenerator';

describe('Medication History Generator', () => {
  test('generates correct number of entries', () => {
    const medications = [{
      id: '1',
      frequency: 'Once daily',
      timesPerDay: ['08:00'],
      // ...
    }];
    
    const history = generateMedicationHistory(medications);
    
    // 90 days * 1 dose per day = 90 entries
    expect(history.length).toBe(90);
  });

  test('calculates adherence correctly', () => {
    const history = [
      { taken: true },
      { taken: true },
      { taken: false },
      { taken: true },
    ];
    
    const stats = calculateAdherenceStats(history);
    
    expect(stats.overall).toBe(75); // 3 of 4 = 75%
    expect(stats.takenDoses).toBe(3);
    expect(stats.missedDoses).toBe(1);
  });
});
```

---

## Performance Considerations

### Large Datasets
```typescript
// For many medications over long periods
const medications = [...]; // 10 medications
const history = generateMedicationHistory(medications);
// ~2700 entries (10 meds * 3 doses/day avg * 90 days)

// Use pagination for display
const pageSize = 50;
const page1 = history.slice(0, pageSize);
const page2 = history.slice(pageSize, pageSize * 2);
```

### Memoization
```typescript
import { useMemo } from 'react';

function Dashboard({ medications }) {
  const stats = useMemo(() => {
    const history = generateMedicationHistory(medications);
    return calculateAdherenceStats(history);
  }, [medications]);

  return <div>Adherence: {stats.overall}%</div>;
}
```

---

## TypeScript Types

All types are exported from `/types/index.ts`:

```typescript
import type { 
  Prescription,
  MedicationHistoryEntry,
  AdherenceStats 
} from './types';

function analyzeAdherence(
  meds: Prescription[]
): AdherenceStats {
  const history = generateMedicationHistory(meds);
  return calculateAdherenceStats(history);
}
```

---

## Demo Data

Sample medications for testing:

```typescript
const sampleMeds: Prescription[] = [
  {
    id: '1',
    name: 'Lisinopril 10mg',
    dosage: '10mg',
    frequency: 'Once daily',
    timesPerDay: ['08:00'],
    mealTiming: 'Before meals',
    startDate: '2024-08-05',
    active: true,
  },
  {
    id: '2',
    name: 'Metformin 500mg',
    dosage: '500mg',
    frequency: 'Twice daily',
    timesPerDay: ['08:00', '20:00'],
    mealTiming: 'With meals',
    startDate: '2024-08-05',
    active: true,
  },
  {
    id: '3',
    name: 'Vitamin D 1000IU',
    dosage: '1000IU',
    frequency: 'Once daily',
    timesPerDay: ['08:00'],
    mealTiming: 'With meals',
    startDate: '2024-08-05',
    active: true,
  },
];

const history = generateMedicationHistory(sampleMeds);
const stats = calculateAdherenceStats(history);

console.log('Demo Stats:', stats);
// Expected: overall ~88%, last7Days ~90%, totalDoses ~450
```

---

## Troubleshooting

### Issue: Adherence always 100%
**Cause:** Not enough random variation
**Fix:** Check that random factor is applied

### Issue: No history entries
**Cause:** Invalid medication data
**Fix:** Ensure `timesPerDay` array is not empty

### Issue: TypeScript errors
**Cause:** Missing type imports
**Fix:** Import types from `/types/index.ts`

### Issue: Chart not displaying
**Cause:** Data format incorrect
**Fix:** Use `getDailyAdherenceData()` or `getWeeklyAdherenceData()`

---

## Best Practices

1. **Cache Generated Data:**
   ```typescript
   const history = useMemo(() => 
     generateMedicationHistory(medications), 
     [medications]
   );
   ```

2. **Use Appropriate Time Ranges:**
   - Dashboard: Last 7 days
   - Weekly view: Last 30 days
   - Analytics: Last 90 days

3. **Handle Empty Data:**
   ```typescript
   if (history.length === 0) {
     return <EmptyState />;
   }
   ```

4. **Format Dates Consistently:**
   ```typescript
   const formattedDate = new Date(entry.date).toLocaleDateString();
   ```

5. **Show Loading States:**
   ```typescript
   if (!stats) {
     return <Spinner />;
   }
   ```

---

## References

- Source: `/utils/medicationHistoryGenerator.ts`
- Types: `/types/index.ts`
- Demo: `/components/HistoryDemo.tsx`
- Tests: `/TESTING_INSTRUCTIONS.md`

---

**Last Updated:** November 5, 2025  
**Version:** 1.0.0  
**Author:** Development Team
