# AddPrescription Form - Grouped Layout Reference

## Visual Structure

### Before (Linear Layout)
```
┌─────────────────────────────────────┐
│ Medication Name                     │
├─────────────────────────────────────┤
│ Quantity    │ Dosage (mg)           │
├─────────────────────────────────────┤
│ Meal Timing                         │
├─────────────────────────────────────┤
│ Times Per Day                       │
├─────────────────────────────────────┤
│ [Morning] [Afternoon] [Evening]     │
├─────────────────────────────────────┤
│ Morning Time                        │
├─────────────────────────────────────┤
│ Days of Week                        │
│ [M][T][W][T][F][S][S]               │
├─────────────────────────────────────┤
│ Duration    │ Unit                  │
├─────────────────────────────────────┤
│ □ Ongoing medication                │
├─────────────────────────────────────┤
│ Photo Upload                        │
├─────────────────────────────────────┤
│ [Cancel]    [Add Prescription]      │
└─────────────────────────────────────┘
```

### After (Grouped Sections)
```
┌─────────────────────────────────────┐
│ ┏━ 1 ━━ Medication Information ━━┓ │ ← BLUE THEME
│ ┃                                  ┃ │
│ ┃ Medication Name                  ┃ │
│ ┃ ┌───────────────────────────┐    ┃ │
│ ┃                                  ┃ │
│ ┃ Quantity    │ Dosage (mg)        ┃ │
│ ┃ ┌────────┐  │ ┌────────┐         ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ┏━ 2 ━━ Schedule & Timing ━━━━━━━┓ │ ← GREEN THEME
│ ┃                                  ┃ │
│ ┃ Meal Timing                      ┃ │
│ ┃ ┌───────────────────────────┐    ┃ │
│ ┃                                  ┃ │
│ ┃ Times Per Day                    ┃ │
│ ┃ ┌───────────────────────────┐    ┃ │
│ ┃                                  ┃ │
│ ┃ Time of Day (Select one)         ┃ │
│ ┃ ┌────────┐┌────────┐┌────────┐   ┃ │
│ ┃ │Morning ││Afternoon││Evening │   ┃ │
│ ┃ └────────┘└────────┘└────────┘   ┃ │
│ ┃                                  ┃ │
│ ┃ Morning Time                     ┃ │
│ ┃ [Time Picker Component]          ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ┏━ 3 ━━ Days & Duration ━━━━━━━━━┓ │ ← PURPLE THEME
│ ┃                                  ┃ │
│ ┃ Days of Week                     ┃ │
│ ┃ ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐            ┃ │
│ ┃ │M││T││W││T││F││S││S│            ┃ │
│ ┃ └─┘└─┘└─┘└─┘└─┘└─┘└─┘            ┃ │
│ ┃                                  ┃ │
│ ┃ Duration                         ┃ │
│ ┃ ┌────────┐  │ ┌────────┐         ┃ │
│ ┃ │  30    │  │ │ Days   │         ┃ │
│ ┃ └────────┘  │ └────────┘         ┃ │
│ ┃                                  ┃ │
│ ┃ ☑ Ongoing medication (no end)    ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ┏━ 4 ━━ Medication Photo ━━━━━━━━┓ │ ← ORANGE THEME
│ ┃              (Optional)          ┃ │
│ ┃                                  ┃ │
│ ┃ ┌──────────────────────────┐     ┃ │
│ ┃ │       📷                  │     ┃ │
│ ┃ │  Click to upload photo    │     ┃ │
│ ┃ │  PNG, JPG (MAX. 5MB)      │     ┃ │
│ ┃ └──────────────────────────┘     ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ┌─────────┐    ┌─────────────────┐ │
│ │ Cancel  │    │ Add Prescription│ │
│ └─────────┘    └─────────────────┘ │
└─────────────────────────────────────┘
```

## Section Details

