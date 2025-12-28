/**
 * DRUG INTERACTION WARNING COMPONENT
 * Medical-grade warning display for medication interactions
 * Elderly-friendly with large text and clear severity indicators
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import type { DrugInteraction, InteractionCheckResult } from '../utils/drugInteractionChecker';

interface DrugInteractionWarningProps {
  result: InteractionCheckResult;
  darkMode?: boolean;
  onDismiss?: () => void;
  onContactDoctor?: () => void;
}

export function DrugInteractionWarning({
  result,
  darkMode = false,
  onDismiss,
  onContactDoctor,
}: DrugInteractionWarningProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  if (!result.hasInteractions) {
    return null;
  }

  // Get severity color and icon
  const getSeverityColor = (severity: DrugInteraction['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'major':
        return 'destructive';
      case 'moderate':
        return 'default';
      case 'minor':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: DrugInteraction['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 dark:text-red-400" />;
      case 'major':
        return <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" />;
      case 'moderate':
        return <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 dark:text-yellow-400" />;
      case 'minor':
        return <Info className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getWarningTitle = () => {
    switch (result.warningLevel) {
      case 'critical':
        return '🚨 Critical Drug Interaction Detected';
      case 'high':
        return '⚠️ Major Drug Interaction Detected';
      case 'medium':
        return '⚡ Moderate Drug Interaction';
      case 'low':
        return 'ℹ️ Minor Drug Interaction';
      default:
        return 'Drug Interaction';
    }
  };

  const getWarningMessage = () => {
    const count = result.interactions.length;
    if (!result.safeToTake) {
      return `Found ${count} serious interaction${count > 1 ? 's' : ''} that require immediate medical attention.`;
    }
    return `Found ${count} interaction${count > 1 ? 's' : ''} to be aware of. Please review with your doctor.`;
  };

  // Compact warning for inline display
  if (!showDetails) {
    return (
      <>
        <Alert
          variant={result.safeToTake ? 'default' : 'destructive'}
          className="mb-4"
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(result.interactions[0].severity)}
            <div className="flex-1 min-w-0">
              <AlertTitle className="mb-2">
                {getWarningTitle()}
              </AlertTitle>
              <AlertDescription className="mb-3">
                {getWarningMessage()}
              </AlertDescription>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  size="sm"
                  className="h-11 sm:h-12"
                >
                  View Details
                </Button>
                {onContactDoctor && result.warningLevel === 'critical' && (
                  <Button
                    onClick={onContactDoctor}
                    variant="destructive"
                    size="sm"
                    className="h-11 sm:h-12"
                  >
                    Contact Doctor Now
                  </Button>
                )}
                {onDismiss && result.safeToTake && (
                  <Button
                    onClick={onDismiss}
                    variant="ghost"
                    size="sm"
                    className="h-11 sm:h-12"
                  >
                    I Understand
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Alert>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getSeverityIcon(result.interactions[0].severity)}
                <span>Drug Interaction Details</span>
              </DialogTitle>
              <DialogDescription>
                Review these interactions carefully with your healthcare provider
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {result.interactions.map((interaction, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${
                    interaction.severity === 'critical'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                      : interaction.severity === 'major'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      : interaction.severity === 'moderate'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {getSeverityIcon(interaction.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityColor(interaction.severity)}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {interaction.medication1} + {interaction.medication2}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3 ml-0 sm:ml-9">
                    <div>
                      <h5 className={`font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        What This Means:
                      </h5>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {interaction.description}
                      </p>
                    </div>

                    <div>
                      <h5 className={`font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        What To Do:
                      </h5>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {interaction.recommendation}
                      </p>
                    </div>

                    {interaction.sources && interaction.sources.length > 0 && (
                      <div>
                        <h5 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Sources:
                        </h5>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {interaction.sources.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {onContactDoctor && !result.safeToTake && (
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    onContactDoctor();
                  }}
                  variant="destructive"
                  className="w-full sm:w-auto h-12 sm:h-14"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Contact My Doctor
                </Button>
              )}
              <Button
                onClick={() => setShowDetails(false)}
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}

export default DrugInteractionWarning;
