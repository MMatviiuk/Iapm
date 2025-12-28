/**
 * REPORT EXPORTER
 * Export analytics and medication data as PDF, CSV, or JSON
 * Medical-grade reporting for Enterprise SaaS
 */

export interface MedicationReport {
  patientName: string;
  patientId: string;
  dateOfBirth?: string;
  reportDate: string;
  reportPeriod: {
    start: string;
    end: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    timesPerDay: number;
    startDate?: string;
    endDate?: string;
  }>;
  adherenceStats: {
    overallRate: number;
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
    skippedDoses: number;
  };
  weeklyAdherence?: number[];
  notes?: string;
}

export interface AnalyticsReport {
  reportType: 'patient' | 'caregiver' | 'doctor';
  generatedBy: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalPatients?: number;
    totalMedications: number;
    averageAdherence: number;
    criticalAlerts: number;
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
  };
  patientData?: Array<{
    id: string;
    name: string;
    adherenceRate: number;
    medicationsCount: number;
    missedDoses: number;
  }>;
  trends?: {
    weeklyAdherence: number[];
    monthlyAdherence: number[];
  };
}

/**
 * Export medication report as CSV
 */
export function exportMedicationsAsCSV(report: MedicationReport): string {
  const { patientName, reportDate, medications, adherenceStats } = report;

  // Header
  let csv = `Medication Report - ${patientName}\n`;
  csv += `Generated: ${new Date(reportDate).toLocaleDateString()}\n`;
  csv += `Period: ${new Date(report.reportPeriod.start).toLocaleDateString()} - ${new Date(report.reportPeriod.end).toLocaleDateString()}\n\n`;

  // Adherence Summary
  csv += `Adherence Summary\n`;
  csv += `Overall Rate,${adherenceStats.overallRate}%\n`;
  csv += `Total Doses,${adherenceStats.totalDoses}\n`;
  csv += `Taken,${adherenceStats.takenDoses}\n`;
  csv += `Missed,${adherenceStats.missedDoses}\n`;
  csv += `Skipped,${adherenceStats.skippedDoses}\n\n`;

  // Medications Table
  csv += `Medications\n`;
  csv += `Name,Dosage,Frequency,Times Per Day,Start Date,End Date\n`;

  medications.forEach((med) => {
    csv += `"${med.name}",${med.dosage},${med.frequency},${med.timesPerDay},`;
    csv += `${med.startDate || 'N/A'},${med.endDate || 'Ongoing'}\n`;
  });

  return csv;
}

/**
 * Export analytics report as CSV
 */
export function exportAnalyticsAsCSV(report: AnalyticsReport): string {
  const { reportType, generatedAt, period, summary } = report;

  // Header
  let csv = `Analytics Report - ${reportType.toUpperCase()}\n`;
  csv += `Generated: ${new Date(generatedAt).toLocaleString()}\n`;
  csv += `Period: ${new Date(period.start).toLocaleDateString()} - ${new Date(period.end).toLocaleDateString()}\n\n`;

  // Summary
  csv += `Summary\n`;
  if (summary.totalPatients !== undefined) {
    csv += `Total Patients,${summary.totalPatients}\n`;
  }
  csv += `Total Medications,${summary.totalMedications}\n`;
  csv += `Average Adherence,${summary.averageAdherence}%\n`;
  csv += `Critical Alerts,${summary.criticalAlerts}\n`;
  csv += `Total Doses,${summary.totalDoses}\n`;
  csv += `Taken Doses,${summary.takenDoses}\n`;
  csv += `Missed Doses,${summary.missedDoses}\n\n`;

  // Patient Data (for caregiver/doctor reports)
  if (report.patientData && report.patientData.length > 0) {
    csv += `Patient Details\n`;
    csv += `ID,Name,Adherence Rate,Medications,Missed Doses\n`;

    report.patientData.forEach((patient) => {
      csv += `${patient.id},"${patient.name}",${patient.adherenceRate}%,${patient.medicationsCount},${patient.missedDoses}\n`;
    });

    csv += `\n`;
  }

  // Trends
  if (report.trends?.weeklyAdherence) {
    csv += `Weekly Adherence Trend\n`;
    csv += `Week,Adherence Rate\n`;
    report.trends.weeklyAdherence.forEach((rate, index) => {
      csv += `Week ${index + 1},${rate}%\n`;
    });
  }

  return csv;
}

/**
 * Export report as JSON
 */
