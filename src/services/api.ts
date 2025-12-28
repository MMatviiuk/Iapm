// API Service - Mock version for development without backend
// Switch to real API when backend is ready

import { getAvatarUrl } from '../utils/avatarUtils';
import { initializeDemoUsers, getDemoMedications, getDemoDependents, getDemoPatients } from '../utils/demoData';
import { logAudit } from '../utils/auditLogger';
import { createSession, endSession, updateActivity } from '../utils/sessionManager';
import { log, logApiRequest, logApiResponse, logApiError } from '../utils/logger';
import { retryWithBackoff, isRetryableError, isOnline, CircuitBreaker } from '../utils/apiResilience';

const USE_MOCK_API = true; // Set to false when backend is ready
const USE_DEMO_DATA = true; // Set to false to use empty localStorage data

// Safely access environment variables
const getApiUrl = () => {
  try {
    return import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';
  } catch {
    return 'http://localhost:3000/api';
  }
};

const API_BASE_URL = getApiUrl();

// Mock delay to simulate network latency
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize mock data storage with demo users
const initializeMockStorage = async () => {
  const existingUsers = localStorage.getItem('mock_users');
  
  // ALWAYS reinitialize demo data to ensure demo accounts exist
  // This fixes the "user not found" error when trying to login
  if (USE_DEMO_DATA) {
    try {
      console.log('🔄 Reinitializing demo data to ensure demo accounts exist...');
      await initializeDemoUsers();
      console.log('✅ Demo data initialized from complete database');
    } catch (error) {
      console.error('❌ Failed to initialize demo data:', error);
      // Fallback to simple demo users
      const demoUsers = [
        {
          id: '1',
          email: 'patient@demo.com',
          password: 'demo123',
          name: 'John Smith',
          role: 'patient',
          dateOfBirth: '1952-03-15',
          gender: 'male',
          photoUrl: 'https://images.unsplash.com/photo-1758686253859-8ef7e940096e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ2Nzc1N3ww&ixlib=rb-4.1.0&q=80&w=400',
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'caregiver@demo.com',
          password: 'demo123',
          name: 'Anna Johnson',
          role: 'caregiver',
          dateOfBirth: '1978-07-22',
          gender: 'female',
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'doctor@demo.com',
          password: 'demo123',
          name: 'Dr. Rodriguez',
          role: 'doctor',
          dateOfBirth: '1975-11-08',
          gender: 'male',
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        },
      ];
      
      localStorage.setItem('mock_users', JSON.stringify(demoUsers));
    }
  }
  
  return {
    users: JSON.parse(localStorage.getItem('mock_users') || '[]') as any[],
    medications: JSON.parse(localStorage.getItem('mock_medications') || '[]') as any[],
  };
};

// Mock data storage - initialized async
let mockStorage: any = {
  users: [],
  medications: [],
  initialized: false,
  initPromise: null as Promise<void> | null,
  saveUsers() {
    localStorage.setItem('mock_users', JSON.stringify(this.users));
  },
  saveMedications() {
    localStorage.setItem('mock_medications', JSON.stringify(this.medications));
  },
  async ensureInitialized() {
    if (this.initialized) return;
    if (this.initPromise) {
      await this.initPromise;
      return;
    }
    
    this.initPromise = (async () => {
      console.log('🚀 Initializing mock storage...');
      const initialized = await initializeMockStorage();
      this.users = initialized.users;
      this.medications = initialized.medications;
      this.initialized = true;
      console.log(`✅ Mock storage initialized:`, {
        users: this.users.length,
        medications: this.medications.length,
        demoAccounts: this.users.filter(u => u.email.includes('demo.com')).map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
        })),
        allEmails: this.users.map(u => u.email)
      });
    })();
    
    await this.initPromise;
  }
};

