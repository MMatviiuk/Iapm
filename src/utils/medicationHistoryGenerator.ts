import type { Prescription, MedicationHistoryEntry } from '../types';

/**
 * Generates realistic medication history for the past 3 months
 * with varying adherence patterns based on medication type and user behavior
 */
export function generateMedicationHistory(
  medications: Prescription[],
  startDate: Date = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
): MedicationHistoryEntry[] {
  const history: MedicationHistoryEntry[] = [];
  const endDate = new Date();

  medications.forEach((medication) => {
    // Determine adherence rate based on medication frequency
    // More frequent = slightly lower adherence (realistic pattern)
    let baseAdherence = 0.85; // 85% base adherence
    
    if (medication.frequency === 'Once daily') {
      baseAdherence = 0.92; // Higher adherence for once daily
    } else if (medication.frequency === 'Twice daily') {
      baseAdherence = 0.88;
    } else if (medication.frequency === 'Three times daily') {
      baseAdherence = 0.82;
    }

    // Add variation for different medication types
    if (medication.name.toLowerCase().includes('vitamin')) {
      baseAdherence -= 0.05; // People are more likely to skip vitamins
    }
    if (medication.name.toLowerCase().includes('pain')) {
      baseAdherence += 0.03; // Higher adherence for pain meds
    }
    if (medication.name.toLowerCase().includes('heart') || 
        medication.name.toLowerCase().includes('blood pressure')) {
      baseAdherence += 0.05; // Critical meds have higher adherence
    }

    // Generate entries for each day
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      medication.timesPerDay.forEach((time) => {
        // Add some realistic patterns
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isMonday = dayOfWeek === 1;
        
        // Weekend adherence is slightly lower
        let dayAdherence = baseAdherence;
        if (isWeekend) {
          dayAdherence -= 0.05;
        }
        if (isMonday) {
          dayAdherence -= 0.03; // "Monday effect"
        }

        // Morning doses have higher adherence
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 6 && hour <= 9) {
          dayAdherence += 0.03;
        }
        // Late evening doses have lower adherence
        if (hour >= 21) {
          dayAdherence -= 0.04;
        }

        // Add random variation
        const randomFactor = Math.random() * 0.1 - 0.05; // ±5%
        const finalAdherence = Math.max(0, Math.min(1, dayAdherence + randomFactor));

        const taken = Math.random() < finalAdherence;
        
        let skippedReason: string | undefined;
        if (!taken) {
          const reasons = [
            'Forgot',
            'Away from home',
            'Ran out',
            'Felt better',
            'Side effects',
          ];
          skippedReason = reasons[Math.floor(Math.random() * reasons.length)];
        }

        history.push({
          medicationId: medication.id,
          medicationName: medication.name,
          date: currentDate.toISOString().split('T')[0],
          time: time,
          taken,
          skippedReason,
        });
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Sort by date and time (most recent first)
  return history.sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);
    if (dateComparison !== 0) return dateComparison;
    return b.time.localeCompare(a.time);
  });
}

/**
 * Calculate adherence statistics from history
 */
export function calculateAdherenceStats(history: MedicationHistoryEntry[]) {
  if (history.length === 0) {
    return {
      overall: 0,
      last7Days: 0,
      last30Days: 0,
      byMedication: {},
      totalDoses: 0,
      takenDoses: 0,
      missedDoses: 0,
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalDoses = history.length;
  const takenDoses = history.filter(h => h.taken).length;
  const missedDoses = totalDoses - takenDoses;

  // Overall adherence
  const overall = (takenDoses / totalDoses) * 100;

  // Last 7 days
  const last7DaysHistory = history.filter(h => new Date(h.date) >= sevenDaysAgo);
  const last7Days = last7DaysHistory.length > 0
    ? (last7DaysHistory.filter(h => h.taken).length / last7DaysHistory.length) * 100
    : 0;

  // Last 30 days
  const last30DaysHistory = history.filter(h => new Date(h.date) >= thirtyDaysAgo);
  const last30Days = last30DaysHistory.length > 0
    ? (last30DaysHistory.filter(h => h.taken).length / last30DaysHistory.length) * 100
    : 0;

  // By medication
  const byMedication: Record<string, { taken: number; total: number; percentage: number }> = {};
  history.forEach(entry => {
    if (!byMedication[entry.medicationName]) {
      byMedication[entry.medicationName] = { taken: 0, total: 0, percentage: 0 };
    }
    byMedication[entry.medicationName].total++;
    if (entry.taken) {
      byMedication[entry.medicationName].taken++;
    }
  });

  // Calculate percentages
  Object.keys(byMedication).forEach(medName => {
    const stats = byMedication[medName];
    stats.percentage = (stats.taken / stats.total) * 100;
  });

  return {
    overall: Math.round(overall * 10) / 10,
    last7Days: Math.round(last7Days * 10) / 10,
    last30Days: Math.round(last30Days * 10) / 10,
    byMedication,
    totalDoses,
    takenDoses,
    missedDoses,
  };
}

/**
 * Get daily adherence data for charts
 */
export function getDailyAdherenceData(history: MedicationHistoryEntry[], days: number = 30) {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const dailyData: Array<{
    date: string;
    adherence: number;
    taken: number;
    total: number;
  }> = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayHistory = history.filter(h => h.date === dateStr);
    const taken = dayHistory.filter(h => h.taken).length;
    const total = dayHistory.length;
    const adherence = total > 0 ? (taken / total) * 100 : 0;

    dailyData.push({
      date: dateStr,
      adherence: Math.round(adherence * 10) / 10,
      taken,
      total,
    });
  }

  return dailyData;
}

/**
 * Get weekly adherence data for charts
 */
export function getWeeklyAdherenceData(history: MedicationHistoryEntry[], weeks: number = 12) {
  const now = new Date();
  const weeklyData: Array<{
    week: string;
    adherence: number;
    taken: number;
    total: number;
  }> = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekStart = new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
    
    const weekHistory = history.filter(h => {
      const entryDate = new Date(h.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const taken = weekHistory.filter(h => h.taken).length;
    const total = weekHistory.length;
    const adherence = total > 0 ? (taken / total) * 100 : 0;

    const weekLabel = `Week ${weeks - i}`;

    weeklyData.push({
      week: weekLabel,
      adherence: Math.round(adherence * 10) / 10,
      taken,
      total,
    });
  }

  return weeklyData;
}

/**
 * Get most common skip reasons
 */
export function getSkipReasons(history: MedicationHistoryEntry[]) {
  const reasons: Record<string, number> = {};
  
  history
    .filter(h => !h.taken && h.skippedReason)
    .forEach(h => {
      const reason = h.skippedReason!;
      reasons[reason] = (reasons[reason] || 0) + 1;
    });

  return Object.entries(reasons)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}
