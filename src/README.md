# Prescription Clarity - Web SaaS Medication Management Platform

> **✅ DATABASE 404 FIXED (Nov 5, 2025):** Database 404 error resolved! Now uses dual-fallback loading. See `DATABASE_404_FIXED_NOV5_2025.md` for details.
> 
> **✅ BUILD ERROR FIXED (Nov 5, 2025):** Build errors resolved! Database now loads via fetch. See `BUILD_ERROR_FIXED_NOV5_2025.md` for details.
> 
> **🚨 APP NOT WORKING?** → Read `🚨_FIX_APP_NOW.md` or `🔥_ПРОЧИТАЙ_СПОЧАТКУ.md` (Ukrainian)
> 
> **⚡ QUICK START:** → Read `⚡_START_HERE_NOW.md` for 3-step setup

## Overview

A complete **web SaaS application** for medication tracking and management with three user roles: patients, caregivers, and healthcare professionals. Features a professional desktop-first interface with sidebar navigation, real-time backend synchronization, and multi-user collaboration. Designed with accessibility in mind, especially for elderly users.

## Tech Stack

### Frontend
- React 18.3 with TypeScript
- Vite for build tooling
- Tailwind CSS 4.0
- Motion (motion/react) for animations
- Shadcn UI components (built on Radix UI)
- Sonner for toast notifications
- Lucide React for icons
- Recharts for data visualization
- date-fns for date handling

### Backend Integration
- RESTful API with JWT authentication
- Real-time data synchronization
- Multi-user access control
- Invitation system for caregivers/doctors
- Backend repository: https://github.com/icodebits/goit-capstone-project-g5

## Design System

### Colors
- Primary accent: `#2196F3` (blue)
- Clean minimalist design with high contrast
- Dark mode support throughout

### Typography
- Base font size: **18px**
- Increased sizes for elderly accessibility
- High contrast text for readability
- English language only
- No emoji in UI

### Interactive Elements
- Minimum button size: **48-60px**
- Icon size: **32px**
- Touch targets: minimum **44px**
- Clear visual feedback on interactions

## 🚀 Quick Start (2 Steps)

### 1️⃣ Start Server
```bash
npm run dev
```

### 2️⃣ Open Browser & Login
```
URL: http://localhost:5173
Email: patient@demo.com
Password: demo123
```

**Note:** Database is now automatically copied and loaded - no manual setup needed! The app will copy `/data/complete-database.json` to `/public/data/` automatically before starting.

**📖 Need More Help?**
- 🚨 **App broken?** → `🚨_FIX_APP_NOW.md` or `🔥_ПРОЧИТАЙ_СПОЧАТКУ.md`
- ⚡ **Quick start:** → `⚡_START_HERE_NOW.md`
- 📚 **Full guide:** → `START_HERE.md`
- 🔧 **Diagnostic:** → `🔧_DIAGNOSTIC.md`
- ❓ **Which file?** → `📖_WHICH_FILE_TO_READ.md`

### Backend Setup

The backend repository is available at: https://github.com/icodebits/goit-capstone-project-g5

Follow the backend README for setup instructions.

### Development Tools

**Debug Panel:** Look for the "Debug" button (bottom left) for quick navigation and testing (development mode only).

### View on Mobile Device

When you run `npm run dev`, look for the Network address in the terminal:

```
Local:   http://localhost:5173/
Network: http://192.168.1.100:5173/  <- Use this on your phone
```

Make sure your phone is on the same WiFi network, then open the Network URL in your mobile browser.

## Key Features

### SaaS Platform Features
- **🏠 Landing Page** - Professional marketing page with features, testimonials, and CTA
- **🔐 Authentication** - Secure JWT-based login and registration
- **💻 Desktop-First Interface** - Professional sidebar navigation and layout
- **📊 Analytics Dashboard** - Comprehensive statistics and insights
- **👥 Multi-User Collaboration** - Real-time data sharing between users
- **📧 Invitation System** - Caregivers and doctors can invite patients
- **🔄 Real-Time Sync** - Data synchronized across devices and users
- **🎨 Role-Based Views** - Customized dashboards for each user role

### Core Functionality
- **Schedule tracking** with calendar view
- **Medication management** (add, edit, delete with API sync)
- **History and adherence tracking** with advanced analytics
- **Rewards system** with achievements and medals
- **Print-friendly schedules** with browser print functionality
- **Notification settings** for medication reminders
- **Medication Database** - View medication photos and information

### User Roles
- **Patient (Myself)** - Personal medication tracking
- **Caregiver** - Manage multiple dependents, monitor adherence, analytics
- **Medical Professional** - Patient management, prescribing, analytics

### Additional Features
- **Meal-timing tracking** (before/with/after meals)
- **Onboarding flows** for each user role
- **Fully responsive design** (320px to 2560px+)
- **Photo upload** for medications
- **Dark mode support**
- **Role switching** - Quick modal for switching between roles

## Design Principles for Elderly Users

### Accessibility Requirements
- Minimum button height: 48-60px
- Minimum text size: 18px base
- Icon size: 32px
- Touch targets: minimum 44px
- High contrast text
- Clear visual hierarchy
- English language only
- No emoji in UI

