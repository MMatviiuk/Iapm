/**
 * API TYPES
 * Strict TypeScript types for API requests/responses
 * Eliminates 'any' types and improves type safety
 */

import {
  Prescription,
  MedicationHistoryEntry,
  User,
  Dependent,
  Patient,
  AdherenceStats,
  DashboardStats,
  Achievement,
  NotificationSettings,
} from './index';

// ==================== API RESPONSE TYPES ====================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Standard API error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  timestamp: string;
}

// ==================== AUTH TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number; // seconds
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  role: 'patient' | 'caregiver' | 'doctor';
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state: string;
  provider: 'google' | 'facebook' | 'apple';
}

export interface OAuthCallbackResponse {
  token: string;
  user: User;
  isNewUser: boolean;
}

// ==================== USER TYPES ====================

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  photoUrl?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailRequest {
  newEmail: string;
  password: string;
}

// ==================== MEDICATION TYPES ====================

export interface CreateMedicationRequest {
  name: string;
  dosage: string;
  frequency: string;
  timesPerDay: string[];
  mealTiming?: 'before meal' | 'with meal' | 'after meal' | 'anytime';
  duration?: {
    amount: number;
    unit: 'days' | 'weeks' | 'months' | 'lifetime';
  };
  startDate: string;
  endDate?: string;
  notes?: string;
  photoUrl?: string;
  daysOfWeek?: string[];
}

export interface UpdateMedicationRequest extends Partial<CreateMedicationRequest> {
  id: string;
}

export interface MarkTakenRequest {
  medicationId: string;
  date: string;
  time: string;
  taken: boolean;
  skippedReason?: string;
}

export interface MarkTakenResponse {
  success: boolean;
  entry: MedicationHistoryEntry;
}

// ==================== DEPENDENT TYPES ====================

export interface AddDependentRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string;
  gender?: 'male' | 'female';
  photoUrl?: string;
}

export interface UpdateDependentRequest extends Partial<AddDependentRequest> {
  id: string;
}

// ==================== PATIENT TYPES ====================

export interface InvitePatientRequest {
  email: string;
  firstName: string;
  lastName: string;
  message?: string;
}

export interface InvitePatientResponse {
  success: boolean;
  invitationId: string;
  sentAt: string;
}

export interface PrescribeMedicationRequest extends CreateMedicationRequest {
  patientId: string;
}

// ==================== ANALYTICS TYPES ====================

export interface GetAdherenceRequest {
  userId?: string; // For caregiver/doctor
  dependentId?: string; // For caregiver
  patientId?: string; // For doctor
  startDate?: string;
  endDate?: string;
}

export interface AdherenceData {
  date: string;
  taken: number;
  total: number;
  percentage: number;
}

export interface WeeklyAdherenceResponse {
  week: AdherenceData[];
  average: number;
}

export interface MonthlyAdherenceResponse {
  month: AdherenceData[];
  average: number;
}

// ==================== FILE UPLOAD TYPES ====================

export interface UploadPhotoRequest {
  file: File;
  type: 'profile' | 'medication';
}

export interface UploadPhotoResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// ==================== QUERY PARAMS ====================

export interface GetMedicationsParams {
  status?: 'scheduled' | 'active' | 'completed' | 'deleted';
  search?: string;
  sortBy?: 'name' | 'startDate' | 'frequency';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface GetHistoryParams {
  medicationId?: string;
  startDate?: string;
  endDate?: string;
  taken?: boolean;
  page?: number;
  pageSize?: number;
}

// ==================== TYPE GUARDS ====================

/**
 * Check if response is an error
 */
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
}

/**
 * Check if response is successful
 */
export function isApiSuccess<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === true &&
    'data' in response
  );
}

/**
 * Check if response is paginated
 */
export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as any).data)
  );
}

// ==================== UTILITY TYPES ====================

/**
 * Make all properties required (opposite of Partial)
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Exclude null and undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Extract types from array
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Extract Promise return type
 */
