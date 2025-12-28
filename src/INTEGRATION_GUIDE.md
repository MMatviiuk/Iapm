# Backend Integration Guide

This guide explains how to connect the Prescription Clarity frontend to the backend API.

## Prerequisites

- Backend API running at `http://localhost:3000` (or your deployed URL)
- Backend repository: https://github.com/icodebits/goit-capstone-project-g5

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# For local development
VITE_API_URL=http://localhost:3000/api

# For production
# VITE_API_URL=https://your-backend.com/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Integration Details

### Authentication

The app uses JWT (JSON Web Token) authentication:

1. **Registration/Login** → Backend returns JWT token
2. **Token Storage** → Saved in `localStorage` as `authToken`
3. **API Requests** → Token sent in `Authorization` header
4. **Token Validation** → Backend validates token on each request

### API Endpoints Used

#### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

#### Medications
- `GET /api/medications` - Get user's medications
- `POST /api/medications` - Create new medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication
- `POST /api/medications/:id/taken` - Mark as taken

#### Patients (Caregiver/Doctor)
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients/invite` - Invite patient by email

#### Dependents (Caregiver)
- `GET /api/dependents` - Get all dependents
- `POST /api/dependents` - Add new dependent

#### Analytics
- `GET /api/analytics/adherence` - Get adherence statistics
- `GET /api/analytics/dashboard` - Get dashboard stats

#### History
- `GET /api/history` - Get medication history

#### Notifications
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings` - Update settings

#### Profile
- `PUT /api/profile` - Update user profile
- `POST /api/upload/photo` - Upload medication photo

### Request/Response Format

All API requests and responses use JSON format.

**Request Example:**
```typescript
// Adding a medication
const response = await fetch('http://localhost:3000/api/medications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    name: 'Aspirin',
    dosage: '100mg',
    time: '08:00',
    // ... other fields
  })
});

const data = await response.json();
```

**Response Example:**
```json
{
  "id": 123,
  "name": "Aspirin",
  "dosage": "100mg",
  "time": "08:00",
  "userId": 456,
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

**Error Response Format:**
```json
{
  "message": "Invalid email or password"
}
```

## Testing the Integration

### 1. Test Registration Flow

```bash
# Open browser to http://localhost:5173
# Click "Get Started"
# Fill in registration form
# Check Network tab for API call to /api/auth/register
```

**Expected Network Request:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "dateOfBirth": "1950-01-15"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "dateOfBirth": "1950-01-15",
    "onboardingComplete": false
  }
}
```

### 2. Test Login Flow

```bash
# Navigate to login page
# Enter credentials
# Check Network tab for API call to /api/auth/login
```

### 3. Test Medication CRUD

**Add Medication:**
```bash
# After login, click "Add Medication"
# Fill form and submit
# Check Network tab for POST /api/medications
```

**View Medications:**
```bash
# Navigate to Dashboard
# Check Network tab for GET /api/medications
```

**Edit Medication:**
```bash
# Click edit on a medication
# Modify and save
# Check Network tab for PUT /api/medications/:id
```

**Delete Medication:**
```bash
# Click delete on a medication
# Confirm deletion
# Check Network tab for DELETE /api/medications/:id
```

### 4. Test Role-Specific Features

**Caregiver - Add Dependent:**
```bash
# Switch to caregiver role
# Click "Add Dependent"
# Fill form with name, DOB, relationship
# Check Network tab for POST /api/dependents
```

**Doctor - Add Patient:**
```bash
# Switch to doctor role
# Click "Add Patient"
# Fill form with name, email
# Check Network tab for POST /api/patients/invite
```

## Common Issues & Solutions

### Issue: "Failed to fetch" error

**Cause:** Backend not running or wrong URL

**Solution:**
```bash
# 1. Check backend is running
cd /path/to/backend
npm start

# 2. Verify backend URL in .env
cat .env
# Should show: VITE_API_URL=http://localhost:3000/api

# 3. Restart frontend dev server
npm run dev
```

### Issue: "Unauthorized" (401) error

**Cause:** Invalid or expired JWT token

**Solution:**
```bash
# Clear token and re-login
localStorage.removeItem('authToken');
# Refresh page and sign in again
```

### Issue: CORS errors

**Cause:** Backend not configured for CORS

**Solution:**
Backend should have CORS middleware:
```javascript
// In backend server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Network request to wrong URL

**Cause:** Missing or incorrect VITE_API_URL

**Solution:**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Restart dev server (Vite only reads .env on startup)
npm run dev
```

## Development Workflow

### 1. Start Backend
```bash
cd /path/to/backend
npm start
# Backend runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd /path/to/frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Test Feature
- Make changes in code
- Save file (Vite hot reloads)
- Test in browser
- Check Network tab for API calls
- Verify data in backend database

### 4. Debug API Calls

**Enable API Service Logging:**

Edit `/services/api.ts`:

```typescript
private async request(endpoint: string, options: RequestInit = {}) {
  console.log('API Request:', {
    endpoint,
    method: options.method || 'GET',
    body: options.body
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log('API Response:', {
    status: response.status,
    ok: response.ok
  });

  // ... rest of code
}
```

This will log all API calls to browser console.

## Production Deployment

### Frontend (Vercel/Netlify)

1. **Build app:**
```bash
npm run build
```

2. **Set environment variables:**
```bash
VITE_API_URL=https://your-backend-api.com/api
```

3. **Deploy `dist` folder**

### Backend (Render/Railway/Heroku)

1. Deploy backend from GitHub repo
2. Set environment variables (DB_URL, JWT_SECRET, etc.)
3. Note deployed URL
4. Update frontend VITE_API_URL to point to deployed backend

### Environment Variables

**Development:**
```bash
VITE_API_URL=http://localhost:3000/api
```

**Production:**
```bash
VITE_API_URL=https://api.prescriptionclarity.com/api
```

## API Service Architecture

The `/services/api.ts` file provides a clean abstraction layer:

```typescript
// Usage in components:
import api from '../services/api';

// Login
const data = await api.login(email, password);

// Get medications
const medications = await api.getMedications();

// Add medication
const newMed = await api.createMedication({
  name: 'Aspirin',
  dosage: '100mg',
  // ...
});
```

**Benefits:**
- Single source of truth for API calls
- Automatic token injection
- Centralized error handling
- Easy to mock for testing
- Type-safe with TypeScript

## Next Steps

1. **Test all endpoints** - Verify each API call works
2. **Handle edge cases** - Network errors, token expiry
3. **Add loading states** - Show spinners during API calls
4. **Implement retry logic** - Retry failed requests
5. **Add request caching** - Cache GET requests
6. **WebSocket integration** - Real-time updates
7. **Offline support** - Service worker for offline mode

## Backend Repository

For backend setup, database schema, and API documentation:

**GitHub:** https://github.com/icodebits/goit-capstone-project-g5

Refer to the backend README for:
- Database setup (PostgreSQL)
- Environment variables
- API endpoint documentation
- Email configuration
- Deployment instructions

## Support

For issues with:
- **Frontend** - Check this repository's issues
- **Backend** - Check backend repository issues
- **Integration** - Verify environment variables and network connectivity
