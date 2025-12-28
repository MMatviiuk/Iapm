# Developer Quickstart - Prescription Clarity Web SaaS

## Project Status: ✅ Production-Ready

All Android app features have been successfully ported to the web platform with enhanced UX for desktop and mobile.

## What's New (November 4, 2025)

### Recent Major Updates
1. ✅ **Burger Menu Integration** - Mobile navigation fully functional
2. ✅ **Gender & DOB Support** - Personalized avatar generation
3. ✅ **Enhanced Role Switching** - Prominent, accessible from sidebar/burger menu
4. ✅ **Unique Avatar System** - Consistent avatars using name+email hash
5. ✅ **Full Responsive Design** - 320px to 2560px+ screens supported

## Quick Setup

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone repository
git clone <repo-url>
cd prescription-clarity-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create `.env` file:
```bash
VITE_API_URL=http://localhost:3000/api  # Backend API endpoint
```

## Project Structure

```
/
├── components/
│   ├── Layout/
│   │   ├── AppLayout.tsx          ⭐ Main app wrapper
│   │   ├── Sidebar.tsx            ⭐ Desktop navigation
│   │   ├── TopBar.tsx             ⭐ Mobile top bar
│   │   └── BurgerMenu.tsx         🆕 Mobile slide-in menu
│   ├── Dashboard.tsx              # Patient dashboard
│   ├── MainSchedule.tsx           # Today's medications
│   ├── AddPrescription.tsx        # Add medication form
│   ├── EditPrescription.tsx       # Edit medication form
│   ├── MedicationsList.tsx        🆕 All medications list
│   ├── MedicationDetails.tsx      🆕 Individual medication view
│   ├── WeekView.tsx               🆕 Weekly calendar
│   ├── NotificationsManager.tsx   🆕 Notification settings
│   ├── CaregiverDashboard.tsx     # Caregiver home
│   ├── DependentDetails.tsx       🆕 Dependent info page
│   ├── DoctorDashboard.tsx        # Doctor home
│   ├── PatientDetails.tsx         🆕 Patient info page
│   ├── SignUp.tsx                 ⭐ Registration (now with gender/DOB)
│   ├── Login.tsx                  # Authentication
│   ├── RoleSwitcherModal.tsx      ⭐ Role switching UI
│   └── ...
├── services/
│   └── api.ts                     # Backend API client
├── utils/
│   ├── avatarUtils.ts             🆕 Avatar generation utilities
│   ├── dateUtils.ts               # Date/age calculations
│   └── soundEffects.ts            # Achievement sounds
├── App.tsx                        ⭐ Main app logic
└── Guidelines.md                  # Project guidelines

🆕 = Newly created
⭐ = Recently modified
```

## Key Components

### AppLayout (Main Wrapper)
```tsx
<AppLayout
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  userRole={userRole}
  darkMode={darkMode}
  onRoleChange={handleRoleSwitch}
  onLogout={handleLogout}
  userName={currentUser?.name}      // 🆕 For burger menu
  userEmail={currentUser?.email}    // 🆕 For unique avatars
>
  {renderPage()}
</AppLayout>
```

**What it does**:
- Shows Sidebar on desktop (lg+)
- Shows TopBar + BurgerMenu on mobile (<lg)
- Manages responsive layout
- Handles role-specific styling

### BurgerMenu (Mobile Navigation)
```tsx
<BurgerMenu
  isOpen={isBurgerMenuOpen}
  onToggle={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  userRole={userRole}
  darkMode={darkMode}
  onRoleChange={onRoleChange}
  onLogout={onLogout}
  userName={userName}
  userEmail={userEmail}
/>
```

**Features**:
- Slides in from left
- Shows user avatar with unique seed
- Displays all role-specific navigation
- Includes role switcher button
- Auto-closes on navigation

### Avatar System
```tsx
import { generateAvatarSeed, getRoleAvatarClasses } from '@/utils/avatarUtils';

// Generate unique avatar URL
const seed = generateAvatarSeed(userName, userEmail);
const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

// Get role-specific classes
const roleClasses = getRoleAvatarClasses(userRole);
// Returns: 'ring-2 ring-blue-500' for patient
```

**Avatar Utils Functions**:
- `getAvatarUrl({ name, gender, dateOfBirth })` - Gender/age-aware avatar
- `generateAvatarSeed(name, email)` - Unique consistent seed
- `getRoleAvatarClasses(role)` - Role-specific styling
- `calculateAge(dateOfBirth)` - Age from DOB
- `formatAge(dateOfBirth)` - Display as "75 yrs"

