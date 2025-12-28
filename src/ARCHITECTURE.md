# Prescription Clarity - System Architecture

## Overview

Prescription Clarity is a full-stack web SaaS platform with React frontend and Node.js backend.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────┐      ┌─────────────────────────────────┐   │
│  │  Landing Page  │      │     Authenticated App           │   │
│  │                │──────▶│                                 │   │
│  │  - Hero        │      │  ┌──────────────────────────┐   │   │
│  │  - Features    │      │  │   Desktop Layout         │   │   │
│  │  - Testimonial │      │  │  ┌─────────┬───────────┐ │   │   │
│  │  - CTA         │      │  │  │ Sidebar │  Content  │ │   │   │
│  └────────────────┘      │  │  │ (264px) │           │ │   │   │
│         │                │  │  │         │           │ │   │   │
│         │                │  │  │ - Nav   │  - Page   │ │   │   │
│         ▼                │  │  │ - Role  │  - Data   │ │   │   │
│  ┌────────────────┐      │  │  │ - User  │           │ │   │   │
│  │  Auth Pages    │      │  │  └─────────┴───────────┘ │   │   │
│  │                │      │  └──────────────────────────┘   │   │
│  │  - Login       │──────▶                                 │   │
│  │  - Sign Up     │      │  ┌──────────────────────────┐   │   │
│  │  - Onboarding  │      │  │   Mobile Layout          │   │   │
│  └────────────────┘      │  │  ┌────────────────────┐  │   │   │
│                           │  │  │     TopBar         │  │   │   │
│                           │  │  ├────────────────────┤  │   │   │
│                           │  │  │     Content        │  │   │   │
│                           │  │  ├────────────────────┤  │   │   │
│                           │  │  │  Bottom Nav        │  │   │   │
│                           │  │  └────────────────────┘  │   │   │
│                           │  └──────────────────────────┘   │   │
│                           └─────────────────────────────────┘   │
│                                          │                       │
│                                          │ API Calls             │
│                                          │ (JWT Token)           │
└──────────────────────────────────────────┼───────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              services/api.ts (API Client)                │   │
│  │                                                           │   │
│  │  Authentication:                                          │   │
│  │  - login(email, password)                                 │   │
│  │  - register(userData)                                     │   │
│  │  - getCurrentUser()                                       │   │
│  │                                                           │   │
│  │  Medications:                                             │   │
│  │  - getMedications()                                       │   │
│  │  - createMedication(data)                                 │   │
│  │  - updateMedication(id, data)                             │   │
│  │  - deleteMedication(id)                                   │   │
│  │                                                           │   │
│  │  Patients/Dependents:                                     │   │
│  │  - getPatients()                                          │   │
│  │  - getDependents()                                        │   │
│  │  - invitePatient(email)                                   │   │
│  │  - addDependent(data)                                     │   │
│  │                                                           │   │
│  │  Analytics:                                               │   │
│  │  - getAdherenceStats()                                    │   │
│  │  - getDashboardStats()                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              │ HTTP Requests                      │
│                              │ Authorization: Bearer <token>      │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVER                             │
│                (https://github.com/icodebits/                    │
│                  goit-capstone-project-g5)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │              Node.js + Express API                     │      │
│  │                                                         │      │
│  │  Routes:                                                │      │
│  │  ├─ POST   /api/auth/register                          │      │
│  │  ├─ POST   /api/auth/login                             │      │
│  │  ├─ GET    /api/auth/me                                │      │
│  │  │                                                      │      │
│  │  ├─ GET    /api/medications                            │      │
│  │  ├─ POST   /api/medications                            │      │
│  │  ├─ PUT    /api/medications/:id                        │      │
│  │  ├─ DELETE /api/medications/:id                        │      │
│  │  │                                                      │      │
│  │  ├─ GET    /api/patients                               │      │
│  │  ├─ POST   /api/patients/invite                        │      │
│  │  ├─ GET    /api/dependents                             │      │
│  │  ├─ POST   /api/dependents                             │      │
│  │  │                                                      │      │
│  │  ├─ GET    /api/analytics/adherence                    │      │
│  │  └─ GET    /api/analytics/dashboard                    │      │
│  │                                                         │      │
│  │  Middleware:                                            │      │
│  │  - CORS                                                 │      │
│  │  - JWT Verification                                     │      │
│  │  - Error Handling                                       │      │
│  └───────────────────────────────────────────────────────┘      │
│                              │                                    │
│                              ▼                                    │
│  ┌───────────────────────────────────────────────────────┐      │
│  │              PostgreSQL Database                       │      │
│  │                                                         │      │
│  │  Tables:                                                │      │
│  │  - users                                                │      │
│  │  - medications                                          │      │
│  │  - dependents                                           │      │
│  │  - relationships (caregiver-patient, doctor-patient)   │      │
│  │  - medication_history                                   │      │
│  │  - notifications                                        │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Component Hierarchy