// Initialize storage on load
mockStorage.ensureInitialized();

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage and check expiry
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('authTokenExpiry');
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        // Token is still valid
        this.token = token;
        console.log('✅ Session restored - token valid until', new Date(expiryTime).toLocaleString());
      } else {
        // Token expired, clear it
        console.log('⚠️ Session expired - please login again');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
        this.token = null;
      }
    } else if (token) {
      // Old token without expiry - keep it for backwards compatibility
      this.token = token;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const method = options.method || 'GET';
    
    // Log API request
    logApiRequest(method, endpoint, options.body);
    
    if (USE_MOCK_API) {
      // Mock API implementation
      return this.mockRequest(endpoint, options);
    }

    // Real API implementation
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = response.ok ? await response.json() : null;
      
      // Log API response
      logApiResponse(method, endpoint, response.status, data);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        const errorMessage = errorData.message || `HTTP ${response.status}`;
        const error = new Error(errorMessage);
        logApiError(method, endpoint, error);
        throw error;
      }

      return data;
    } catch (error) {
      // Log network or other errors
      logApiError(method, endpoint, error as Error);
      throw error;
    }
  }

  private async mockRequest(endpoint: string, options: RequestInit = {}) {
    console.log('Mock API Request:', { endpoint, method: options.method || 'GET' });
    
    // Ensure mock storage is initialized before processing any request
    await mockStorage.ensureInitialized();
    
    await mockDelay(300);

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Authentication endpoints
    if (endpoint === '/auth/login' && method === 'POST') {
      console.log('🔐 Mock login attempt:', body.email, 'rememberMe:', body.rememberMe);
      console.log('📊 Available users in storage:', mockStorage.users.length);
      console.log('📧 User emails:', mockStorage.users.map(u => u.email).join(', '));
      console.log('🔑 Demo accounts with passwords:', mockStorage.users.filter(u => u.email.includes('demo.com')).map(u => ({
        email: u.email,
        password: u.password,
        name: u.name,
        role: u.role
      })));
      
      const { email, password, rememberMe } = body;
      const user = mockStorage.users.find(u => u.email === email);
      
      if (!user) {
        console.error('❌ Login failed: user not found');
        console.error('🔍 Tried to find:', email);
        console.error('📋 Available emails:', mockStorage.users.map(u => u.email));
        
        // Log failed login attempt
        logAudit('LOGIN_FAILED', 'authentication', {
          success: false,
          errorMessage: 'User not found',
          metadata: { email },
        });
        
        throw new Error('User not found - No account exists with this email address');
      }
      
      console.log('🔐 Password comparison:', {
        providedPassword: password,
        storedPassword: user.password,
        match: user.password === password,
        providedType: typeof password,
        storedType: typeof user.password,
        providedLength: password?.length,
        storedLength: user.password?.length
      });
      
      if (user.password !== password) {
        console.error('❌ Login failed: wrong password');
        console.error('🔍 Expected:', user.password);
        console.error('🔍 Received:', password);
        
        // Log failed login attempt
        logAudit('LOGIN_FAILED', 'authentication', {
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          success: false,
          errorMessage: 'Invalid password',
          metadata: { email },
        });
        
        throw new Error('Invalid email or password - Please check your password and try again');
      }

      // Token expiration: 30 days if rememberMe, 1 day otherwise
      const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const expiresAt = Date.now() + expiresIn;
      const token = `mock_token_${user.id}_${Date.now()}_exp${expiresAt}`;
      
      // Create session
      createSession(user.id, user.role, rememberMe);
      
      // Log successful login
      logAudit('LOGIN', 'authentication', {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        success: true,
        metadata: { rememberMe, expiresAt },
      });
      
      console.log('Login successful:', user.email, `Token expires in ${rememberMe ? '30' : '1'} day(s)`);
      return {
        token,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          dateOfBirth: user.dateOfBirth,
          onboardingComplete: user.onboardingComplete || true,
        },
      };
    }

    if (endpoint === '/auth/register' && method === 'POST') {
      console.log('Mock registration attempt:', body);
      const { email, password, name, role, dateOfBirth } = body;
      
      if (mockStorage.users.find(u => u.email === email)) {
        console.error('Registration failed: email already exists');
        throw new Error('Email already registered - This email is already in use. Try logging in instead, or use a different email address');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('invalid email - Please enter a valid email address (e.g., name@example.com)');
      }
      
      // Validate password strength
      if (password.length < 8) {
        throw new Error('password weak - Password must be at least 8 characters long');
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role,
        dateOfBirth,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      };

      mockStorage.users.push(newUser);
      mockStorage.saveUsers();
      console.log('Registration successful:', newUser.email);
      console.log('Total users now:', mockStorage.users.length);

      const token = `mock_token_${newUser.id}_${Date.now()}`;
      return {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          dateOfBirth: newUser.dateOfBirth,
          onboardingComplete: newUser.onboardingComplete,
        },
      };
    }

    // OAuth callback endpoint
    if (endpoint === '/auth/oauth/callback' && method === 'POST') {
      console.log('Mock OAuth callback:', body);
      const { code, provider, action } = body;
      
      // Simulate exchanging authorization code for user data
      // In production, this would:
      // 1. Exchange code for access token with OAuth provider
      // 2. Fetch user profile from OAuth provider
      // 3. Create/update user in database
      // 4. Return JWT token
      
      // Mock user data from OAuth provider
      const oauthEmail = `${provider.toLowerCase()}_user_${Math.random().toString(36).substring(7)}@oauth.demo`;
      const oauthName = `${provider} User`;
      
      // Check if user exists
      let user = mockStorage.users.find(u => u.email === oauthEmail);
      
      if (!user) {
        // Create new user from OAuth data
        user = {
          id: Date.now().toString(),
          email: oauthEmail,
          password: '', // No password for OAuth users
          name: oauthName,
          role: action === 'signup' ? 'patient' : 'patient',
          dateOfBirth: '1980-01-01', // Default DOB
          onboardingComplete: false,
          oauthProvider: provider,
          createdAt: new Date().toISOString(),
        };
        
        mockStorage.users.push(user);
        mockStorage.saveUsers();
        console.log('OAuth user created:', user.email);
      } else {
        console.log('OAuth user exists:', user.email);
      }
      
      const token = `mock_token_${user.id}_${Date.now()}`;
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          dateOfBirth: user.dateOfBirth,
          onboardingComplete: user.onboardingComplete,
        },
      };
    }

    if (endpoint === '/auth/me' && method === 'GET') {
      console.log('Fetching current user with token:', this.token);
      
      // Extract user ID from token
      // Token format: mock_token_{userId}_{timestamp} or mock_token_{userId}_{timestamp}_exp{expiresAt}
      // Use non-greedy match to get userId before first 13-digit timestamp
      const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
      const userId = tokenMatch ? tokenMatch[1] : null;
      
      console.log('Looking for user ID:', userId);
      console.log('Available users:', mockStorage.users.map(u => ({ id: u.id, email: u.email })));
      
      // CRITICAL FIX: Never fallback to first user - this violates privacy!
      const user = userId ? mockStorage.users.find(u => u.id === userId) : null;
      
      if (!user) {
        console.error('❌ User not found for ID:', userId);
        console.error('Available user IDs:', mockStorage.users.map(u => u.id));
        throw new Error('User not found');
      }

      console.log('✅ Found user:', user.email, 'Role:', user.role);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        photoUrl: user.photoUrl,
        onboardingComplete: user.onboardingComplete || true,
        patientData: user.patientData,
      };
    }

    // Medications endpoints
    if (endpoint === '/medications' && method === 'GET') {
      // If using demo data, load from patient's medications
      if (USE_DEMO_DATA && this.token) {
        // Extract user ID from token (same regex as /auth/me)
        const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
        const userId = tokenMatch ? tokenMatch[1] : null;
        const user = userId ? mockStorage.users.find(u => u.id === userId) : null;
        
        console.log('🔍 getMedications - User lookup:', {
          token: this.token,
          userId,
          user: user ? { id: user.id, name: user.name, role: user.role, hasPatientData: !!user.patientData } : null
        });
        
        if (user && user.role === 'patient' && user.patientData) {
          try {
            console.log('🔍 Loading demo medications for patient:', user.patientData.id);
            const medications = await getDemoMedications(user.patientData.id);
            console.log(`✅ Loaded ${medications.length} medications for ${user.name}:`, medications.map(m => ({ name: m.name, times: m.times })));
            
            // Store demo medications in mockStorage so they can be updated/deleted
            // Only add medications that aren't already in storage
            medications.forEach(med => {
              const exists = mockStorage.medications.find(m => m.id === med.id);
              if (!exists) {
                mockStorage.medications.push({
                  ...med,
                  userId, // Associate with current user
                });
              }
            });
            mockStorage.saveMedications();
            
            return medications;
          } catch (error) {
            console.error('❌ Failed to load demo medications:', error);
            return [];
          }
        }
      }
      
      // For new users (no patientData), return only THEIR medications
      const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
      const userId = tokenMatch ? tokenMatch[1] : null;
      const userMedications = mockStorage.medications.filter(m => m.userId === userId);
      console.log(`📦 Returning ${userMedications.length} medications for user ${userId}`);
      return userMedications;
    }

    if (endpoint === '/medications' && method === 'POST') {
      // Extract user ID from token to associate medication with user
      const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
      const userId = tokenMatch ? tokenMatch[1] : null;
      
      const newMed = {
        id: Date.now(),
        ...body,
        userId, // Associate with user
        createdAt: new Date().toISOString(),
      };
      mockStorage.medications.push(newMed);
      mockStorage.saveMedications();
      console.log(`✅ Created medication for user ${userId}:`, newMed.name);
      
      // Log medication creation
      logAudit('MEDICATION_ADDED', 'medication', {
        resourceId: String(newMed.id),
        success: true,
        metadata: {
          medicationName: newMed.name,
          dosage: newMed.dosage,
          frequency: newMed.timesPerDay,
        },
      });
      
      return newMed;
    }

    if (endpoint.startsWith('/medications/') && method === 'PUT') {
      const idStr = endpoint.split('/')[2];
      // Handle both string IDs (like 'rx_001') and numeric IDs
      const id = isNaN(Number(idStr)) ? idStr : parseInt(idStr);
      const index = mockStorage.medications.findIndex(m => m.id == id); // Use == for loose comparison
      
      if (index === -1) {
        throw new Error('Medication not found');
      }

      const updatedMed = {
        ...mockStorage.medications[index],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      mockStorage.medications[index] = updatedMed;
      mockStorage.saveMedications();
      
      // DEBUG: Log meal timing to verify it's saved
      if (body.mealTiming) {
        console.log(`✅ Updated medication ${updatedMed.name} - Meal Timing: ${body.mealTiming}`);
      }
      
      // Log medication update
      logAudit('MEDICATION_UPDATED', 'medication', {
        resourceId: String(updatedMed.id),
        success: true,
        metadata: {
          medicationName: updatedMed.name,
          updatedFields: Object.keys(body),
        },
      });
      
      return updatedMed;
    }

    if (endpoint.startsWith('/medications/') && method === 'DELETE') {
      const idStr = endpoint.split('/')[2];
      // Handle both string IDs (like 'rx_001') and numeric IDs
      const id = isNaN(Number(idStr)) ? idStr : parseInt(idStr);
      const deletedMed = mockStorage.medications.find(m => m.id == id);
      
      mockStorage.medications = mockStorage.medications.filter(m => m.id != id); // Use != for loose comparison
      mockStorage.saveMedications();
      
      // Log medication deletion
      if (deletedMed) {
        logAudit('MEDICATION_DELETED', 'medication', {
          resourceId: String(id),
          success: true,
          metadata: {
            medicationName: deletedMed.name,
          },
        });
      }
      
      return { success: true };
    }

    if (endpoint.includes('/taken') && method === 'POST') {
      const idStr = endpoint.split('/')[2];
      // Handle both string IDs (like 'rx_001') and numeric IDs
      const id = isNaN(Number(idStr)) ? idStr : parseInt(idStr);
      const med = mockStorage.medications.find(m => m.id == id); // Use == for loose comparison
      
      if (med) {
        if (!med.takenHistory) {
          med.takenHistory = [];
        }
        med.takenHistory.push({
          timestamp: body.timestamp,
          takenAt: new Date().toISOString(),
        });
        mockStorage.saveMedications();
        
        // Log medication marked as taken
        logAudit('MEDICATION_MARKED_TAKEN', 'medication', {
          resourceId: String(id),
          success: true,
          metadata: {
            medicationName: med.name,
            timestamp: body.timestamp,
          },
        });
      }
      
      return { success: true };
    }

    // Analytics endpoints
    if (endpoint.includes('/analytics/dashboard')) {
      return {
        totalMedications: mockStorage.medications.length,
        adherenceRate: 92,
        upcomingToday: mockStorage.medications.filter(m => m.frequency).length,
        missedDoses: 2,
      };
    }

    if (endpoint.includes('/analytics/adherence')) {
      return {
        weeklyAdherence: [85, 90, 88, 92, 95, 91, 89],
        overallRate: 90,
      };
    }

    // Patients/Dependents endpoints
    if (endpoint === '/patients' && method === 'GET') {
      const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
      const userId = tokenMatch ? tokenMatch[1] : null;
      const user = userId ? mockStorage.users.find(u => u.id === userId) : null;
      
      // ONLY load demo data if user has doctorData (is a demo account)
      if (USE_DEMO_DATA && user && user.role === 'doctor' && user.doctorData) {
        try {
          const patients = await getDemoPatients(user.doctorData.id);
          console.log(`✅ Loaded ${patients.length} demo patients for Dr. ${user.name}`);
          return patients.map(p => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            dateOfBirth: p.dateOfBirth,
            gender: p.gender,
            photoUrl: p.photoUrl,
            adherenceRate: p.adherenceRate || 90,
            medicationsCount: p.medications?.length || 0,
          }));
        } catch (error) {
          console.error('Failed to load demo patients:', error);
          return [];
        }
      }
      
      // For new doctors, return empty array
      console.log('ℹ️ New doctor account - returning empty patients list');
      return [];
    }
    
    if (endpoint === '/dependents' && method === 'GET') {
      const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
      const userId = tokenMatch ? tokenMatch[1] : null;
      const user = userId ? mockStorage.users.find(u => u.id === userId) : null;
      
      // ONLY load demo data if user has caregiverData (is a demo account)
      if (USE_DEMO_DATA && user && user.role === 'caregiver' && user.caregiverData) {
        try {
          const dependents = await getDemoDependents(user.caregiverData.id);
          console.log(`✅ Loaded ${dependents.length} demo dependents for ${user.name}`);
          return dependents.map(d => ({
            id: d.id,
            name: `${d.firstName} ${d.lastName}`,
            dateOfBirth: d.dateOfBirth,
            gender: d.gender,
            photoUrl: d.photoUrl,
            adherenceRate: d.adherenceRate || 90,
            medicationsCount: d.medications?.length || 0,
            relationship: 'Family Member',
          }));
        } catch (error) {
          console.error('Failed to load demo dependents:', error);
          return [];
        }
      }
      
      // For new caregivers, return empty array
      console.log('ℹ️ New caregiver account - returning empty dependents list');
      return [];
    }

    if (endpoint.includes('/dependents') && method === 'POST') {
      const newDependent = {
        id: Date.now().toString(),
        ...body,
        createdAt: new Date().toISOString(),
      };
      
      // Log dependent addition
      logAudit('DEPENDENT_ADDED', 'dependent', {
        resourceId: newDependent.id,
        success: true,
        metadata: {
          dependentName: newDependent.name,
          relationship: newDependent.relationship,
        },
      });
      
      return newDependent;
    }

    if (endpoint.includes('/patients/invite') && method === 'POST') {
      // Log patient invitation
      logAudit('PATIENT_INVITED', 'patient', {
        success: true,
        metadata: {
          patientEmail: body.email,
          patientName: body.name,
        },
      });
      
      return {
        success: true,
        message: 'Invitation sent',
      };
    }

    // History endpoint
    if (endpoint.includes('/history')) {
      return mockStorage.medications.filter(m => m.takenHistory).flatMap(m =>
        (m.takenHistory || []).map((h: any) => ({
          medicationId: m.id,
          medicationName: m.name,
          ...h,
        }))
      );
    }

    // Notifications
    if (endpoint.includes('/notifications/settings')) {
      if (method === 'GET') {
        return JSON.parse(localStorage.getItem('notification_settings') || '{}');
      }
      if (method === 'PUT') {
        localStorage.setItem('notification_settings', JSON.stringify(body));
        
        // Log notification settings change
        logAudit('NOTIFICATIONS_CHANGED', 'settings', {
          success: true,
          metadata: {
            settingsChanged: Object.keys(body),
          },
        });
        
        return body;
      }
    }

    // Profile
    if (endpoint === '/profile' && method === 'PUT') {
      const userId = this.token?.split('_')[2];
      const user = mockStorage.users.find(u => u.id === userId);
      
      if (user) {
        Object.assign(user, body);
        mockStorage.saveUsers();
        
        // Log profile update
        logAudit('PROFILE_UPDATED', 'user_profile', {
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          success: true,
          metadata: {
            fieldsUpdated: Object.keys(body),
          },
        });
        
        return user;
      }
    }

    // Default: return empty response
    return {};
  }

  // Authentication
  async login(email: string, password: string, rememberMe: boolean = false) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });
    this.token = data.token;
    
    // Store token with expiration info
    localStorage.setItem('authToken', data.token);
    if (data.expiresAt) {
      localStorage.setItem('authTokenExpiry', data.expiresAt.toString());
    }
    
    console.log(`✅ Login successful - Remember Me: ${rememberMe ? 'ON (30 days)' : 'OFF (1 day)'}`);
    return data;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'caregiver' | 'doctor';
    dateOfBirth?: string;
  }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.token = data.token;
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async logout() {
    // Log logout before clearing session
    logAudit('LOGOUT', 'authentication', {
      success: true,
    });
    
    // End session
    endSession();
    
    this.token = null;
    // Clear ALL user-specific data on logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
    localStorage.removeItem('rememberedEmail');
    // Keep mock_users and mock_medications for future logins
    // But don't remove them as they contain all accounts
    console.log('✅ Logged out - token and session data cleared');
  }

  async deleteAccount() {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      // Get current user from token
      const tokenMatch = this.token?.match(/mock_token_(.+?)_(\d{13})/);
      const userId = tokenMatch ? tokenMatch[1] : null;
      
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const user = mockStorage.users.find((u: any) => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Cascade deletion logic based on role
      if (user.role === 'caregiver' && user.caregiverData) {
        // Remove caregiver from all dependents
        const dependents = mockStorage.users.filter((u: any) => 
          u.patientData?.caregiverId === user.caregiverData.id
        );
        dependents.forEach((dep: any) => {
          if (dep.patientData) {
            dep.patientData.caregiverId = undefined;
          }
        });
      }

      if (user.role === 'doctor' && user.doctorData) {
        // Remove doctor from all patients
        const patients = mockStorage.users.filter((u: any) => 
          u.patientData?.primaryDoctorId === user.doctorData.id
        );
        patients.forEach((patient: any) => {
          if (patient.patientData) {
            patient.patientData.primaryDoctorId = undefined;
          }
        });
      }

      // Delete user's medications
      mockStorage.medications = mockStorage.medications.filter((m: any) => m.userId !== userId);
      
      // Delete user account
      mockStorage.users = mockStorage.users.filter((u: any) => u.id !== userId);
      
      // Save changes
      mockStorage.saveUsers();
      mockStorage.saveMedications();
      
      // Log account deletion
      logAudit('ACCOUNT_DELETED', 'user_account', {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        success: true,
        metadata: { gdprCompliant: true },
      });
      
      // Clear token
      this.token = null;
      localStorage.removeItem('authToken');
      
      // End session
      endSession();
      
      console.log('✅ Account deleted successfully (GDPR compliant)');
      return { success: true, message: 'Account deleted successfully' };
    }

    return this.request('/auth/delete-account', { method: 'DELETE' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Medications
  async getMedications(userId?: string) {
    const endpoint = userId ? `/medications?userId=${userId}` : '/medications';
    return this.request(endpoint);
  }

  async createMedication(medication: any) {
    return this.request('/medications', {
      method: 'POST',
      body: JSON.stringify(medication),
    });
  }

  async updateMedication(id: string, updates: any) {
    return this.request(`/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMedication(id: string) {
    return this.request(`/medications/${id}`, {
      method: 'DELETE',
    });
  }

  async markMedicationTaken(id: string, timestamp: string) {
    return this.request(`/medications/${id}/taken`, {
      method: 'POST',
      body: JSON.stringify({ timestamp }),
    });
  }

  // Patients (for caregivers and doctors)
  async getPatients() {
    return this.request('/patients');
  }

  async getPatientDetails(patientId: string) {
    return this.request(`/patients/${patientId}`);
  }

  async invitePatient(email: string, name: string) {
    return this.request('/patients/invite', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async addDependent(dependentData: {
    name: string;
    dateOfBirth: string;
    relationship: string;
  }) {
    return this.request('/dependents', {
      method: 'POST',
      body: JSON.stringify(dependentData),
    });
  }

  async getDependents() {
    return this.request('/dependents');
  }

  // Analytics
  async getAdherenceStats(userId?: string, dateRange?: { start: string; end: string }) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (dateRange) {
      params.append('start', dateRange.start);
      params.append('end', dateRange.end);
    }
    return this.request(`/analytics/adherence?${params}`);
  }

  async getDashboardStats() {
    return this.request('/analytics/dashboard');
  }

  // History
  async getMedicationHistory(medicationId?: string, dateRange?: { start: string; end: string }) {
    const params = new URLSearchParams();
    if (medicationId) params.append('medicationId', medicationId);
    if (dateRange) {
      params.append('start', dateRange.start);
      params.append('end', dateRange.end);
    }
    return this.request(`/history?${params}`);
  }

  // Notifications
  async updateNotificationSettings(settings: any) {
    return this.request('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getNotificationSettings() {
    return this.request('/notifications/settings');
  }

  // Profile
  async updateProfile(updates: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async uploadPhoto(file: File) {
    // Mock photo upload
    if (USE_MOCK_API) {
      await mockDelay(1000);
      const result = {
        url: URL.createObjectURL(file),
        success: true,
      };
      
      // Log photo upload
      logAudit('PHOTO_UPLOADED', 'user_profile', {
        success: true,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        },
      });
      
      return result;
    }

    const formData = new FormData();
    formData.append('photo', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/photo`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // ===== PROFILE SHARING (Iteration 3 Feature) =====
  
  /**
   * Get all share links created by current user
   */
  async getShareLinks() {
    if (USE_MOCK_API) {
      await mockDelay(300);
      return {
        data: JSON.parse(localStorage.getItem('mock_share_links') || '[]')
      };
    }
    return this.request('/share/links');
  }

  /**
   * Create a new share link for current user's profile
   */
  async createShareLink(options: { role: 'caregiver' | 'viewer'; expiresInDays: number }) {
    if (USE_MOCK_API) {
      await mockDelay(500);
      
      const token = `share_${Math.random().toString(36).substring(2, 15)}`;
      const newLink = {
        id: Date.now().toString(),
        token,
        role: options.role,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        viewCount: 0
      };
      
      const links = JSON.parse(localStorage.getItem('mock_share_links') || '[]');
      links.push(newLink);
      localStorage.setItem('mock_share_links', JSON.stringify(links));
      
      return { data: newLink };
    }
    
    return this.request('/share/create', {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }

  /**
   * Revoke a share link
   */
  async revokeShareLink(linkId: string) {
    if (USE_MOCK_API) {
      await mockDelay(300);
      
      const links = JSON.parse(localStorage.getItem('mock_share_links') || '[]');
      const updatedLinks = links.map((link: any) => 
        link.id === linkId ? { ...link, status: 'revoked' } : link
      );
      localStorage.setItem('mock_share_links', JSON.stringify(updatedLinks));
      
      return { success: true };
    }
    
    return this.request(`/share/${linkId}/revoke`, {
      method: 'POST'
    });
  }

  /**
   * Get shared profile data by token (for caregiver viewing)
   */
  async getSharedProfile(token: string) {
    if (USE_MOCK_API) {
      await mockDelay(500);
      
      // Check if token is valid
      const links = JSON.parse(localStorage.getItem('mock_share_links') || '[]');
      const link = links.find((l: any) => l.token === token && l.status === 'active');
      
      if (!link) {
        throw {
          response: { status: 403 },
          message: 'Invalid or revoked share link'
        };
      }
      
      // Get owner's data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const medications = JSON.parse(localStorage.getItem('mock_medications') || '[]');
      
      return {
        data: {
          owner: {
            name: currentUser.name || 'John Smith',
            age: currentUser.age || 72,
            avatar: currentUser.avatar || getAvatarUrl({ name: currentUser.name || 'John Smith' })
          },
          medications: medications
        }
      };
    }
    
    return this.request(`/share/profile/${token}`);
  }

  /**
   * Track when someone views a shared profile (increment view count)
   */
  async trackShareView(token: string) {
    if (USE_MOCK_API) {
      await mockDelay(100);
      
      const links = JSON.parse(localStorage.getItem('mock_share_links') || '[]');
      const updatedLinks = links.map((link: any) => 
        link.token === token 
          ? { ...link, viewCount: (link.viewCount || 0) + 1 }
          : link
      );
      localStorage.setItem('mock_share_links', JSON.stringify(updatedLinks));
      
      return { success: true };
    }
    
    return this.request(`/share/track/${token}`, {
      method: 'POST'
    });
  }
}

export const api = new ApiService();
export default api;
