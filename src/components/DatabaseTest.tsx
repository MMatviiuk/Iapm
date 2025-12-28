import { useState, useEffect } from 'react';
import { loadDatabase } from '../data/database';
import type { CompleteDatabase } from '../types';

export default function DatabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [database, setDatabase] = useState<CompleteDatabase | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function testDatabase() {
      try {
        console.log('🧪 Testing database load...');
        const db = await loadDatabase();
        console.log('✅ Database loaded successfully:', db);
        setDatabase(db);
        setStatus('success');
      } catch (err: any) {
        console.error('❌ Database load failed:', err);
        setError(err.message || 'Unknown error');
        setStatus('error');
      }
    }

    testDatabase();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Testing Database Load...
          </h2>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              Database Load Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
              Debug Information:
            </h3>
            <div className="space-y-2 text-sm text-red-800 dark:text-red-200 font-mono">
              <p>Error: {error}</p>
              <p>Status: {status}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Troubleshooting Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Stop the dev server (Ctrl+C)</li>
              <li>Delete Vite cache: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">rm -rf node_modules/.vite</code></li>
              <li>Copy database: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm run copy-db</code></li>
              <li>Restart dev server: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm run dev</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              Database Loaded Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              All data structures are valid and ready to use
            </p>
          </div>
        </div>

        {database && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                👨‍⚕️ Doctors
              </h3>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {database.doctors.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Healthcare professionals
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                👥 Caregivers
              </h3>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {database.caregivers.length}
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                Family members caring
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                🏥 Patients
              </h3>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {database.patients.length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                People receiving care
              </p>
            </div>
          </div>
        )}

        {database && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sample Data Preview
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  First Doctor:
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-700 dark:text-gray-300">
                    {JSON.stringify(database.doctors[0], null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  First Caregiver:
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-700 dark:text-gray-300">
                    {JSON.stringify(database.caregivers[0], null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  First Patient (with medications):
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-700 dark:text-gray-300">
                    {JSON.stringify(database.patients[0], null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
