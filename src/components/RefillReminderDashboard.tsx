/**
 * REFILL REMINDER DASHBOARD WIDGET
 * Shows medication refill alerts on main dashboard
 * Integrated with RefillReminderCard for elderly users
 */

import { memo, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import RefillReminderCard from './RefillReminderCard';
import { checkAllRefills, type RefillAlert } from '../utils/refillReminders';
import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';

interface RefillReminderDashboardProps {
  medications: any[];
  darkMode: boolean;
  onRefillClick?: (medId: string | number) => void;
  onCallPharmacy?: (phone: string) => void;
  onMarkRefilled?: (medId: string | number) => void;
}

function RefillReminderDashboard({
  medications,
  darkMode,
  onRefillClick,
  onCallPharmacy,
  onMarkRefilled,
}: RefillReminderDashboardProps) {
  // Memoize alerts calculation for performance
  const alerts = useMemo(() => 
    checkAllRefills(
      medications.map((med) => ({
        medicationId: med.id,
        medicationName: med.name,
        totalQuantity: med.totalQuantity || 30,
        quantityRemaining: med.quantityRemaining || 20,
        quantityPerDose: parseFloat(med.quantity) || 1,
        dosesPerDay: med.timesPerDay || 1,
        lastRefillDate: med.lastRefillDate,
        pharmacyName: med.pharmacyName || 'Local Pharmacy',
        pharmacyPhone: med.pharmacyPhone || '(555) 123-4567',
      }))
    ),
    [medications]
  );

  // Memoize filtered urgent alerts
  const urgentAlerts = useMemo(() => 
    alerts.filter((alert) => 
      alert.urgency === 'critical' || alert.urgency === 'urgent'
    ),
    [alerts]
  );

  if (urgentAlerts.length === 0) {
    return (
      <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              All Medications Stocked
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No refills needed at this time
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Refill Reminders
          </h3>
        </div>
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {urgentAlerts.length} medication{urgentAlerts.length !== 1 ? 's' : ''} need{urgentAlerts.length === 1 ? 's' : ''} attention
        </span>
      </div>

      <div className="space-y-3">
        {urgentAlerts.map((alert) => (
          <RefillReminderCard
            key={alert.medicationId}
            alert={alert}
            onCallPharmacy={onCallPharmacy}
            onMarkRefilled={onMarkRefilled}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(RefillReminderDashboard);
