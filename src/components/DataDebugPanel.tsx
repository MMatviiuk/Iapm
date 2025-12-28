import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { loadDemoDatabase, getDemoMedications } from '../utils/demoData';
import { RefreshCw, Check, X, AlertCircle } from 'lucide-react';

interface DataDebugPanelProps {
  medications: any[];
  currentUser: any;
}

export default function DataDebugPanel({ medications, currentUser }: DataDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [database, setDatabase] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  const runDiagnostics = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Load database
      console.log('🔍 Test 1: Loading database...');
      const db = await loadDemoDatabase();
      results.databaseLoaded = !!db;
      results.databaseStats = {
        doctors: db.doctors?.length || 0,
        caregivers: db.caregivers?.length || 0,
        patients: db.patients?.length || 0,
      };
      setDatabase(db);

      // Test 2: Find Margaret Williams
      console.log('🔍 Test 2: Finding Margaret Williams...');
      const margaret = db.patients?.find((p: any) => p.email === 'margaret.williams@example.com');
      results.margaretFound = !!margaret;
      results.margaretMedCount = margaret?.medications?.length || 0;

      // Test 3: Load medications for Margaret
      if (margaret) {
        console.log('🔍 Test 3: Loading medications for Margaret...');
        const meds = await getDemoMedications(margaret.id);
        results.medicationsLoaded = meds.length > 0;
        results.medicationsCount = meds.length;
        results.medicationNames = meds.map((m: any) => m.name);
      }

      // Test 4: Check localStorage
      console.log('🔍 Test 4: Checking localStorage...');
      const mockUsers = localStorage.getItem('mock_users');
      results.localStorageHasUsers = !!mockUsers;
      if (mockUsers) {
        const users = JSON.parse(mockUsers);
        results.localStorageUserCount = users.length;
        results.localStorageHasMargaret = users.some((u: any) => u.email === 'margaret.williams@example.com');
      }

      // Test 5: Check current user
      console.log('🔍 Test 5: Checking current user...');
      results.currentUserExists = !!currentUser;
      if (currentUser) {
        results.currentUserEmail = currentUser.email;
        results.currentUserRole = currentUser.role;
        results.currentUserHasPatientData = !!currentUser.patientData;
      }

      // Test 6: Check passed medications prop
      console.log('🔍 Test 6: Checking medications prop...');
      results.medicationsPropCount = medications.length;

    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      results.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    // Auto-run on mount
    runDiagnostics();
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 shadow-xl"
        size="lg"
      >
        <AlertCircle className="w-5 h-5 mr-2" />
        Debug Data
      </Button>
    );
  }

  const StatusIcon = ({ status }: { status: boolean }) =>
    status ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto p-6 bg-white dark:bg-slate-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Data Loading Diagnostics</h2>
          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Retest
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Close
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Test 1: Database Loading */}
          <div className="p-4 border-2 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={testResults.databaseLoaded} />
              <h3 className="text-lg font-semibold">1. Database Loading</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Status: {testResults.databaseLoaded ? '✅ Loaded successfully' : '❌ Failed to load'}
            </p>
            {testResults.databaseStats && (
              <div className="mt-2 bg-slate-100 dark:bg-slate-800 p-3 rounded">
                <code className="text-sm">
                  Doctors: {testResults.databaseStats.doctors} | 
                  Caregivers: {testResults.databaseStats.caregivers} | 
                  Patients: {testResults.databaseStats.patients}
                </code>
              </div>
            )}
          </div>

          {/* Test 2: Margaret Williams */}
          <div className="p-4 border-2 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={testResults.margaretFound} />
              <h3 className="text-lg font-semibold">2. Margaret Williams Found</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Status: {testResults.margaretFound ? '✅ Found in database' : '❌ Not found'}
            </p>
            {testResults.margaretMedCount > 0 && (
              <p className="text-sm mt-1">
                Medications in database: <strong>{testResults.margaretMedCount}</strong>
              </p>
            )}
          </div>

          {/* Test 3: Medications Loading */}
          <div className="p-4 border-2 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={testResults.medicationsLoaded} />
              <h3 className="text-lg font-semibold">3. Medications Loading</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Status: {testResults.medicationsLoaded ? '✅ Loaded successfully' : '❌ Failed to load'}
            </p>
            {testResults.medicationNames && testResults.medicationNames.length > 0 && (
              <div className="mt-2 bg-slate-100 dark:bg-slate-800 p-3 rounded">
                <code className="text-sm block">
                  Count: {testResults.medicationsCount}
                </code>
                <code className="text-sm block mt-1">
                  Names: {testResults.medicationNames.join(', ')}
                </code>
              </div>
            )}
          </div>

          {/* Test 4: LocalStorage */}
          <div className="p-4 border-2 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={testResults.localStorageHasUsers} />
              <h3 className="text-lg font-semibold">4. LocalStorage Check</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Users in localStorage: {testResults.localStorageUserCount || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Margaret in localStorage: {testResults.localStorageHasMargaret ? '✅ Yes' : '❌ No'}
            </p>
          </div>

          {/* Test 5: Current User */}
          <div className="p-4 border-2 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={testResults.currentUserExists} />
              <h3 className="text-lg font-semibold">5. Current User</h3>
            </div>
            {testResults.currentUserEmail && (
              <div className="space-y-1">
                <p className="text-sm">Email: <strong>{testResults.currentUserEmail}</strong></p>
                <p className="text-sm">Role: <strong>{testResults.currentUserRole}</strong></p>
                <p className="text-sm">
                  Has Patient Data: {testResults.currentUserHasPatientData ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            )}
          </div>

          {/* Test 6: Medications Prop */}
          <div className="p-4 border-2 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={testResults.medicationsPropCount > 0} />
              <h3 className="text-lg font-semibold">6. Medications Prop (Passed to Dashboard)</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Count: <strong>{testResults.medicationsPropCount}</strong> medications
            </p>
            <p className="text-sm mt-2 text-orange-600 dark:text-orange-400">
              {testResults.medicationsPropCount === 0 
                ? '⚠️ This is why Dashboard shows 0! Medications are not being fetched or passed correctly.'
                : '✅ Medications are being passed correctly to Dashboard'}
            </p>
          </div>

          {/* Error Display */}
          {testResults.error && (
            <div className="p-4 border-2 border-red-500 rounded-lg bg-red-50 dark:bg-red-950/30">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Error</h3>
              <code className="text-sm text-red-600 dark:text-red-400 block">
                {testResults.error}
              </code>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Summary</h3>
            <div className="space-y-1 text-sm">
              <p>✅ Tests passed: {Object.values(testResults).filter(v => v === true).length}</p>
              <p>❌ Tests failed: {Object.values(testResults).filter(v => v === false).length}</p>
              <p className="mt-3 text-blue-800 dark:text-blue-300">
                {testResults.medicationsPropCount === 0 && testResults.medicationsLoaded
                  ? '🔍 Diagnosis: Medications load from database but are not being fetched/passed to Dashboard. Check App.tsx fetchMedications() and api.getMedications().'
                  : testResults.medicationsPropCount > 0
                  ? '✅ All systems operational! Data is loading correctly.'
                  : '⚠️ Investigating data flow...'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
