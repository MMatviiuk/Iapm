/**
 * REFILL REMINDER CARD
 * Alerts users when medication supply is running low
 * Elderly-friendly UI with large buttons and clear actions
 */

import { AlertTriangle, Phone, CheckCircle, Calendar, Pill } from 'lucide-react';
import {
  type RefillAlert,
  getUrgencyColor,
  formatRunOutDate,
} from '../utils/refillReminders';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface RefillReminderCardProps {
  alert: RefillAlert;
  onCallPharmacy?: (pharmacyPhone: string) => void;
  onMarkRefilled?: (medicationId: string | number) => void;
  onDismiss?: (medicationId: string | number) => void;
  darkMode?: boolean;
}

/**
 * Get icon for urgency level
 */
function getUrgencyIcon(urgency: RefillAlert['urgency']) {
  switch (urgency) {
    case 'critical':
      return <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />;
    case 'urgent':
      return <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9" />;
    case 'soon':
      return <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />;
    default:
      return <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />;
  }
}

/**
 * Get urgency label
 */
function getUrgencyLabel(urgency: RefillAlert['urgency']): string {
  switch (urgency) {
    case 'critical':
      return '🚨 URGENT';
    case 'urgent':
      return '⚠️ SOON';
    case 'soon':
      return '📅 PLAN AHEAD';
    default:
      return '✅ OK';
  }
}

/**
 * Single refill reminder card
 */