export type PromiseType<T> = T extends Promise<infer U> ? U : never;

// ==================== REQUEST/RESPONSE MAPPING ====================

/**
 * Map of all API endpoints to their request/response types
 * Useful for type-safe API client
 */
export interface ApiEndpoints {
  // Auth
  'POST /auth/login': {
    request: LoginRequest;
    response: ApiResponse<LoginResponse>;
  };
  'POST /auth/register': {
    request: RegisterRequest;
    response: ApiResponse<RegisterResponse>;
  };
  'POST /auth/refresh': {
    request: RefreshTokenRequest;
    response: ApiResponse<RefreshTokenResponse>;
  };
  'POST /auth/forgot-password': {
    request: ForgotPasswordRequest;
    response: ApiResponse<{ message: string }>;
  };
  'POST /auth/reset-password': {
    request: ResetPasswordRequest;
    response: ApiResponse<{ message: string }>;
  };
  'POST /auth/oauth/callback': {
    request: OAuthCallbackRequest;
    response: ApiResponse<OAuthCallbackResponse>;
  };

  // User
  'GET /users/me': {
    request: never;
    response: ApiResponse<User>;
  };
  'PUT /users/me': {
    request: UpdateProfileRequest;
    response: ApiResponse<User>;
  };
  'DELETE /users/me': {
    request: { password: string };
    response: ApiResponse<{ message: string }>;
  };

  // Medications
  'GET /medications': {
    request: GetMedicationsParams;
    response: PaginatedResponse<Prescription>;
  };
  'GET /medications/:id': {
    request: { id: string };
    response: ApiResponse<Prescription>;
  };
  'POST /medications': {
    request: CreateMedicationRequest;
    response: ApiResponse<Prescription>;
  };
  'PUT /medications/:id': {
    request: UpdateMedicationRequest;
    response: ApiResponse<Prescription>;
  };
  'DELETE /medications/:id': {
    request: { id: string };
    response: ApiResponse<{ message: string }>;
  };
  'POST /medications/:id/taken': {
    request: MarkTakenRequest;
    response: ApiResponse<MarkTakenResponse>;
  };

  // Dependents
  'GET /dependents': {
    request: never;
    response: ApiResponse<Dependent[]>;
  };
  'POST /dependents': {
    request: AddDependentRequest;
    response: ApiResponse<Dependent>;
  };
  'PUT /dependents/:id': {
    request: UpdateDependentRequest;
    response: ApiResponse<Dependent>;
  };
  'DELETE /dependents/:id': {
    request: { id: string };
    response: ApiResponse<{ message: string }>;
  };

  // Patients
  'GET /patients': {
    request: never;
    response: ApiResponse<Patient[]>;
  };
  'POST /patients/invite': {
    request: InvitePatientRequest;
    response: ApiResponse<InvitePatientResponse>;
  };
  'POST /patients/:id/prescribe': {
    request: PrescribeMedicationRequest;
    response: ApiResponse<Prescription>;
  };

  // Analytics
  'GET /analytics/dashboard': {
    request: never;
    response: ApiResponse<DashboardStats>;
  };
  'GET /analytics/adherence': {
    request: GetAdherenceRequest;
    response: ApiResponse<AdherenceStats>;
  };
  'GET /analytics/adherence/weekly': {
    request: GetAdherenceRequest;
    response: ApiResponse<WeeklyAdherenceResponse>;
  };
  'GET /analytics/adherence/monthly': {
    request: GetAdherenceRequest;
    response: ApiResponse<MonthlyAdherenceResponse>;
  };
}

/**
 * Extract request type for endpoint
 */
export type EndpointRequest<E extends keyof ApiEndpoints> = ApiEndpoints[E]['request'];

/**
 * Extract response type for endpoint
 */
export type EndpointResponse<E extends keyof ApiEndpoints> = ApiEndpoints[E]['response'];
