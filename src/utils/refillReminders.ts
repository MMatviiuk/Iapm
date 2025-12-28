/**
 * REFILL REMINDERS SYSTEM
 * Alerts users when medication supply is running low
 * Medical-grade inventory management for elderly patients
 */

export interface MedicationInventory {
  medicationId: string | number;
  medicationName: string;
  totalQuantity: number; // Pills, ml, doses, etc.
  quantityRemaining: number;
  quantityPerDose: number;
  dosesPerDay: number;
  lastRefillDate?: string;
  prescriptionNumber?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  autoRefill?: boolean;
}

export interface RefillAlert {
  medicationId: string | number;
  medicationName: string;
  urgency: 'critical' | 'urgent' | 'soon' | 'ok';
  daysRemaining: number;
  quantityRemaining: number;
  message: string;
  actionRequired: string;
  estimatedRunOutDate: Date;
  prescriptionNumber?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
}

/**
 * Calculate days remaining based on usage
 */
export function calculateDaysRemaining(inventory: MedicationInventory): number {
  const { quantityRemaining, quantityPerDose, dosesPerDay } = inventory;

  if (dosesPerDay === 0 || quantityPerDose === 0) {
    return 999; // Infinite if not being consumed
  }

  const dailyConsumption = quantityPerDose * dosesPerDay;
  const daysRemaining = Math.floor(quantityRemaining / dailyConsumption);

  return Math.max(0, daysRemaining);
}

/**
 * Determine urgency level based on days remaining
 */
export function getRefillUrgency(daysRemaining: number): RefillAlert['urgency'] {
  if (daysRemaining <= 3) {
    return 'critical'; // Red alert - refill NOW
  } else if (daysRemaining <= 7) {
    return 'urgent'; // Orange - refill this week
  } else if (daysRemaining <= 14) {
    return 'soon'; // Yellow - refill soon
  } else {
    return 'ok'; // Green - sufficient supply
  }
}

/**
 * Calculate estimated run-out date
 */
export function calculateRunOutDate(inventory: MedicationInventory): Date {
  const daysRemaining = calculateDaysRemaining(inventory);
  const runOutDate = new Date();
  runOutDate.setDate(runOutDate.getDate() + daysRemaining);
  return runOutDate;
}

/**
 * Generate refill alert message
 */
export function generateRefillMessage(
  medicationName: string,
  daysRemaining: number,
  urgency: RefillAlert['urgency']
): string {
  switch (urgency) {
    case 'critical':
      return `⚠️ URGENT: Only ${daysRemaining} day(s) of ${medicationName} remaining! Refill immediately.`;
    case 'urgent':
      return `⚡ ${medicationName} is running low (${daysRemaining} days left). Refill this week.`;
    case 'soon':
      return `📅 ${medicationName} needs refill soon (${daysRemaining} days left).`;
    default:
      return `✅ ${medicationName} supply is sufficient (${daysRemaining}+ days).`;
  }
}

/**
 * Generate action required message
 */
export function generateActionMessage(
  urgency: RefillAlert['urgency'],
  pharmacyName?: string,
  pharmacyPhone?: string,
  autoRefill?: boolean
): string {
  if (autoRefill) {
    return 'Auto-refill is enabled. Pharmacy will contact you when ready.';
  }

  const pharmacy = pharmacyName ? ` at ${pharmacyName}` : '';
  const phone = pharmacyPhone ? ` (${pharmacyPhone})` : '';

  switch (urgency) {
    case 'critical':
      return `Call your pharmacy${pharmacy}${phone} TODAY to request urgent refill.`;
    case 'urgent':
      return `Contact your pharmacy${pharmacy}${phone} this week to refill.`;
    case 'soon':
      return `Schedule refill${pharmacy}${phone} within the next 2 weeks.`;
    default:
      return 'No action needed at this time.';
  }
}

/**
 * Check single medication for refill needs
 */
export function checkRefillStatus(inventory: MedicationInventory): RefillAlert {
  const daysRemaining = calculateDaysRemaining(inventory);
  const urgency = getRefillUrgency(daysRemaining);
  const message = generateRefillMessage(inventory.medicationName, daysRemaining, urgency);
  const actionRequired = generateActionMessage(
    urgency,
    inventory.pharmacyName,
    inventory.pharmacyPhone,
    inventory.autoRefill
  );
  const estimatedRunOutDate = calculateRunOutDate(inventory);

  return {
    medicationId: inventory.medicationId,
    medicationName: inventory.medicationName,
    urgency,
    daysRemaining,
    quantityRemaining: inventory.quantityRemaining,
    message,
    actionRequired,
    estimatedRunOutDate,
    prescriptionNumber: inventory.prescriptionNumber,
    pharmacyName: inventory.pharmacyName,
    pharmacyPhone: inventory.pharmacyPhone,
  };
}