### Section 1: Medication Information 💊
**Color Scheme**: Blue (#2196F3)  
**Purpose**: Basic medication identification  
**Fields**:
- Medication Name (text input, required)
- Quantity (number input, 1-10, required)
- Dosage in mg (number input, required)

**Visual Indicators**:
- Badge: Large "1" in rounded blue square (48-56px)
- Border: 2px solid blue-100 (light mode) / gray-700 (dark mode)
- Background: white (light) / gray-800/50 (dark)
- Title: Blue color, 24-32px font size

### Section 2: Schedule & Timing ⏰
**Color Scheme**: Green  
**Purpose**: When and how often to take medication  
**Fields**:
- Meal Timing (dropdown: Before/With/After/Anytime)
- Times Per Day (dropdown: Once/Twice/Three times daily)
- Time of Day (3 toggle buttons with FIFO logic for "Twice daily")
- Specific time pickers (dynamic, shown based on Time of Day selection)
- Helper prompt (shown when "Twice daily" needs second time)

**Visual Indicators**:
- Badge: Large "2" in rounded green square
- Border: 2px solid green-100 / gray-700
- Background: white / gray-800/50
- Title: Green color
- Helper Prompt: Orange background for visibility

**FIFO Logic**:
When "Twice daily" is selected and user clicks a third time slot:
1. First selected slot is automatically removed
2. Second selected slot becomes first
3. New selection becomes second

### Section 3: Days & Duration 📅
**Color Scheme**: Purple  
**Purpose**: Which days and how long to take medication  
**Fields**:
- Days of Week (7 toggle buttons: Mon-Sun)
- Duration Number (number input)
- Duration Unit (dropdown: Days/Weeks/Months)
- Lifetime checkbox (ongoing medication)

**Visual Indicators**:
- Badge: Large "3" in rounded purple square
- Border: 2px solid purple-100 / gray-700
- Background: white / gray-800/50
- Title: Purple color
- Day buttons: Blue when selected, gray when not

**Behavior**:
- All days selected by default
- Lifetime checkbox disables Duration inputs
- Duration defaults to 30 Days

### Section 4: Medication Photo 📸
**Color Scheme**: Orange  
**Purpose**: Optional visual reference  
**Fields**:
- Photo upload (drag-drop or click, max 5MB)
- Image preview with remove button

**Visual Indicators**:
- Badge: Large "4" in rounded orange square
- "(Optional)" label in gray
- Border: 2px solid orange-100 / gray-700
- Background: white / gray-800/50
- Title: Orange color
- Upload area: Dashed border with camera icon

**Behavior**:
- Shows camera icon and instructions when empty
- Shows preview with X button when image uploaded
- Accepts PNG, JPG formats
- Optional field (form submits without photo)

## Accessibility Features

### Touch Targets
- All buttons: **56-60px minimum height**
- Day buttons: **56-60px minimum** (responsive)
- Toggle buttons: **56-60px minimum**
- Submit/Cancel: **56-60px minimum**

### Font Sizes
- Section titles: **20-24px** (24-32px on desktop)
- Field labels: **18-20px** (20-24px on desktop)
- Input text: **18-20px**
- Helper text: **16-18px**
- Badge numbers: **18-20px**

### Color Contrast
- All text meets WCAG AA standards
- Borders: 2px minimum for visibility
- Selected states: High contrast blue (#2196F3)
- Disabled states: 50% opacity

### Dark Mode
- All sections adapt colors automatically
- Background: gray-800/50 (semi-transparent)
- Borders: gray-700 (visible in dark)
- Text: white for headings, gray-300 for labels

## Spacing System

### Section Spacing
- Gap between sections: **24-32px** (6-8 in Tailwind)
- Internal padding: **20-24px** (5-6 in Tailwind)
- Section border-radius: **16px** (2xl in Tailwind)

### Field Spacing
- Gap between fields: **16-20px** (4-5 in Tailwind)
- Label to input: **8px** (2 in Tailwind)
- Input border-radius: **8-12px** (lg to xl)

### Button Spacing
- Action buttons gap: **16-20px** (4-5 in Tailwind)
- Icon to text: **8px** (2 in Tailwind)

## Responsive Behavior

### Mobile (< 640px)
- Sections stack vertically
- 2-column grids for Quantity/Dosage
- Time of Day buttons in single row (3 columns)
- Days of Week in single row (7 columns, compact)
- Font sizes slightly reduced (18-20px base)

### Tablet (640px - 1024px)
- Sections stack vertically
- Comfortable spacing (20-24px)
- Font sizes at standard (18-20px base)

### Desktop (> 1024px)
- Sections stack vertically (form is not wide enough for side-by-side)
- Maximum width: **1024px** (4xl in Tailwind)
- Centered on page
- Font sizes at maximum (20-24px base)

## User Flow

```
User lands on form
      ↓
1. Fills Medication Info (Blue Section)
   - Name, Quantity, Dosage
      ↓
2. Sets Schedule (Green Section)
   - Meal timing, frequency, times
      ↓
3. Selects Days & Duration (Purple Section)
   - Which days, how long
      ↓
4. Optionally adds photo (Orange Section)
   - Upload medication image
      ↓
5. Reviews and submits
   - Validation checks
   - Toast confirmation
   - Redirect to Today view
```

## Validation Rules

### Section 1 (Required)
- ✓ Name: Required, min 2 characters
- ✓ Quantity: Required, 1-10
- ✓ Dosage: Required, positive number

### Section 2 (Required)
- ✓ Meal Timing: Required (default: "before meal")
- ✓ Times Per Day: Required (default: 1)
- ✓ Time of Day: Must match Times Per Day
  - Once daily → exactly 1 time selected
  - Twice daily → exactly 2 times selected
  - Three times daily → all 3 times selected
- ✓ Specific times: Required for each selected time slot

### Section 3 (Required)
- ✓ Days: At least 1 day selected
- ✓ Duration: Required if not lifetime
  - Number > 0
  - Unit selected

### Section 4 (Optional)
- Photo: Optional
- Format: PNG or JPG
- Max size: 5MB

## Success States

### After Successful Submit:
1. ✓ Toast notification: "Prescription added successfully!"
2. ✓ Description: "{MedicationName} has been added to your schedule"
3. ✓ Haptic feedback (vibration on mobile)
4. ✓ 500ms delay
5. ✓ Redirect to Today page (MainSchedule)
6. ✓ New medication appears in list
7. ✓ Auto-scroll to first untaken medication

## Error States

### Validation Errors:
- Toast notification (red): Error title + description
- Field highlighting (optional, not implemented yet)
- Error persists until corrected
- No form submission until all required fields valid

### Example Error Messages:
- "Please select exactly two times of day" (Twice daily validation)
- "Please select one time of day" (Once daily validation)
- "Medication name is required"
- "Please select at least one day of the week"

---

## Implementation Notes

### Components Used:
- `TimePicker` - Custom time selection component
- `toast` from 'sonner' - Toast notifications
- Icons from 'lucide-react' (ArrowLeft, Camera, X)

### State Management:
- `formData` - Main form state object
- `medicationImage` - Uploaded image base64 string
- `selectionOrder` - FIFO tracking for "Twice daily" time selection

### LocalStorage:
- `twiceDailyPreference` - Saves user's preferred times for "Twice daily" mode
- Automatically loaded on next medication add
- Persistent across sessions

### Accessibility:
- All buttons have `aria-label` attributes
- Form inputs have associated labels
- Touch-friendly (min 56px targets)
- Keyboard navigation supported
- Screen reader compatible

---

**Status**: ✅ Implemented  
**Date**: November 4, 2025  
**File**: `/components/AddPrescription.tsx`
