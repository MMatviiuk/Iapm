# Missing Screens and Features from Figma Design

## Analysis Date: November 4, 2025

Based on Figma design comparison, the following screens and features are MISSING or INCOMPLETE:

## ❌ Missing Core Screens

### 1. **Week View / Calendar View**
- Should show medications across full week
- Visual calendar layout
- Currently: Only "Today" view exists

### 2. **Medication Details Screen**
- Individual medication full details
- Photo gallery
- Edit/delete from details
- Take history for that specific medication
- Currently: Only edit form exists

### 3. **Notifications Management**
- List of all notifications
- Notification history
- Mark as read/unread
- Currently: Only notification settings in Settings

### 4. **Reminder Configuration**
- Advanced reminder setup
- Multiple reminders per medication
- Sound selection
- Snooze options
- Currently: Basic time selection only

### 5. **Family/Dependent Management (Caregiver)**
- Detailed dependent profiles
- Switch between dependents
- Individual dependent medication lists
- Currently: Only add dependent form

### 6. **Patient Details (Doctor)**
- Individual patient profile
- Patient medication history
- Patient adherence details
- Notes and observations
- Currently: Only patient list

### 7. **Analytics Details**
- Detailed adherence graphs
- Export reports
- Trends over time
- Comparison views
- Currently: Basic dashboard only

### 8. **Achievement Details**
- Individual achievement view
- Progress towards next achievement
- Achievement history
- Share achievements
- Currently: Basic rewards list only

### 9. **Medication Photo Gallery**
- Browse all medication photos
- Add/edit/delete photos
- Photo comparison
- Currently: DrugReference exists but limited

### 10. **Search & Filter**
- Search medications
- Filter by category
- Sort options
- Currently: No search functionality

## ⚠️ Incomplete Features

### In MainSchedule (Today):
- ❌ Swipe to mark as taken
- ❌ Snooze functionality
- ❌ Quick edit from schedule
- ❌ Visual progress indicator

### In History:
- ❌ Date range picker
- ❌ Export history
- ❌ Filter by medication
- ❌ Statistics summary

### In Dashboard:
- ❌ Interactive charts (click for details)
- ❌ Quick actions
- ❌ Upcoming reminders widget
- ❌ Recent activity feed

### In Add/Edit Medication:
- ❌ Barcode scanner
- ❌ Drug interaction warnings
- ❌ Dosage calculator
- ❌ Photo from camera

### In Settings:
- ❌ Backup/restore
- ❌ Export data
- ❌ Language selection (if multi-language)
- ❌ Accessibility options

## 🔧 Technical Issues to Fix

1. **Registration not working** - Mock API issues
2. **Social login placeholder** - Not functional (expected)
3. **Onboarding blocks app** - Fixed in latest commit
4. **No loading states** in some screens
5. **No error boundaries**

## 📱 Missing from Mobile Android Version

These were in Android but not in Web:

1. **Home Widget** (not applicable to web)
2. **System notifications** (web notifications API needed)
3. **Offline mode** (service worker needed)
4. **Biometric login** (WebAuthn needed)
5. **NFC medication tags** (not web compatible)

## Priority Order for Implementation

### HIGH PRIORITY:
1. ✅ Fix registration (DONE - Nov 4, 2025)
2. ✅ Week/Calendar View (DONE - Nov 4, 2025)
3. ✅ Medication Details Screen (DONE - Nov 4, 2025)
4. ✅ Search & Filter (DONE - Nov 4, 2025 - MedicationsList component)
5. Enhanced Today View (swipe, snooze) - TODO

### MEDIUM PRIORITY:
6. ✅ Notifications Management (DONE - Nov 4, 2025)
7. Analytics Details - TODO
8. ✅ Family/Dependent Management (DONE - Nov 4, 2025 - DependentDetails component)
9. ✅ Patient Details (Doctor) (DONE - Nov 4, 2025 - PatientDetails component)
10. Achievement Details - TODO

### LOW PRIORITY:
11. Advanced Reminders
12. Photo Gallery Enhancements
13. Export/Backup Features
14. Barcode Scanner
15. Offline Mode

## Next Steps

1. Implement Week View as priority #1
2. Add Medication Details screen
3. Implement search functionality
4. Enhance Today view with swipe actions
5. Add notification management screen
