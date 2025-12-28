import type { CompleteDatabase } from '../types';
import { databaseData } from './complete-database-data';
import { mergeDatabaseChanges, loadDatabaseChanges } from '../utils/databasePersistence';

// In-memory cache for the database
let cachedDatabase: CompleteDatabase | null = null;

// Database loader - uses TypeScript data file (no JSON parsing issues)
export async function loadDatabase(): Promise<CompleteDatabase> {
  // Return cached version if available
  if (cachedDatabase) {
    return Promise.resolve(cachedDatabase);
  }

  try {
    console.log('🔍 Loading database from TypeScript module...');
    
    // Load original data from TypeScript module
    const originalData = databaseData;
    
    // Load changes from localStorage (if any)
    const changes = loadDatabaseChanges();
    
    // Merge changes with original data
    cachedDatabase = mergeDatabaseChanges(originalData, changes);
    
    if (changes) {
      console.log('✓ Database loaded with localStorage changes:', {
        doctors: cachedDatabase.doctors?.length || 0,
        caregivers: cachedDatabase.caregivers?.length || 0,
        patients: cachedDatabase.patients?.length || 0,
        lastModified: changes.lastModified
      });
    } else {
      console.log('✓ Database loaded (original data):', {
        doctors: cachedDatabase.doctors?.length || 0,
        caregivers: cachedDatabase.caregivers?.length || 0,
        patients: cachedDatabase.patients?.length || 0
      });
    }
    
    return cachedDatabase;
  } catch (error) {
    console.error('❌ Failed to load database:', error);
    if (error instanceof Error) {
      throw new Error(`Database loading failed: ${error.message}. Check browser console for details.`);
    }
    throw new Error('Failed to load database from TypeScript module');
  }
}

// Export a lazy promise that resolves to the database when first accessed
let databasePromiseInstance: Promise<CompleteDatabase> | null = null;

export const getDatabasePromise = (): Promise<CompleteDatabase> => {
  if (!databasePromiseInstance) {
    databasePromiseInstance = loadDatabase();
  }
  return databasePromiseInstance;
};