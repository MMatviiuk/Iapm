/**
 * MEDICATION SAFETY DASHBOARD
 * Displays medication interactions and refill reminders
 * Medical-grade safety monitoring for elderly patients
 */

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Pill,
  Phone,
  Calendar,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  checkMedicationInteractions,
  MedicationInteraction,
  InteractionCheckResult,
  Medication,
  getSeverityColor,
} from '../utils/drugInteractionChecker';
import {
  checkAllRefills,
  RefillAlert,
  MedicationInventory,
  getUrgencyColor,
  formatRunOutDate,
  getRefillStatistics,
  exportRefillAlertsAsText,
} from '../utils/refillReminders';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface MedicationSafetyProps {
  darkMode: boolean;
  medications: any[]; // Your medication type
  setCurrentPage: (page: string) => void;
}

export default function MedicationSafety({
  darkMode,
  medications,
  setCurrentPage,
}: MedicationSafetyProps) {
  const [interactionResult, setInteractionResult] = useState<InteractionCheckResult | null>(null);
  const [refillAlerts, setRefillAlerts] = useState<RefillAlert[]>([]);
  const [expandedInteractions, setExpandedInteractions] = useState<Set<number>>(new Set());
  const [expandedRefills, setExpandedRefills] = useState<Set<number | string>>(new Set());

  useEffect(() => {
    checkInteractions();
    checkRefills();
  }, [medications]);

  const checkInteractions = () => {
    // Convert medications to format expected by checker
    const meds: Medication[] = medications.map((med) => ({
      id: med.id,
      name: med.name,
      activeIngredient: med.activeIngredient,
      category: med.category,
    }));

    const result = checkMedicationInteractions(meds);
    setInteractionResult(result);
  };

  const checkRefills = () => {
    // Convert medications to inventory format
    const inventories: MedicationInventory[] = medications
      .filter((med) => med.quantityRemaining !== undefined)
      .map((med) => ({
        medicationId: med.id,
        medicationName: med.name,
        totalQuantity: med.totalQuantity || 100,
        quantityRemaining: med.quantityRemaining || 50,
        quantityPerDose: med.dosage ? parseFloat(med.dosage) : 1,
        dosesPerDay: med.timesPerDay || 1,
        lastRefillDate: med.lastRefillDate,
        prescriptionNumber: med.prescriptionNumber,
        pharmacyName: med.pharmacyName || 'Your Pharmacy',
        pharmacyPhone: med.pharmacyPhone || '1-800-PHARMACY',
        autoRefill: med.autoRefill || false,
      }));

    const alerts = checkAllRefills(inventories);
    setRefillAlerts(alerts);
  };

  const toggleInteraction = (index: number) => {
    const newExpanded = new Set(expandedInteractions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedInteractions(newExpanded);
  };

  const toggleRefill = (id: number | string) => {
    const newExpanded = new Set(expandedRefills);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRefills(newExpanded);
  };

  const handleExportRefills = () => {
    const text = exportRefillAlertsAsText(refillAlerts);
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Refill alerts copied to clipboard', {
        description: 'Share this with your caregiver or pharmacy',
      });
    });
  };

  const getSeverityBadgeColor = (severity: MedicationInteraction['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'major':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'minor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const refillStats = getRefillStatistics(refillAlerts);

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      {/* Header */}
      <div
        className={`shadow-sm sticky top-0 z-10 px-4 sm:px-6 py-4 sm:py-5 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <ShieldAlert
              className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
            />
            <h1
              className={`text-xl sm:text-2xl font-semibold leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Medication Safety
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Safety Summary */}
        <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Medication Interactions
                </span>
              </div>
              <div
                className={`text-3xl font-bold ${
                  interactionResult && interactionResult.hasInteractions
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {interactionResult?.interactions.length || 0}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Refill Alerts
                </span>
              </div>
              <div
                className={`text-3xl font-bold ${
                  refillStats.critical > 0
                    ? 'text-red-600'
                    : refillStats.urgent > 0
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}
              >
                {refillAlerts.length}
              </div>
            </div>
          </div>
        </Card>

        {/* Drug Interactions Section */}
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-semibold flex items-center gap-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                Drug Interactions
              </h2>
              {interactionResult && !interactionResult.hasInteractions && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  No Interactions
                </Badge>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {interactionResult && interactionResult.hasInteractions ? (
              interactionResult.interactions.map((interaction, index) => (
                <div key={index} className="p-4">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleInteraction(index)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityBadgeColor(interaction.severity)}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                        <span
                          className={`font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {interaction.medication1} + {interaction.medication2}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {interaction.description}
                      </p>
                    </div>
                    {expandedInteractions.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedInteractions.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <div
                          className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg ${
                            darkMode ? 'text-blue-200' : 'text-blue-800'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold mb-1">Recommendation</div>
                              <div className="text-sm">{interaction.recommendation}</div>
                            </div>
                          </div>
                        </div>

                        {interaction.sources && interaction.sources.length > 0 && (
                          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <strong>Sources:</strong> {interaction.sources.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <p
                  className={`text-lg ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  No medication interactions detected
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Your medications appear safe to take together
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Refill Alerts Section */}
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-semibold flex items-center gap-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Pill className="w-5 h-5" />
                Refill Reminders
              </h2>
              {refillAlerts.length > 0 && (
                <Button onClick={handleExportRefills} variant="outline" size="sm">
                  Export List
                </Button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {refillAlerts.length > 0 ? (
              refillAlerts.map((alert) => {
                const colors = getUrgencyColor(alert.urgency);
                return (
                  <div key={alert.medicationId} className="p-4">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleRefill(alert.medicationId)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${colors.bg} ${colors.text}`}>
                            {alert.urgency.toUpperCase()}
                          </Badge>
                          <span
                            className={`font-semibold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {alert.medicationName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {alert.daysRemaining} days ({alert.quantityRemaining} remaining)
                          </span>
                          <span>Runs out: {formatRunOutDate(alert.estimatedRunOutDate)}</span>
                        </div>
                      </div>
                      {expandedRefills.has(alert.medicationId) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedRefills.has(alert.medicationId) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
                        >
                          <div
                            className={`bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg ${
                              darkMode ? 'text-orange-200' : 'text-orange-800'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold mb-1">Action Required</div>
                                <div className="text-sm">{alert.actionRequired}</div>
                              </div>
                            </div>
                          </div>

                          {alert.pharmacyName && (
                            <div className="flex items-center gap-2 text-sm">
                              <Pill className="w-4 h-4 text-gray-400" />
                              <span
                                className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                              >
                                Pharmacy: {alert.pharmacyName}
                              </span>
                            </div>
                          )}

                          {alert.pharmacyPhone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a
                                href={`tel:${alert.pharmacyPhone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {alert.pharmacyPhone}
                              </a>
                            </div>
                          )}

                          {alert.prescriptionNumber && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Rx #: {alert.prescriptionNumber}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <p
                  className={`text-lg ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  All medications have sufficient supply
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No refills needed at this time
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Important Notice */}
        <Card
          className={`p-4 border-2 ${
            darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex gap-3">
            <Info
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}
            />
            <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              <strong>Important:</strong> This information is for reference only and does not
              replace professional medical advice. Always consult your healthcare provider
              before making changes to your medications.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
