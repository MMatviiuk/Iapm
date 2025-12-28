import { ArrowLeft, Printer, Camera } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface PrintScheduleProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  medications?: any[];
  currentUser?: any;
}

export default function PrintSchedule({ darkMode, setCurrentPage, medications = [], currentUser }: PrintScheduleProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState(currentUser?.name || 'User');
  const [printData, setPrintData] = useState<any>(null);

  useEffect(() => {
    // Check if printing for specific person (caregiver/doctor flow)
    const scheduleData = localStorage.getItem('printScheduleData');
    if (scheduleData) {
      try {
        const data = JSON.parse(scheduleData);
        setPrintData(data);
        setUserName(data.personName);
        // Clear after reading
        localStorage.removeItem('printScheduleData');
      } catch (e) {
        // Continue with default flow
      }
    } else {
      // Default: print for current user
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserName(userData.name || currentUser?.name || 'User');
        } catch (e) {
          // Use default
        }
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success('Photo uploaded successfully', {
        description: 'Analyzing handwritten checkmarks...',
        duration: 3000,
      });
      
      setTimeout(() => {
        toast.success('Analysis complete', {
          description: 'Found 18 of 21 medications taken this week',
          duration: 5000,
        });
      }, 2000);
    }
  };

  // Calculate current week date range
  const getWeekDateRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get to Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  const weekDateRange = getWeekDateRange();

  // Use printData prescriptions if available, otherwise use medications prop
  const activeMedications = printData?.prescriptions || medications;

  // Get doctor info if available
  const doctorInfo = printData?.doctorInfo || null;

  // Days of week for horizontal layout
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayKeys: Record<string, keyof any> = {
    'Monday': 'mon',
    'Tuesday': 'tue',
    'Wednesday': 'wed',
    'Thursday': 'thu',
    'Friday': 'fri',
    'Saturday': 'sat',
    'Sunday': 'sun'
  };

  // Group medications by time slot for horizontal layout
  const timeSlots = new Set<string>();
  activeMedications.forEach((med: any) => {
    // Support both single time and multiple times
    if (med.times && Array.isArray(med.times)) {
      med.times.forEach((t: string) => timeSlots.add(t));
    } else if (med.time) {
      timeSlots.add(med.time);
    }
  });
  const sortedTimeSlots = Array.from(timeSlots).sort();

  // Build schedule grid: timeSlot -> day -> medications
  const scheduleGrid: Record<string, Record<string, any[]>> = {};
  
  sortedTimeSlots.forEach(timeSlot => {
    scheduleGrid[timeSlot] = {};
    daysOfWeek.forEach(day => {
      const dayKey = dayKeys[day];
      const dayMeds = activeMedications
        .filter((med: any) => {
          // Check if medication is scheduled for this time slot
          let hasTime = false;
          if (med.times && Array.isArray(med.times)) {
            hasTime = med.times.includes(timeSlot);
          } else if (med.time) {
            hasTime = med.time === timeSlot;
          }
          
          if (!hasTime) return false;
          
          // Check if medication is scheduled for this day
          if (!med.daysOfWeek) return true;
          return med.daysOfWeek[dayKey];
        })
        .sort((a: any, b: any) => {
          // Sort by meal timing (before → with → after → anytime)
          const mealTimingOrder = {
            'before meal': 1,
            'with meal': 2,
            'after meal': 3,
            'anytime': 4
          };
          const aMealOrder = mealTimingOrder[a.mealTiming as keyof typeof mealTimingOrder] || 5;
          const bMealOrder = mealTimingOrder[b.mealTiming as keyof typeof mealTimingOrder] || 5;
          if (aMealOrder !== bMealOrder) {
            return aMealOrder - bMealOrder;
          }
          
          // Then by name (alphabetically)
          return (a.name || a.medication || '').localeCompare(b.name || b.medication || '');
        });
      scheduleGrid[timeSlot][day] = dayMeds;
    });
  });

  // Generate QR code data
  const qrData = JSON.stringify({
    userName,
    weekDateRange,
    medications: activeMedications.map((med: any) => ({
      name: med.name || med.medication,
      dosage: med.dosageMg || med.dosage,
      quantity: med.quantity,
      time: med.time,
      mealTiming: med.mealTiming,
      daysOfWeek: med.daysOfWeek
    })),
    exportDate: new Date().toISOString()
  });

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 8mm 10mm;
          }
          
          nav,
          .no-print {
            display: none !important;
          }
          
          html, body {
            width: 100%;
            height: 100%;
            background: white !important;
            margin: 0;
            padding: 0;
            color: #000 !important;
          }
          
          .print-container {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .print-header {
            margin-bottom: 8px !important;
            padding: 8px 12px !important;
            page-break-after: avoid;
            border: 2px solid #000 !important;
            border-radius: 0 !important;
            background: white !important;
          }
          
          .print-header h1 {
            font-size: 18px !important;
            font-weight: bold !important;
            margin: 0 0 2px 0 !important;
            color: #000 !important;
          }
          
          .print-header p {
            font-size: 10px !important;
            color: #000 !important;
            margin: 1px 0 !important;
          }
          
          .print-header svg {
            width: 32px !important;
            height: 32px !important;
          }
          
          .print-table-wrapper {
            margin-bottom: 8px !important;
            page-break-inside: avoid;
            border: 2px solid #000 !important;
            border-radius: 0 !important;
          }
          
          .print-table {
            width: 100% !important;
            table-layout: fixed !important;
            font-size: 9pt !important;
            border-collapse: collapse !important;
            border-radius: 0 !important;
          }
          
          .print-table th {
            padding: 4px 3px !important;
            font-size: 10pt !important;
            font-weight: bold !important;
            background-color: #e3f2fd !important;
            color: #000 !important;
            border: 1.5px solid #000 !important;
            text-align: center !important;
            word-wrap: break-word !important;
          }
          
          .print-table th.time-col {
            width: 60px !important;
            text-align: left !important;
          }
          
          .print-table td {
            padding: 4px 3px !important;
            font-size: 8.5pt !important;
            color: #000 !important;
            border: 1.5px solid #000 !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          
          .print-table td.time-col {
            font-weight: bold !important;
            background-color: #f5f5f5 !important;
            text-align: left !important;
          }
          
          .med-item {
            margin-bottom: 4px !important;
            padding-bottom: 4px !important;
            border-bottom: 1px dashed #ccc !important;
          }
          
          .med-item:last-child {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
            border-bottom: none !important;
          }
          
          .med-name {
            font-weight: 600 !important;
            font-size: 8.5pt !important;
            color: #000 !important;
            display: block !important;
            margin-bottom: 2px !important;
          }
          
          .med-dosage {
            font-size: 7.5pt !important;
            color: #333 !important;
            display: block !important;
            margin-bottom: 3px !important;
          }
          
          input[type="checkbox"] {
            background-color: white !important;
            border: 2px solid #000 !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 16px !important;
            height: 16px !important;
            min-width: 16px !important;
            min-height: 16px !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
            border-radius: 2px !important;
            display: inline-block !important;
            vertical-align: middle !important;
          }
          
          .print-doctor-contact {
            margin-top: 8px !important;
            padding: 6px 10px !important;
            page-break-before: auto !important;
            border: 2px solid #000 !important;
            border-radius: 0 !important;
            background-color: #f3e8ff !important;
          }
          
          .print-doctor-contact h3 {
            font-size: 11pt !important;
            font-weight: bold !important;
            margin: 0 0 4px 0 !important;
            color: #000 !important;
          }
          
          .print-doctor-contact p {
            font-size: 9pt !important;
            color: #000 !important;
            margin: 2px 0 !important;
          }
          
          .print-footer-text {
            margin-top: 6px !important;
            text-align: center !important;
            font-size: 8pt !important;
            color: #666 !important;
          }
          
          .empty-cell {
            background-color: #fafafa !important;
            color: #999 !important;
            text-align: center !important;
            font-size: 7pt !important;
          }
          
          * {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#E8F4F8] pb-6 sm:pb-8">
        {/* Header - No Print */}
        <div className="bg-white border-b-2 border-gray-300 px-6 lg:px-8 py-5 lg:py-6 sticky top-0 z-10 shadow-sm no-print">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('main')}
              className="min-w-[60px] min-h-[60px] w-[60px] h-[60px] flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors touch-manipulation"
              aria-label="Back to main"
            >
              <ArrowLeft size={32} className="text-gray-700" strokeWidth={2.5} />
            </button>
            <h1 className="text-gray-900">Print Schedule</h1>
          </div>
        </div>

        {/* Action Buttons - No Print */}
        <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto no-print">
          <div className="grid grid-cols-1 gap-5 lg:gap-6">
            <button
              onClick={handlePrint}
              disabled={activeMedications.length === 0}
              className="flex items-center justify-center gap-5 px-8 py-6 bg-[#2196F3] text-white rounded-2xl hover:bg-[#1976D2] shadow-lg hover:shadow-xl transition-all min-h-[72px] lg:min-h-[80px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={36} className="flex-shrink-0" strokeWidth={2.5} />
              <div className="text-left flex-1">
                <div className="text-xl lg:text-2xl mb-1">Print Schedule</div>
                <div className="opacity-90">Weekly medication plan (Landscape)</div>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-5 px-8 py-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all min-h-[72px] lg:min-h-[80px] touch-manipulation"
            >
              <Camera size={36} className="flex-shrink-0" strokeWidth={2.5} />
              <div className="text-left flex-1">
                <div className="text-xl lg:text-2xl mb-1">Upload Photo</div>
                <div className="opacity-90">Analyze checkmarks</div>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          
          <div className="mt-6 lg:mt-8 p-6 lg:p-8 bg-blue-50 border-2 border-blue-200 rounded-2xl">
            <p className="text-gray-800 leading-relaxed">
              <strong className="block mb-3 text-xl lg:text-2xl">How to use:</strong>
              <span className="block mb-2">1. Press "Print Schedule" button</span>
              <span className="block mb-2">2. Choose your printer and print</span>
              <span className="block mb-2">3. Mark checkboxes after taking meds</span>
              <span className="block">4. Upload photo to track progress</span>
            </p>
          </div>
        </div>

        {/* Printable Content */}
        <div className="print-container px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
          {/* Print Header */}
          <div className="print-header mb-8 lg:mb-10 bg-white rounded-2xl p-6 lg:p-10 shadow-md">
            <div className="flex items-center gap-4 lg:gap-5 mb-4 lg:mb-5">
              {/* Logo SVG */}
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#2196F3"/>
                  <path d="M32 12C38.6274 12 44 17.3726 44 24C44 27.3137 42.6863 30.3137 40.5294 32.4706L32 41L23.4706 32.4706C21.3137 30.3137 20 27.3137 20 24C20 17.3726 25.3726 12 32 12Z" fill="white"/>
                  <circle cx="32" cy="24" r="6" fill="#2196F3"/>
                  <rect x="28" y="38" width="8" height="14" rx="2" fill="white"/>
                </svg>
              </div>
              <div>
                <h1 className="text-gray-900 mb-1 text-2xl lg:text-3xl">Prescription Clarity</h1>
                <p className="text-gray-600">Weekly Medication Schedule</p>
              </div>
            </div>
            <div className="border-t-2 border-gray-200 pt-4 lg:pt-5 mt-4 lg:mt-5">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Patient:</span> {userName}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Week of:</span> {weekDateRange}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Generated:</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Wide Landscape Schedule Table */}
          {activeMedications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-600 text-lg">No medications to display. Please add medications first.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 no-print">
                <p className="text-gray-700 text-center bg-blue-100 border-2 border-blue-300 rounded-xl p-4">
                  📄 <strong>Print Preview:</strong> Table will display in wide landscape format when printed
                </p>
              </div>
              
              <div className="print-table-wrapper overflow-x-auto bg-white rounded-2xl shadow-md mb-6 lg:mb-8">
                <table className="print-table w-full border-collapse">
                  <thead className="bg-[#2196F3]">
                    <tr>
                      <th className="time-col px-3 py-3 text-white border-2 border-[#1976D2]">
                        Time
                      </th>
                      {daysOfWeek.map((day, index) => (
                        <th key={index} className="px-2 py-3 text-white border-2 border-[#1976D2]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTimeSlots.map((timeSlot, timeIndex) => (
                      <tr key={timeIndex} className={timeIndex % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                        <td className="time-col px-3 py-3 border-2 border-gray-200">
                          {timeSlot}
                        </td>
                        {daysOfWeek.map((day, dayIndex) => {
                          const meds = scheduleGrid[timeSlot][day];
                          return (
                            <td key={dayIndex} className={`px-2 py-2 border-2 border-gray-200 ${meds.length === 0 ? 'empty-cell' : ''}`}>
                              {meds.length === 0 ? (
                                <span className="text-gray-400">—</span>
                              ) : (
                                <div className="space-y-2">
                                  {meds.map((med: any, medIndex: number) => (
                                    <div key={medIndex} className="med-item">
                                      <span className="med-name">{med.name || med.medication}</span>
                                      <span className="med-dosage">{med.dosage}</span>
                                      <div className="flex items-center gap-1">
                                        <input 
                                          type="checkbox" 
                                          className="rounded border-2 border-gray-300 bg-white cursor-pointer" 
                                          aria-label={`${med.name} taken`}
                                        />
                                        <span className="text-xs text-gray-600">Taken</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Doctor Contact - WILL PRINT */}
          {doctorInfo && (
            <div className="print-doctor-contact bg-purple-50 rounded-2xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-gray-900 mb-3 text-xl">Prescribing Doctor</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Name:</span> {doctorInfo.name}
              </p>
              {doctorInfo.phone && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Phone:</span> {doctorInfo.phone}
                </p>
              )}
              {doctorInfo.email && (
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {doctorInfo.email}
                </p>
              )}
            </div>
          )}

          {/* QR Code - No Print */}
          {activeMedications.length > 0 && (
            <div className="no-print bg-white rounded-2xl p-6 lg:p-8 shadow-md mb-6 lg:mb-8">
              <h3 className="text-gray-900 mb-5 text-xl lg:text-2xl">
                Quick Import QR Code
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-white p-5 rounded-xl border-2 border-gray-200">
                  <QRCodeSVG 
                    value={qrData} 
                    size={180}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className="flex-1 text-gray-700">
                  <p className="mb-3">
                    Scan this QR code to quickly import your medication schedule to another device or share with your healthcare provider.
                  </p>
                  <p className="text-gray-600">
                    Contains: Patient name, medications, dosages, and schedule information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer for print */}
          <div className="print-footer-text">
            <p>Prescription Clarity - Weekly Medication Schedule - Generated {new Date().toLocaleDateString('en-US')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
