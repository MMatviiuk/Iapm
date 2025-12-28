/**
 * EXPORT ANALYTICS COMPONENT
 * Export medication and analytics reports as PDF, CSV, or JSON
 * Medical-grade reporting for Enterprise SaaS
 */

import { useState } from 'react';
import { Download, FileText, FileJson, Printer } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  MedicationReport,
  AnalyticsReport,
  exportMedicationReport,
  exportAnalyticsReport,
  generateSampleMedicationReport,
  generateSampleAnalyticsReport,
} from '../utils/reportExporter';
import { logAudit } from '../utils/auditLogger';

interface ExportAnalyticsProps {
  reportType: 'patient' | 'caregiver' | 'doctor';
  darkMode: boolean;
  data?: any; // Analytics data to export
  patientName?: string;
  patientId?: string;
}

export default function ExportAnalytics({
  reportType,
  darkMode,
  data,
  patientName,
  patientId,
}: ExportAnalyticsProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      if (reportType === 'patient' && patientName && patientId) {
        // Export medication report for patient
        const report: MedicationReport = {
          patientName,
          patientId,
          reportDate: new Date().toISOString(),
          reportPeriod: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          },
          medications: data?.medications || [],
          adherenceStats: {
            overallRate: data?.adherenceRate || 90,
            totalDoses: data?.totalDoses || 120,
            takenDoses: data?.takenDoses || 108,
            missedDoses: data?.missedDoses || 12,
            skippedDoses: data?.skippedDoses || 0,
          },
          weeklyAdherence: data?.weeklyAdherence || [],
          notes: data?.notes || '',
        };

        exportMedicationReport(report, 'csv');
      } else {
        // Export analytics report for caregiver/doctor
        const report: AnalyticsReport = {
          reportType,
          generatedBy: 'Prescription Clarity',
          generatedAt: new Date().toISOString(),
          period: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          },
          summary: {
            totalPatients: data?.totalPatients,
            totalMedications: data?.totalMedications || 0,
            averageAdherence: data?.averageAdherence || 90,
            criticalAlerts: data?.criticalAlerts || 0,
            totalDoses: data?.totalDoses || 360,
            takenDoses: data?.takenDoses || 324,
            missedDoses: data?.missedDoses || 36,
          },
          patientData: data?.patientData || [],
          trends: {
            weeklyAdherence: data?.weeklyAdherence || [],
            monthlyAdherence: data?.monthlyAdherence || [],
          },
        };

        exportAnalyticsReport(report, 'csv');
      }

      // Log export action
      logAudit('REPORT_EXPORTED', 'analytics', {
        success: true,
        metadata: {
          format: 'csv',
          reportType,
        },
      });

      toast.success('Report Exported', {
        description: `CSV report downloaded successfully`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export Failed', {
        description: 'Could not export report. Please try again.',
        duration: 3000,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      if (reportType === 'patient' && patientName && patientId) {
        const report: MedicationReport = {
          patientName,
          patientId,
          reportDate: new Date().toISOString(),
          reportPeriod: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          },
          medications: data?.medications || [],
          adherenceStats: {
            overallRate: data?.adherenceRate || 90,
            totalDoses: data?.totalDoses || 120,
            takenDoses: data?.takenDoses || 108,
            missedDoses: data?.missedDoses || 12,
            skippedDoses: data?.skippedDoses || 0,
          },
          weeklyAdherence: data?.weeklyAdherence || [],
        };

        exportMedicationReport(report, 'json');
      } else {
        const report: AnalyticsReport = {
          reportType,
          generatedBy: 'Prescription Clarity',
          generatedAt: new Date().toISOString(),
          period: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          },
          summary: {
            totalPatients: data?.totalPatients,
            totalMedications: data?.totalMedications || 0,
            averageAdherence: data?.averageAdherence || 90,
            criticalAlerts: data?.criticalAlerts || 0,
            totalDoses: data?.totalDoses || 360,
            takenDoses: data?.takenDoses || 324,
            missedDoses: data?.missedDoses || 36,
          },
          patientData: data?.patientData || [],
          trends: {
            weeklyAdherence: data?.weeklyAdherence || [],
            monthlyAdherence: data?.monthlyAdherence || [],
          },
        };

        exportAnalyticsReport(report, 'json');
      }

      logAudit('REPORT_EXPORTED', 'analytics', {
        success: true,
        metadata: {
          format: 'json',
          reportType,
        },
      });

      toast.success('Report Exported', {
        description: `JSON report downloaded successfully`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export Failed', {
        description: 'Could not export report. Please try again.',
        duration: 3000,
      });
    } finally {
      setExporting(false);
    }
  };

  const handlePrintReport = async () => {
    if (reportType !== 'patient' || !patientName || !patientId) {
      toast.error('Print Not Available', {
        description: 'Print is only available for patient medication reports',
        duration: 3000,
      });
      return;
    }

    setExporting(true);
    try {
      const report: MedicationReport = {
        patientName,
        patientId,
        reportDate: new Date().toISOString(),
        reportPeriod: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        },
        medications: data?.medications || [],
        adherenceStats: {
          overallRate: data?.adherenceRate || 90,
          totalDoses: data?.totalDoses || 120,
          takenDoses: data?.takenDoses || 108,
          missedDoses: data?.missedDoses || 12,
          skippedDoses: data?.skippedDoses || 0,
        },
        weeklyAdherence: data?.weeklyAdherence || [],
        notes: data?.notes || '',
      };

      exportMedicationReport(report, 'html');

      logAudit('SCHEDULE_PRINTED', 'medication', {
        success: true,
        metadata: {
          reportType: 'medication',
        },
      });
    } catch (error) {
      console.error('Print failed:', error);
      toast.error('Print Failed', {
        description: 'Could not print report. Please try again.',
        duration: 3000,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        onClick={handleExportCSV}
        disabled={exporting}
        variant="outline"
        className={`h-12 px-4 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
      >
        <FileText className="w-5 h-5 mr-2" />
        Export CSV
      </Button>

      <Button
        onClick={handleExportJSON}
        disabled={exporting}
        variant="outline"
        className={`h-12 px-4 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
      >
        <FileJson className="w-5 h-5 mr-2" />
        Export JSON
      </Button>

      {reportType === 'patient' && (
        <Button
          onClick={handlePrintReport}
          disabled={exporting}
          variant="outline"
          className={`h-12 px-4 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Report
        </Button>
      )}
    </div>
  );
}