```
App.tsx
│
├─ (Not Authenticated)
│   ├─ LandingPage
│   ├─ Login
│   ├─ SignUp
│   └─ Onboarding
│
└─ (Authenticated)
    ├─ AppLayout
    │   ├─ Sidebar (desktop)
    │   │   ├─ Logo & Branding
    │   │   ├─ RoleSwitcherModal
    │   │   ├─ Navigation Items
    │   │   ├─ Quick Action Button
    │   │   └─ User Profile & Logout
    │   │
    │   ├─ TopBar (mobile)
    │   │   ├─ Menu Button
    │   │   ├─ Page Title
    │   │   ├─ Notifications
    │   │   └─ Profile Avatar
    │   │
    │   └─ Content Area
    │       │
    │       ├─ Patient (Myself) Pages
    │       │   ├─ Dashboard
    │       │   ├─ MainSchedule (Today)
    │       │   ├─ AddPrescription
    │       │   ├─ EditPrescription
    │       │   ├─ History
    │       │   ├─ Rewards
    │       │   ├─ SettingsPage
    │       │   ├─ Profile
    │       │   ├─ DrugReference
    │       │   └─ PrintSchedule
    │       │
    │       ├─ Caregiver Pages
    │       │   ├─ CaregiverDashboard
    │       │   ├─ CaregiverAnalytics
    │       │   └─ SettingsPage
    │       │
    │       └─ Doctor Pages
    │           ├─ DoctorDashboard
    │           ├─ DoctorAnalytics
    │           └─ SettingsPage
    │
    └─ Toaster (notifications)
```

---

## Data Flow

### Authentication Flow

```
1. User visits site
   → Landing Page displays

2. Click "Get Started"
   → Navigate to Sign Up page

3. Fill registration form
   → Select role (Patient/Caregiver/Doctor)
   → Enter name, email, password, DOB

4. Submit form
   → api.register(userData)
   → POST /api/auth/register

5. Backend processes
   → Validate data
   → Hash password
   → Create user in database
   → Generate JWT token

6. Response received
   → Save token to localStorage
   → Set isAuthenticated = true
   → Set currentUser

7. Redirect to Onboarding
   → Role-specific onboarding flow

8. Complete onboarding
   → Redirect to role-specific dashboard

9. On page refresh
   → Check localStorage for token
   → If exists: api.getCurrentUser()
   → Auto-login user
```

### Medication CRUD Flow

#### Create Medication
```
User clicks "Add Medication"
   ↓
AddPrescription form displays
   ↓
User fills form
   ↓
Submit form
   ↓
addMedication(newMed)
   ↓
api.createMedication(newMed)
   ↓
POST /api/medications
Headers: { Authorization: Bearer <token> }
Body: { name, dosage, time, ... }
   ↓
Backend validates token
   ↓
Backend validates data
   ↓
Backend saves to database
   ↓
Backend returns created medication
   ↓
Frontend updates state
   ↓
UI re-renders with new medication
   ↓
Toast: "Medication added successfully"
```

#### Read Medications
```
User navigates to Dashboard/Today
   ↓
useEffect on mount
   ↓
fetchMedications()
   ↓
api.getMedications()
   ↓
GET /api/medications
Headers: { Authorization: Bearer <token> }
   ↓
Backend validates token
   ↓
Backend queries database for user's medications
   ↓
Backend returns array of medications
   ↓
Frontend sets medications state
   ↓
UI displays medication list
```

#### Update Medication
```
User clicks "Edit" on medication
   ↓
EditPrescription displays with current data
   ↓
User modifies fields
   ↓
Submit form
   ↓
updateMedication(id, updates)
   ↓
api.updateMedication(id, updates)
   ↓
PUT /api/medications/:id
Headers: { Authorization: Bearer <token> }
Body: { ...updates }
   ↓
Backend validates token
   ↓
Backend validates ownership
   ↓
Backend updates database
   ↓
Backend returns updated medication
   ↓
Frontend updates state
   ↓
UI re-renders
   ↓
Toast: "Medication updated successfully"
```

#### Delete Medication
```
User clicks "Delete" on medication
   ↓
Confirmation dialog
   ↓
User confirms
   ↓
deleteMedication(id)
   ↓
api.deleteMedication(id)
   ↓
DELETE /api/medications/:id
Headers: { Authorization: Bearer <token> }
   ↓
Backend validates token
   ↓
Backend validates ownership
   ↓
Backend deletes from database
   ↓
Backend returns success
   ↓
Frontend removes from state
   ↓
UI re-renders
   ↓
Toast: "Medication deleted successfully"
```

### Multi-User Collaboration Flow

#### Caregiver Invites Dependent
```
Caregiver clicks "Add Dependent"
   ↓
Form displays
   ↓
Enter name, DOB, relationship
   ↓
Submit
   ↓
api.addDependent({ name, dateOfBirth, relationship })
   ↓
POST /api/dependents
   ↓
Backend creates dependent
Backend links to caregiver
   ↓
Returns dependent data
   ↓
Caregiver can now manage dependent's medications
```