/**
 * Check all medications for refill needs
 */
export function checkAllRefills(inventories: MedicationInventory[]): RefillAlert[] {
  return inventories
    .map(checkRefillStatus)
    .filter((alert) => alert.urgency !== 'ok') // Only return alerts that need attention
    .sort((a, b) => {
      // Sort by urgency (critical first)
      const urgencyOrder = { critical: 0, urgent: 1, soon: 2, ok: 3 };
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;

      // Then by days remaining (lowest first)
      return a.daysRemaining - b.daysRemaining;
    });
}

/**
 * Get color for urgency level
 */
export function getUrgencyColor(urgency: RefillAlert['urgency']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (urgency) {
    case 'critical':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-200 dark:border-red-800',
      };
    case 'urgent':
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-800 dark:text-orange-200',
        border: 'border-orange-200 dark:border-orange-800',
      };
    case 'soon':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-800 dark:text-yellow-200',
        border: 'border-yellow-200 dark:border-yellow-800',
      };
    default:
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-200 dark:border-green-800',
      };
  }
}

/**
 * Format date for display
 */
export function formatRunOutDate(date: Date): string {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'TODAY or PAST';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays <= 7) {
    return `in ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Calculate refill reminder date (alert 7 days before run-out)
 */
export function calculateReminderDate(inventory: MedicationInventory): Date {
  const runOutDate = calculateRunOutDate(inventory);
  const reminderDate = new Date(runOutDate);
  reminderDate.setDate(reminderDate.getDate() - 7); // Alert 7 days before
  return reminderDate;
}

/**
 * Should show refill reminder today?
 */
export function shouldShowReminderToday(inventory: MedicationInventory): boolean {
  const reminderDate = calculateReminderDate(inventory);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  reminderDate.setHours(0, 0, 0, 0);

  return reminderDate <= today;
}

/**
 * Get statistics for refill alerts
 */
export function getRefillStatistics(alerts: RefillAlert[]): {
  total: number;
  critical: number;
  urgent: number;
  soon: number;
} {
  return {
    total: alerts.length,
    critical: alerts.filter((a) => a.urgency === 'critical').length,
    urgent: alerts.filter((a) => a.urgency === 'urgent').length,
    soon: alerts.filter((a) => a.urgency === 'soon').length,
  };
}

/**
 * Update inventory after taking medication
 */
export function updateInventoryAfterDose(
  inventory: MedicationInventory,
  dosesUsed = 1
): MedicationInventory {
  const quantityUsed = inventory.quantityPerDose * dosesUsed;
  const newQuantityRemaining = Math.max(0, inventory.quantityRemaining - quantityUsed);

  return {
    ...inventory,
    quantityRemaining: newQuantityRemaining,
  };
}

/**
 * Update inventory after refill
 */
export function updateInventoryAfterRefill(
  inventory: MedicationInventory,
  quantityAdded: number
): MedicationInventory {
  return {
    ...inventory,
    quantityRemaining: inventory.quantityRemaining + quantityAdded,
    totalQuantity: inventory.totalQuantity + quantityAdded,
    lastRefillDate: new Date().toISOString(),
  };
}

/**
 * Export refill alerts as text for sharing with caregiver
 */
export function exportRefillAlertsAsText(alerts: RefillAlert[]): string {
  if (alerts.length === 0) {
    return 'No refills needed at this time.';
  }

  let text = 'MEDICATION REFILL ALERTS\n';
  text += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  alerts.forEach((alert, index) => {
    text += `${index + 1}. ${alert.medicationName}\n`;
    text += `   Status: ${alert.urgency.toUpperCase()}\n`;
    text += `   Days Remaining: ${alert.daysRemaining}\n`;
    text += `   Runs Out: ${formatRunOutDate(alert.estimatedRunOutDate)}\n`;
    if (alert.prescriptionNumber) {
      text += `   Rx #: ${alert.prescriptionNumber}\n`;
    }
    if (alert.pharmacyName) {
      text += `   Pharmacy: ${alert.pharmacyName}\n`;
    }
    if (alert.pharmacyPhone) {
      text += `   Phone: ${alert.pharmacyPhone}\n`;
    }
    text += `   Action: ${alert.actionRequired}\n\n`;
  });

  return text;
}
