/**
 * EXPORT REPORT BUTTON COMPONENT
 * Quick export button with format selector
 * Elderly-friendly with large dropdown
 */

import React from 'react';
import { Download, FileText, File, Code } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import {
  exportMedicationReport,
  exportAnalyticsReport,
  type MedicationReport,
  type AnalyticsReport,
} from '../utils/reportExporter';

interface ExportReportButtonProps {
  report: MedicationReport | AnalyticsReport;
  darkMode?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function ExportReportButton({
  report,
  darkMode = false,
  size = 'default',
  variant = 'outline',
  className = '',
}: ExportReportButtonProps) {
  const isMedicationReport = 'medications' in report;

  const handleExport = (format: 'csv' | 'json' | 'html') => {
    try {
      if (isMedicationReport) {
        exportMedicationReport(report as MedicationReport, format);
      } else {
        exportAnalyticsReport(report as AnalyticsReport, format as 'csv' | 'json');
      }

      toast.success('Report Exported', {
        description: `Your report has been exported as ${format.toUpperCase()}`,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Failed to export report. Please try again.',
        duration: 3000,
      });
      console.error('Export error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`gap-2 ${className}`}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`w-56 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
      >
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className={`h-12 cursor-pointer ${
            darkMode ? 'text-gray-200 hover:bg-gray-700' : ''
          }`}
        >
          <File className="w-5 h-5 mr-3" />
          <div className="flex-1">
            <div className="font-semibold">Excel (CSV)</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Spreadsheet format
            </div>
          </div>
        </DropdownMenuItem>

        {isMedicationReport && (
          <DropdownMenuItem
            onClick={() => handleExport('html')}
            className={`h-12 cursor-pointer ${
              darkMode ? 'text-gray-200 hover:bg-gray-700' : ''
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            <div className="flex-1">
              <div className="font-semibold">Print (PDF)</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Printable document
              </div>
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className={darkMode ? 'bg-gray-700' : ''} />

        <DropdownMenuItem
          onClick={() => handleExport('json')}
          className={`h-12 cursor-pointer ${
            darkMode ? 'text-gray-200 hover:bg-gray-700' : ''
          }`}
        >
          <Code className="w-5 h-5 mr-3" />
          <div className="flex-1">
            <div className="font-semibold">JSON</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Developer format
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportReportButton;
