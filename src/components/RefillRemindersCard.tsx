/**
 * REFILL REMINDERS CARD COMPONENT
 * Displays medication refill alerts on dashboard
 * Medical-grade alerts for elderly patients
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Calendar, Phone, Pill, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import type { RefillAlert } from '../utils/refillReminders';
import { getUrgencyColor, formatRunOutDate, exportRefillAlertsAsText } from '../utils/refillReminders';

interface RefillRemindersCardProps {
  alerts: RefillAlert[];
  darkMode?: boolean;
  onRefillCompleted?: (medicationId: string | number) => void;
  onCallPharmacy?: (pharmacyPhone: string) => void;
}

export function RefillRemindersCard({
  alerts,
  darkMode = false,
  onRefillCompleted,
  onCallPharmacy,
}: RefillRemindersCardProps) {
  const [selectedAlert, setSelectedAlert] = React.useState<RefillAlert | null>(null);
  const [showDetails, setShowDetails] = React.useState(false);

  if (alerts.length === 0) {
    return null;
  }

  // Count by urgency
  const criticalCount = alerts.filter(a => a.urgency === 'critical').length;
  const urgentCount = alerts.filter(a => a.urgency === 'urgent').length;

  const getUrgencyIcon = (urgency: RefillAlert['urgency']) => {
    switch (urgency) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'urgent':
        return <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const handleShare = () => {
    const text = exportRefillAlertsAsText(alerts);
    
    if (navigator.share) {
      navigator.share({
        title: 'Medication Refill Alerts',
        text: text,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
      <Card className={`border-2 ${criticalCount > 0 ? 'border-red-500' : urgentCount > 0 ? 'border-orange-500' : 'border-yellow-500'}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 sm:p-3 rounded-lg ${
                criticalCount > 0 
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : urgentCount > 0
                    ? 'bg-orange-100 dark:bg-orange-900/30'
                    : 'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                <Pill className={`w-6 h-6 sm:w-7 sm:h-7 ${
                  criticalCount > 0
                    ? 'text-red-600 dark:text-red-400'
                    : urgentCount > 0
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <span>Refill Reminders</span>
                  {criticalCount > 0 && (
                    <Badge variant="destructive" className="h-6 px-2">
                      {criticalCount} Urgent
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {alerts.length} medication{alerts.length > 1 ? 's' : ''} need{alerts.length === 1 ? 's' : ''} refilling
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Show top 3 alerts */}
            {alerts.slice(0, 3).map((alert) => {
              const colors = getUrgencyColor(alert.urgency);
              
              return (
                <Alert
                  key={alert.medicationId}
                  variant={alert.urgency === 'critical' || alert.urgency === 'urgent' ? 'destructive' : 'default'}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedAlert(alert);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getUrgencyIcon(alert.urgency)}
                    <div className="flex-1 min-w-0">
                      <AlertTitle className="mb-1">
                        {alert.medicationName}
                      </AlertTitle>
                      <AlertDescription className="text-sm">
                        {alert.daysRemaining} days remaining • Runs out {formatRunOutDate(alert.estimatedRunOutDate)}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              );
            })}

            {/* Show more button if more than 3 */}
            {alerts.length > 3 && (
              <Button
                onClick={() => {
                  setSelectedAlert(null);
                  setShowDetails(true);
                }}
                variant="outline"
                className="w-full h-12"
              >
                View All {alerts.length} Alerts
              </Button>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex-1 h-11"
              >
                Share List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Pill className="w-6 h-6" />
              <span>Refill Reminders</span>
            </DialogTitle>
            <DialogDescription>
              Medications that need refilling soon
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(selectedAlert ? [selectedAlert] : alerts).map((alert) => {
              const colors = getUrgencyColor(alert.urgency);
              
              return (
                <div
                  key={alert.medicationId}
                  className={`border-2 rounded-lg p-4 ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getUrgencyIcon(alert.urgency)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold ${colors.text}`}>
                            {alert.medicationName}
                          </h4>
                          <Badge variant={alert.urgency === 'critical' ? 'destructive' : 'default'}>
                            {alert.urgency.toUpperCase()}
                          </Badge>
                        </div>
                        <p className={`text-sm ${colors.text} opacity-80`}>
                          {alert.quantityRemaining} remaining • {alert.daysRemaining} days left
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-2 ml-0 sm:ml-9 ${colors.text}`}>
                    <div>
                      <p className="font-semibold text-sm mb-1">Runs Out:</p>
                      <p>{formatRunOutDate(alert.estimatedRunOutDate)}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm mb-1">Action Needed:</p>
                      <p>{alert.actionRequired}</p>
                    </div>

                    {alert.prescriptionNumber && (
                      <div>
                        <p className="font-semibold text-sm mb-1">Prescription #:</p>
                        <p className="font-mono">{alert.prescriptionNumber}</p>
                      </div>
                    )}

                    {alert.pharmacyName && (
                      <div>
                        <p className="font-semibold text-sm mb-1">Pharmacy:</p>
                        <p>{alert.pharmacyName}</p>
                        {alert.pharmacyPhone && (
                          <Button
                            onClick={() => {
                              if (onCallPharmacy) {
                                onCallPharmacy(alert.pharmacyPhone!);
                              } else {
                                window.location.href = `tel:${alert.pharmacyPhone}`;
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 h-10"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call {alert.pharmacyPhone}
                          </Button>
                        )}
                      </div>
                    )}

                    {onRefillCompleted && (
                      <div className="pt-2">
                        <Button
                          onClick={() => {
                            onRefillCompleted(alert.medicationId);
                            setShowDetails(false);
                          }}
                          variant={alert.urgency === 'critical' ? 'destructive' : 'default'}
                          size="sm"
                          className="w-full sm:w-auto h-11"
                        >
                          Mark as Refilled
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowDetails(false)} variant="outline" className="h-12 sm:h-14">
              Close
            </Button>
            <Button onClick={handleShare} variant="default" className="h-12 sm:h-14">
              Share List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RefillRemindersCard;