export function exportAsJSON(report: MedicationReport | AnalyticsReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Generate HTML table for print
 */
export function generateHTMLTable(report: MedicationReport): string {
  const { patientName, reportDate, medications, adherenceStats } = report;

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Medication Report - ${patientName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #1a202c;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #2196F3;
      padding-bottom: 20px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #2196F3;
    }
    .header p {
      margin: 5px 0;
      color: #718096;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .summary-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #2196F3;
    }
    .summary-card .label {
      font-size: 14px;
      color: #718096;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #2196F3;
      color: white;
      font-weight: 600;
    }
    tr:hover {
      background: #f7fafc;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #718096;
      font-size: 14px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Medication Report</h1>
    <p><strong>${patientName}</strong></p>
    <p>Report Date: ${new Date(reportDate).toLocaleDateString()}</p>
    <p>Period: ${new Date(report.reportPeriod.start).toLocaleDateString()} - ${new Date(report.reportPeriod.end).toLocaleDateString()}</p>
  </div>

  <h2>Adherence Summary</h2>
  <div class="summary">
    <div class="summary-card">
      <div class="value">${adherenceStats.overallRate}%</div>
      <div class="label">Overall Rate</div>
    </div>
    <div class="summary-card">
      <div class="value">${adherenceStats.takenDoses}</div>
      <div class="label">Taken Doses</div>
    </div>
    <div class="summary-card">
      <div class="value">${adherenceStats.missedDoses}</div>
      <div class="label">Missed Doses</div>
    </div>
    <div class="summary-card">
      <div class="value">${adherenceStats.totalDoses}</div>
      <div class="label">Total Doses</div>
    </div>
  </div>

  <h2>Current Medications</h2>
  <table>
    <thead>
      <tr>
        <th>Medication Name</th>
        <th>Dosage</th>
        <th>Frequency</th>
        <th>Times/Day</th>
        <th>Start Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${medications
        .map(
          (med) => `
        <tr>
          <td><strong>${med.name}</strong></td>
          <td>${med.dosage}</td>
          <td>${med.frequency}</td>
          <td>${med.timesPerDay}</td>
          <td>${med.startDate ? new Date(med.startDate).toLocaleDateString() : 'N/A'}</td>
          <td>${med.endDate ? 'Ended' : 'Active'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  ${
    report.notes
      ? `
    <h2>Notes</h2>
    <p>${report.notes}</p>
  `
      : ''
  }

  <div class="footer">
    <p>Generated by Prescription Clarity</p>
    <p>This report is for informational purposes only and does not replace professional medical advice.</p>
  </div>

  <script>
    // Auto-print on load
    window.onload = function() {
      if (confirm('Print this report?')) {
        window.print();
      }
    };
  </script>
</body>
</html>
  `;

  return html;
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export medication report (auto-detect format)
 */
export function exportMedicationReport(
  report: MedicationReport,
  format: 'csv' | 'json' | 'html' = 'csv'
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const patientSlug = report.patientName.toLowerCase().replace(/\s+/g, '-');

  switch (format) {
    case 'csv': {
      const csv = exportMedicationsAsCSV(report);
      downloadFile(csv, `medication-report-${patientSlug}-${timestamp}.csv`, 'text/csv');
      break;
    }
    case 'json': {
      const json = exportAsJSON(report);
      downloadFile(json, `medication-report-${patientSlug}-${timestamp}.json`, 'application/json');
      break;
    }
    case 'html': {
      const html = generateHTMLTable(report);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
      break;
    }
  }
}

/**
 * Export analytics report
 */
export function exportAnalyticsReport(
  report: AnalyticsReport,
  format: 'csv' | 'json' = 'csv'
): void {
  const timestamp = new Date().toISOString().split('T')[0];

  switch (format) {
    case 'csv': {
      const csv = exportAnalyticsAsCSV(report);
      downloadFile(csv, `analytics-report-${report.reportType}-${timestamp}.csv`, 'text/csv');
      break;
    }
    case 'json': {
      const json = exportAsJSON(report);
      downloadFile(
        json,
        `analytics-report-${report.reportType}-${timestamp}.json`,
        'application/json'
      );
      break;
    }
  }
}

/**
 * Generate sample medication report
 */
export function generateSampleMedicationReport(): MedicationReport {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return {
    patientName: 'John Smith',
    patientId: '1',
    dateOfBirth: '1952-03-15',
    reportDate: today.toISOString(),
    reportPeriod: {
      start: thirtyDaysAgo.toISOString(),
      end: today.toISOString(),
    },
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        timesPerDay: 1,
        startDate: '2024-01-01',
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        timesPerDay: 2,
        startDate: '2024-01-01',
      },
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        timesPerDay: 1,
        startDate: '2024-02-01',
      },
    ],
    adherenceStats: {
      overallRate: 92,
      totalDoses: 120,
      takenDoses: 110,
      missedDoses: 8,
      skippedDoses: 2,
    },
    weeklyAdherence: [88, 90, 94, 95],
    notes: 'Patient showing excellent adherence. Continue current regimen.',
  };
}

/**
 * Generate sample analytics report
 */
export function generateSampleAnalyticsReport(
  reportType: 'patient' | 'caregiver' | 'doctor'
): AnalyticsReport {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const baseReport: AnalyticsReport = {
    reportType,
    generatedBy: 'Prescription Clarity',
    generatedAt: today.toISOString(),
    period: {
      start: thirtyDaysAgo.toISOString(),
      end: today.toISOString(),
    },
    summary: {
      totalMedications: reportType === 'patient' ? 3 : 12,
      averageAdherence: 90,
      criticalAlerts: 2,
      totalDoses: 360,
      takenDoses: 324,
      missedDoses: 36,
    },
    trends: {
      weeklyAdherence: [85, 88, 90, 92],
      monthlyAdherence: [87, 89, 91, 90],
    },
  };

  if (reportType !== 'patient') {
    baseReport.summary.totalPatients = reportType === 'caregiver' ? 3 : 25;
    baseReport.patientData = [
      {
        id: '1',
        name: 'John Smith',
        adherenceRate: 92,
        medicationsCount: 3,
        missedDoses: 8,
      },
      {
        id: '2',
        name: 'Mary Johnson',
        adherenceRate: 88,
        medicationsCount: 4,
        missedDoses: 12,
      },
      {
        id: '3',
        name: 'Robert Williams',
        adherenceRate: 95,
        medicationsCount: 2,
        missedDoses: 4,
      },
    ];
  }

  return baseReport;
}