### Role Switching
```tsx
<RoleSwitcherModal
  currentRole={userRole}
  onRoleChange={handleRoleChange}
  darkMode={darkMode}
/>
```

**Locations**:
- Sidebar (desktop): "Active Role" section
- BurgerMenu (mobile): Button in header

**Behavior**:
- Shows modal with 3 large cards
- Each card: Icon, Title, Subtitle, Check
- Click card to switch
- Auto-navigates to new dashboard
- Shows success toast

## Page Routing

### Patient Pages
```tsx
switch (currentPage) {
  case 'dashboard':         return <Dashboard />;
  case 'main':             return <MainSchedule />;
  case 'week-view':        return <WeekView />;
  case 'history':          return <History />;
  case 'medications-list': return <MedicationsList />;
  case 'medication-details': return <MedicationDetails />;
  case 'notifications':    return <NotificationsManager />;
  case 'rewards':          return <Rewards />;
  case 'add':              return <AddPrescription />;
  case 'edit':             return <EditPrescription />;
  case 'settings':         return <SettingsPage />;
  // ... more pages
}
```

### Caregiver Pages
```tsx
case 'caregiver':          return <CaregiverDashboard />;
case 'caregiver-analytics': return <CaregiverAnalytics />;
case 'dependent-details':  return <DependentDetails />;
case 'settings':           return <SettingsPage />;
```

### Doctor Pages
```tsx
case 'doctor':            return <DoctorDashboard />;
case 'doctor-analytics':  return <DoctorAnalytics />;
case 'patient-details':   return <PatientDetails />;
case 'drug-reference':    return <DrugReference />;
case 'settings':          return <SettingsPage />;
```

## State Management

### App.tsx State
```tsx
const [currentUser, setCurrentUser] = useState(null);
const [currentPage, setCurrentPage] = useState('landing');
const [userRole, setUserRole] = useState('myself');
const [medications, setMedications] = useState([]);
const [darkMode, setDarkMode] = useState(false);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

### User Data Flow
```
App.tsx (currentUser) 
  → AppLayout (userName, userEmail)
    → BurgerMenu (displays avatar)
    → Sidebar (displays profile)
```

## API Integration

### Authentication
```tsx
// Register
await api.register({
  name: 'John Smith',
  email: 'john@example.com',
  password: 'secure123',
  role: 'patient',
  gender: 'male',        // 🆕 New field
  dateOfBirth: '1950-03-15'  // 🆕 New field
});

// Login
await api.login(email, password);

// Get current user
const user = await api.getCurrentUser();
// Returns: { name, email, role, gender, dateOfBirth, ... }
```

### Medications
```tsx
// Get all medications
const meds = await api.getMedications();

// Create
await api.createMedication(medicationData);

// Update
await api.updateMedication(id, updatedData);

// Delete
await api.deleteMedication(id);
```

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 640px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }
```

### Tailwind Classes
```tsx
// Sidebar: hidden on mobile, visible on desktop
<div className="hidden lg:block">
  <Sidebar />
</div>

// TopBar: visible on mobile, hidden on desktop
<div className="lg:hidden">
  <TopBar />
</div>

// Responsive sizing
<button className="min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px]">
  Click me
</button>
```

### Touch Targets (Elderly-Friendly)
```tsx
// Minimum sizes
Mobile: 48px × 48px
Desktop: 56px × 56px

// Implementation
className="min-h-[48px] sm:min-h-[56px] touch-manipulation"
```

## Styling Guidelines

### Role Colors
```tsx
const roleColors = {
  myself: 'blue',    // #2196F3
  caregiver: 'orange',  // #F97316
  doctor: 'purple'   // #9333EA
};

// Background
bg-blue-50 dark:bg-blue-900/20

// Text
text-blue-600 dark:text-blue-400

// Border
border-blue-500
```

### Typography
```tsx
// Base sizes (from globals.css)
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
p: 1.125rem (18px)  // 🎯 Elderly-friendly

// Never override these unless user requests
❌ text-2xl, text-xl, font-bold
✅ Let globals.css handle it
```

### Dark Mode
```tsx
// Always provide dark mode variant
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

## Testing

### Manual Testing
```bash
# 1. Start dev server
npm run dev

# 2. Test registration
- Go to /signup
- Fill form with gender/DOB
- Check avatar generated correctly

# 3. Test role switching
- Desktop: Click icon in sidebar
- Mobile: Open burger menu → Switch Role
- Verify navigation changes

