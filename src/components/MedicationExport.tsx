import { Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface MedicationExportProps {
  medications: any[];
  darkMode: boolean;
  userName?: string;
}

export default function MedicationExport({ medications, darkMode, userName = 'User' }: MedicationExportProps) {
  
  const exportToCSV = () => {
    if (medications.length === 0) {
      toast.error('No medications to export');
      return;
    }

    // CSV Headers
    const headers = ['Name', 'Dosage', 'Form', 'Times per Day', 'Time', 'Meal Timing', 'Days of Week', 'Duration', 'Instructions', 'Status'];
    
    // CSV Rows
    const rows = medications.map(med => [
      med.name || '',
      med.dosage || '',
      med.form || '',
      med.timesPerDay || '',
      Array.isArray(med.times) ? med.times.join(', ') : (med.time || ''),
      med.mealTiming || '',
      med.daysOfWeek ? Object.entries(med.daysOfWeek)
        .filter(([_, value]) => value)
        .map(([day]) => day)
        .join(', ') : 'Daily',
      med.duration || '',
      med.instructions || '',
      med.status || 'Active'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `medications_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Medications exported to CSV', {
      description: `${medications.length} medication${medications.length > 1 ? 's' : ''} exported successfully`,
      duration: 3000
    });

    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
  };

  const exportToJSON = () => {
    if (medications.length === 0) {
      toast.error('No medications to export');
      return;
    }

    // Prepare data
    const exportData = {
      exportDate: new Date().toISOString(),
      userName,
      medicationsCount: medications.length,
      medications: medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        form: med.form,
        timesPerDay: med.timesPerDay,
        times: med.times,
        mealTiming: med.mealTiming,
        daysOfWeek: med.daysOfWeek,
        duration: med.duration,
        instructions: med.instructions,
        status: med.status,
        startDate: med.startDate,
        endDate: med.endDate,
        photoUrl: med.photoUrl
      }))
    };

    // Create download
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `medications_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Medications exported to JSON', {
      description: `${medications.length} medication${medications.length > 1 ? 's' : ''} exported successfully`,
      duration: 3000
    });

    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
  };

  const printMedications = () => {
    if (medications.length === 0) {
      toast.error('No medications to print');
      return;
    }

    // Open print page in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Popup blocked. Please allow popups for this site.');
      return;
    }

    // Generate HTML for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Medications List - ${userName}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
          h1 { color: #2196F3; margin-bottom: 10px; }
          .info { color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #2196F3; color: white; padding: 12px; text-align: left; }
          td { border: 1px solid #ddd; padding: 10px; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-btn { background: #2196F3; color: white; border: none; padding: 10px 20px; margin: 20px 0; cursor: pointer; border-radius: 4px; font-size: 16px; }
          .print-btn:hover { background: #1976D2; }
        </style>
      </head>
      <body>
        <button class="print-btn no-print" onclick="window.print()">🖨️ Print</button>
        <h1>Medications List</h1>
        <div class="info">
          <strong>Patient:</strong> ${userName}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
          <strong>Total Medications:</strong> ${medications.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Form</th>
              <th>Time</th>
              <th>Meal Timing</th>
              <th>Days</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${medications.map(med => `
              <tr>
                <td><strong>${med.name || 'N/A'}</strong></td>
                <td>${med.dosage || 'N/A'}</td>
                <td>${med.form || 'N/A'}</td>
                <td>${Array.isArray(med.times) ? med.times.join(', ') : (med.time || 'N/A')}</td>
                <td>${med.mealTiming || 'N/A'}</td>
                <td>${med.daysOfWeek ? Object.entries(med.daysOfWeek)
                  .filter(([_, value]) => value)
                  .map(([day]) => day)
                  .join(', ') : 'Daily'}</td>
                <td>${med.duration || 'Ongoing'}</td>
                <td>${med.status || 'Active'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="info" style="margin-top: 40px; border-top: 2px solid #2196F3; padding-top: 20px;">
          <strong>Prescription Clarity</strong><br>
          Universal Health Tracking Platform<br>
          Generated: ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast.success('Print preview opened', {
      description: 'A new window has been opened for printing',
      duration: 2000
    });

    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 px-4 gap-2 ${
            darkMode 
              ? 'border-slate-700 hover:bg-slate-800' 
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Download className="w-5 h-5" strokeWidth={2} />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Medications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-5 h-5 mr-3 text-green-600" strokeWidth={2} />
          <div>
            <p className="font-medium">Export to CSV</p>
            <p className="text-xs text-slate-500">Excel-compatible spreadsheet</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileText className="w-5 h-5 mr-3 text-blue-600" strokeWidth={2} />
          <div>
            <p className="font-medium">Export to JSON</p>
            <p className="text-xs text-slate-500">Machine-readable format</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={printMedications} className="cursor-pointer">
          <Printer className="w-5 h-5 mr-3 text-purple-600" strokeWidth={2} />
          <div>
            <p className="font-medium">Print List</p>
            <p className="text-xs text-slate-500">Print-friendly format</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