export function RefillReminderCard({
  alert,
  onCallPharmacy,
  onMarkRefilled,
  onDismiss,
  darkMode = false,
}: RefillReminderCardProps) {
  const colors = getUrgencyColor(alert.urgency);
  const icon = getUrgencyIcon(alert.urgency);
  const label = getUrgencyLabel(alert.urgency);

  return (
    <Card
      className={`${colors.bg} ${colors.border} border-2 ${darkMode ? 'dark' : ''} overflow-hidden`}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className={colors.text}>{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge
                variant={alert.urgency === 'critical' ? 'destructive' : 'default'}
                className="h-7 px-3 text-sm font-bold"
              >
                {label}
              </Badge>
              {alert.daysRemaining <= 3 && (
                <span className={`${colors.text} text-xl sm:text-2xl font-bold`}>
                  {alert.daysRemaining} {alert.daysRemaining === 1 ? 'DAY' : 'DAYS'} LEFT!
                </span>
              )}
            </div>
            <h3 className={`${colors.text} font-bold text-xl sm:text-2xl mb-1`}>
              {alert.medicationName}
            </h3>
            <p className={`${colors.text} text-base sm:text-lg`}>
              Supply runs out: {formatRunOutDate(alert.estimatedRunOutDate)}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className={`${colors.bg} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4`}>
          <p className={`${colors.text} text-base sm:text-lg font-semibold mb-2`}>
            {alert.message}
          </p>
          <p className={`${colors.text} text-sm sm:text-base`}>{alert.actionRequired}</p>
        </div>

        {/* Pharmacy info */}
        {alert.pharmacyName && (
          <div className={`${colors.bg} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Pill className={`${colors.text} w-5 h-5 sm:w-6 sm:h-6`} />
              <p className={`${colors.text} font-semibold text-base sm:text-lg`}>
                {alert.pharmacyName}
              </p>
            </div>
            {alert.pharmacyPhone && (
              <p className={`${colors.text} text-base sm:text-lg`}>
                📞 {alert.pharmacyPhone}
              </p>
            )}
            {alert.prescriptionNumber && (
              <p className={`${colors.text} text-sm sm:text-base mt-1`}>
                Rx #: {alert.prescriptionNumber}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Call Pharmacy button */}
          {alert.pharmacyPhone && onCallPharmacy && (
            <Button
              onClick={() => onCallPharmacy(alert.pharmacyPhone!)}
              variant={alert.urgency === 'critical' ? 'destructive' : 'default'}
              className="h-14 px-6 text-base sm:text-lg font-semibold flex-1"
            >
              <Phone className="w-6 h-6 mr-2" />
              Call Pharmacy
            </Button>
          )}

          {/* Mark as Refilled button */}
          {onMarkRefilled && (
            <Button
              onClick={() => onMarkRefilled(alert.medicationId)}
              variant="outline"
              className={`h-14 px-6 text-base sm:text-lg font-semibold flex-1 ${colors.border} ${colors.text}`}
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Mark Refilled
            </Button>
          )}

          {/* Dismiss button */}
          {onDismiss && alert.urgency !== 'critical' && (
            <Button
              onClick={() => onDismiss(alert.medicationId)}
              variant="ghost"
              className={`h-14 px-4 text-sm sm:text-base ${colors.text}`}
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Summary card for multiple refill reminders
 */
export function RefillReminderSummary({
  alerts,
  onViewAll,
  darkMode = false,
}: {
  alerts: RefillAlert[];
  onViewAll?: () => void;
  darkMode?: boolean;
}) {
  if (alerts.length === 0) {
    return null;
  }

  const criticalCount = alerts.filter((a) => a.urgency === 'critical').length;
  const urgentCount = alerts.filter((a) => a.urgency === 'urgent').length;
  const soonCount = alerts.filter((a) => a.urgency === 'soon').length;

  const hasCritical = criticalCount > 0;
  const hasUrgent = urgentCount > 0;

  return (
    <Card
      className={`border-2 ${
        hasCritical
          ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
          : hasUrgent
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
      }`}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div
            className={
              hasCritical
                ? 'text-red-600'
                : hasUrgent
                  ? 'text-orange-600'
                  : 'text-yellow-600'
            }
          >
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="flex-1">
            <h3
              className={`font-bold text-xl sm:text-2xl mb-2 ${
                hasCritical
                  ? 'text-red-900 dark:text-red-200'
                  : hasUrgent
                    ? 'text-orange-900 dark:text-orange-200'
                    : 'text-yellow-900 dark:text-yellow-200'
              }`}
            >
              {hasCritical ? '🚨 Urgent Refills Needed!' : '⚠️ Refills Coming Due'}
            </h3>
            <p
              className={`text-base sm:text-lg ${
                hasCritical
                  ? 'text-red-800 dark:text-red-300'
                  : hasUrgent
                    ? 'text-orange-800 dark:text-orange-300'
                    : 'text-yellow-800 dark:text-yellow-300'
              }`}
            >
              {criticalCount > 0 && (
                <span className="font-bold">
                  {criticalCount} URGENT refill{criticalCount > 1 ? 's' : ''}
                  {(urgentCount > 0 || soonCount > 0) && ', '}
                </span>
              )}
              {urgentCount > 0 && (
                <span className="font-semibold">
                  {urgentCount} coming soon{soonCount > 0 && ', '}
                </span>
              )}
              {soonCount > 0 && <span>{soonCount} to plan ahead</span>}
            </p>
          </div>
        </div>

        {/* Quick list of medications */}
        <div className="space-y-2 mb-4">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.medicationId}
              className={`flex items-center gap-3 p-2 rounded ${
                darkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}
            >
              <Badge
                variant={alert.urgency === 'critical' ? 'destructive' : 'default'}
                className="h-6 px-2 text-xs"
              >
                {alert.daysRemaining}d
              </Badge>
              <span className="font-semibold text-sm sm:text-base truncate">
                {alert.medicationName}
              </span>
            </div>
          ))}
          {alerts.length > 3 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              + {alerts.length - 3} more medication{alerts.length - 3 > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {onViewAll && (
          <Button onClick={onViewAll} variant="default" className="w-full h-14 text-base font-semibold">
            View All Refill Reminders
          </Button>
        )}
      </div>
    </Card>
  );
}

export default RefillReminderCard;