# 4. Test responsive
- Resize browser: 320px → 2560px
- Check sidebar appears at 1024px
- Verify touch targets 48px+ on mobile
```

### Responsive Testing
```bash
# Chrome DevTools
1. F12 → Toggle device toolbar
2. Test these sizes:
   - iPhone SE (320px)
   - iPhone 12 (390px)
   - iPad (768px)
   - iPad Pro (1024px)
   - Desktop (1440px, 1920px)
```

## Common Tasks

### Adding a New Page
```tsx
// 1. Create component
// /components/NewPage.tsx
export default function NewPage({ darkMode, setCurrentPage }) {
  return <div>New Page</div>;
}

// 2. Import in App.tsx
import NewPage from './components/NewPage';

// 3. Add to renderPage()
case 'new-page':
  return <NewPage darkMode={darkMode} setCurrentPage={setCurrentPage} />;

// 4. Add to navigation (Sidebar.tsx or BurgerMenu.tsx)
{ id: 'new', label: 'New Page', icon: FileText, page: 'new-page' }
```

### Adding a Form Field
```tsx
// 1. Add to state
const [newField, setNewField] = useState('');

// 2. Add input
<Input
  value={newField}
  onChange={(e) => setNewField(e.target.value)}
  className="h-14 sm:h-16 text-lg sm:text-xl"  // Elderly-friendly
/>

// 3. Include in submission
await api.create({ ...data, newField });
```

### Customizing Avatar
```tsx
// With gender
const avatarUrl = getAvatarUrl({ 
  name: 'John', 
  gender: 'male',
  dateOfBirth: '1950-03-15'
});

// Custom seed (advanced)
const seed = `${name}-${customIdentifier}`;
const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&facialHairProbability=40`;
```

## Debugging

### Debug Panel (Development Mode)
```tsx
// Auto-enabled in dev mode
// Shows: User, Role, Page, Medications count
// Quick nav buttons for testing
```

### Common Issues

**Issue**: BurgerMenu not opening
```tsx
// Check: TopBar has onMenuToggle prop
<TopBar onMenuToggle={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)} />
```

**Issue**: Avatar not unique
```tsx
// Use generateAvatarSeed, not just name
❌ seed={userName}
✅ seed={generateAvatarSeed(userName, userEmail)}
```

**Issue**: Role switcher not visible
```tsx
// Desktop: Check sidebar "Active Role" section
// Mobile: Check burger menu header
```

## Performance Tips

1. **Lazy Load Images**
```tsx
<img loading="lazy" src={avatarUrl} alt={name} />
```

2. **Optimize Re-renders**
```tsx
// Use memo for expensive components
const MemoizedComponent = React.memo(Component);
```

3. **Debounce Search**
```tsx
import { useDebounce } from 'use-debounce';
const [debouncedValue] = useDebounce(searchTerm, 300);
```

## Deployment

### Build for Production
```bash
npm run build
# Output: /dist folder
```

### Environment Variables (Production)
```bash
VITE_API_URL=https://api.yoursite.com/api
```

### Deployment Checklist
- [ ] Update API URL in .env
- [ ] Test all role switching flows
- [ ] Verify avatar generation works
- [ ] Check responsive design (all breakpoints)
- [ ] Test dark mode
- [ ] Verify burger menu on mobile
- [ ] Test navigation on all roles
- [ ] Check form validation
- [ ] Test backend integration

## Resources

### Documentation
- `Guidelines.md` - Project guidelines
- `FULL_WEB_INTEGRATION_COMPLETE.md` - Recent changes
- `ROLE_SWITCHING_GUIDE.md` - User guide for roles

### Key Files to Know
- `/App.tsx` - Main app logic, routing
- `/components/Layout/AppLayout.tsx` - Layout wrapper
- `/utils/avatarUtils.ts` - Avatar utilities
- `/services/api.ts` - Backend API calls
- `/styles/globals.css` - Global styles

### External Dependencies
- **Motion** (`motion/react`) - Animations
- **Shadcn UI** - Component library
- **Tailwind CSS 4.0** - Styling
- **Lucide React** - Icons
- **DiceBear** - Avatar generation API

## Support

### Getting Help
1. Check `Guidelines.md` for project rules
2. Review existing components for examples
3. Test in development mode with debug panel
4. Check browser console for errors

### Contributing
- Follow existing code style
- Test on mobile and desktop
- Ensure elderly-friendly UI (large buttons, clear text)
- Add dark mode support
- Update documentation

---

**Happy Coding!** 🚀

**Last Updated**: November 4, 2025  
**Version**: 2.0.0 - Full Web SaaS Integration