#### Doctor Invites Patient
```
Doctor clicks "Add Patient"
   ↓
Form displays
   ↓
Enter name, email
   ↓
Submit
   ↓
api.invitePatient(email, name)
   ↓
POST /api/patients/invite
   ↓
Backend creates invitation
Backend sends email to patient
   ↓
Patient receives email
Patient clicks link → registers/logs in
   ↓
Relationship created
   ↓
Doctor can now view patient's medications
Doctor can prescribe to patient
```

---

## State Management

### App-Level State (App.tsx)

```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentUser, setCurrentUser] = useState(null);
const [userRole, setUserRole] = useState('myself');
const [onboardingComplete, setOnboardingComplete] = useState(false);
const [medications, setMedications] = useState([]);
const [currentPage, setCurrentPage] = useState('landing');
const [darkMode, setDarkMode] = useState(false);
const [loading, setLoading] = useState(false);
```

### Local Storage

```javascript
// Authentication
localStorage.setItem('authToken', token);

// User Preferences
localStorage.setItem('darkMode', 'true');
localStorage.setItem('autoScroll', 'true');

// Fallback Data (if backend unavailable)
localStorage.setItem('medications', JSON.stringify(meds));
```

---

## API Request/Response Examples

### Registration

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "patient",
  "dateOfBirth": "1950-01-15"
}
```

**Response:**
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

### Get Medications

**Request:**
```http
GET /api/medications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Aspirin",
    "dosage": "100mg",
    "time": "08:00",
    "mealTiming": "after meal",
    "daysOfWeek": {
      "mon": true,
      "tue": true,
      "wed": true,
      "thu": true,
      "fri": true,
      "sat": true,
      "sun": true
    },
    "userId": 1,
    "createdAt": "2025-11-04T10:00:00Z"
  }
]
```

### Create Medication

**Request:**
```http
POST /api/medications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Vitamin C",
  "dosage": "500mg",
  "time": "08:00",
  "quantity": "1",
  "timesPerDay": "1",
  "mealTiming": "before meal",
  "daysOfWeek": {
    "mon": true,
    "tue": true,
    "wed": true,
    "thu": true,
    "fri": true,
    "sat": true,
    "sun": true
  },
  "durationNumber": "30",
  "unit": "Days"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Vitamin C",
  "dosage": "500mg",
  "time": "08:00",
  "userId": 1,
  "createdAt": "2025-11-04T11:00:00Z"
}
```

---

## Security

### Authentication
- JWT (JSON Web Tokens)
- Token stored in localStorage
- Token sent in Authorization header
- Token validated on every request

### Authorization
- User can only access their own data
- Caregiver can access dependent data
- Doctor can access patient data
- Role-based access control

### Data Protection
- Passwords hashed with bcrypt
- HTTPS in production
- CORS configuration
- SQL injection prevention
- XSS protection

---

## Deployment Architecture

### Development
```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
Database: localhost:5432 (PostgreSQL)
```

### Production
```
Frontend: Vercel/Netlify
Backend:  Render/Railway/Heroku
Database: Managed PostgreSQL (Render/Railway/Supabase)
```

---

## Technology Stack

### Frontend
- **Framework:** React 18.3
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Shadcn UI (Radix UI)
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Date Handling:** date-fns

### Backend (Separate Repo)
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Email:** Nodemailer
- **Validation:** Joi/Zod

### DevOps
- **Version Control:** Git/GitHub
- **CI/CD:** GitHub Actions
- **Frontend Hosting:** Vercel/Netlify
- **Backend Hosting:** Render/Railway
- **Database:** Managed PostgreSQL

---

## Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Optimistic UI updates
- Request deduplication
- Image lazy loading
- Efficient re-renders

### Backend
- Database connection pooling
- Query optimization
- Response caching
- Rate limiting
- Compression

---

## Monitoring & Analytics

### Frontend
- Error tracking (Sentry)
- User analytics (Google Analytics)
- Performance monitoring (Lighthouse)

### Backend
- API monitoring (Uptime monitoring)
- Error logging (Winston/Morgan)
- Database metrics (PostgreSQL stats)
- Request logging

---

## Future Enhancements

### Phase 1 (v2.1)
- Password reset flow
- Email verification
- Profile photo upload
- Enhanced error messages

### Phase 2 (v2.2)
- WebSocket real-time updates
- Service Worker (offline mode)
- Push notifications
- Export data (PDF/CSV)

### Phase 3 (v3.0)
- Mobile apps (React Native)
- Subscription plans
- Payment integration
- Advanced analytics
- Healthcare integrations

---

## Conclusion

Prescription Clarity is a modern, scalable web SaaS platform with:

✅ Clean architecture with separation of concerns  
✅ RESTful API design  
✅ JWT authentication & authorization  
✅ Responsive design (mobile + desktop)  
✅ Real-time data synchronization  
✅ Multi-user collaboration  
✅ Role-based access control  
✅ Comprehensive documentation  

**Ready for deployment and scaling to thousands of users!**