### Responsive Design
The application automatically scales for all screen sizes:
- 320px: iPhone SE (ultra-compact)
- 375px-479px: Small phones
- 480px-639px: Medium phones and tablets
- 640px+: Tablets and desktop
- 1024px+: Large desktop



## Project Structure

```
/components
  /figma
    ImageWithFallback.tsx - Image component with fallback
  /ui - Shadcn UI components (accordion, alert-dialog, alert, aspect-ratio,
        avatar, badge, breadcrumb, button, calendar, card, carousel, chart,
        checkbox, collapsible, command, context-menu, dialog, drawer,
        dropdown-menu, form, hover-card, input-otp, input, label, menubar,
        navigation-menu, pagination, popover, progress, radio-group,
        resizable, scroll-area, select, separator, sheet, sidebar, skeleton,
        slider, sonner, switch, table, tabs, textarea, toggle-group, toggle,
        tooltip, use-mobile.ts, utils.ts)
  
  AddPrescription.tsx - Add new medication form
  CaregiverDashboard.tsx - Caregiver role dashboard
  DoctorDashboard.tsx - Medical professional dashboard
  EditPrescription.tsx - Edit existing medication
  History.tsx - Medication history and adherence tracking
  LoadingMedication.tsx - Loading skeleton for medication cards
  Login.tsx - User authentication
  MainSchedule.tsx - Main calendar and medication schedule
  Onboarding.tsx - Main onboarding flow (for patient role)
  OnboardingCaregiver.tsx - Caregiver role onboarding
  OnboardingDoctor.tsx - Doctor role onboarding
  PrescriptionForm.tsx - Reusable prescription form component
  PrintSchedule.tsx - Printable medication schedule
  Privacy.tsx - Privacy policy page
  Profile.tsx - User profile management
  Rewards.tsx - Achievement and rewards system
  RoleSwitcher.tsx - Switch between user roles
  SettingsPage.tsx - Application settings
  SignUp.tsx - User registration
  Terms.tsx - Terms of service page
  TimePicker.tsx - Time selection component

/hooks
  usePrescriptionManager.ts - Shared prescription management logic

/styles
  globals.css - Global styles and CSS variables

App.tsx - Main application component and routing logic
index.html - HTML entry point
main.tsx - React application entry point
package.json - Dependencies and scripts
```

## CSS Architecture

The application uses a custom CSS variable system for responsive design.

### Base Variables
All spacing, sizing, and typography automatically scales based on viewport width. The system is defined in `globals.css` with breakpoints at 320px, 375px, 480px, 640px, and 1024px.

### Important Classes
- Standard Tailwind classes work throughout
- `text-xs` through `text-2xl` for accessible typography
- `sm:` prefixes for responsive variants
- Dark mode variants with `dark:` prefix

## Component Guidelines

### Forms
All forms (Login, SignUp, AddPrescription) use:
- Proper label associations
- Clear error messaging
- Large touch targets
- Proper input types for mobile keyboards

### Navigation
Bottom navigation bar with:
- Large icons (32px)
- Clear labels
- Active state indicators
- Responsive spacing

### Cards
Medication cards include:
- Photo/icon of medication
- Time and dosage information
- Edit and delete actions
- Expandable details

## Development Notes

### Adding New Components
When creating new components:
1. Use semantic HTML
2. Ensure proper ARIA labels
3. Test on small screens (320px minimum)
4. Verify touch target sizes (44px minimum)
5. Check text contrast ratios
6. Test with keyboard navigation

### Styling Approach
- Use Tailwind utility classes
- Use existing UI components from `/components/ui`
- Follow established spacing patterns
- Maintain consistent border radius
- Use the blue accent color (#2196F3) for primary actions

### Responsive Testing
Test on these critical breakpoints:
- 320px (iPhone SE)
- 390px (iPhone 12-15)
- 768px (iPad)
- 1440px (Desktop)

## Running the Project

### Full Stack (Frontend + Backend)

**1. Start Backend:**
```bash
# Clone backend repository
git clone https://github.com/icodebits/goit-capstone-project-g5
cd goit-capstone-project-g5

# Install dependencies
npm install

# Setup database (see backend README)
# Create .env with database credentials

# Start backend server
npm start
# Backend runs on http://localhost:3000
```

**2. Start Frontend:**
```bash
# In a new terminal, navigate to frontend
cd /path/to/prescription-clarity-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env to point to backend
# VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

**3. Open Application:**
```bash
# Open browser to http://localhost:5173
# You should see the landing page
# Click "Get Started" to register
```

### Frontend Only (Demo Mode)

If you want to run frontend without backend (uses localStorage):

```bash
npm install
npm run dev
```

Note: Without backend, multi-user features, invitations, and cloud sync won't work.

## Testing

Key areas to test:
- Form submission on all screen sizes
- Navigation between screens
- Add/edit/delete medications
- Calendar date selection
- Settings changes
- Dark mode toggle
- Responsive layout at all breakpoints

## Accessibility Checklist

- All images have alt text
- Forms have proper labels
- Color contrast meets WCAG AA
- Touch targets are 44px minimum
- Text is readable at 18px minimum
- Keyboard navigation works
- Screen reader compatible
- No horizontal scroll on mobile

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

## Author

https://github.com/MMatviiuk

## License

Copyright 2025. All rights reserved.
