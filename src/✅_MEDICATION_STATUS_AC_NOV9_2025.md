# ✅ MEDICATION STATUS - ACCEPTANCE CRITERIA (AC)

**Date:** 9 November 2025  
**Status:** 🟢 DESIGNED & DOCUMENTED  
**Priority:** P0 CRITICAL - Medical-Grade Data Integrity  

---

## 🎯 Problem Statement

**Issue Reported by Vladyslav:**
> "Коли я створив медикамент із startDate та endDate заднім числом, то у нього статус в БД = ACTIVE. Якщо дата вже у минулому то і має вже не бути ACTIVE."

**Current State:**
- Only 2 statuses: `ACTIVE`, `DELETED`
- No automatic status calculation based on dates
- Medications with past endDate show as ACTIVE ❌

**Required State:**
- 4 lifecycle statuses: `SCHEDULED`, `ACTIVE`, `COMPLETED`, `DELETED`
- Automatic status calculation based on startDate/endDate
- Medical-grade accuracy for elderly users ✅

---

## 📊 Medication Lifecycle Statuses

### 1. SCHEDULED (Заплановано)

**AC-1.1: Визначення**
```typescript
GIVEN: Medication has startDate
AND: startDate > today
THEN: status = 'SCHEDULED'
```

**AC-1.2: UI Відображення**
- Badge: 🔵 Blue (`bg-blue-100`, `text-blue-800`)
- Label: "Scheduled"
- Icon: `CalendarClock`
- Description: "This medication is scheduled to start in the future"

**AC-1.3: User Actions**
- ✅ CAN: View details
- ✅ CAN: Edit medication
- ✅ CAN: Delete medication
- ❌ CANNOT: Mark as taken (not started yet)

**AC-1.4: Visibility**
- ✅ Show in: All Medications list
- ❌ Hide from: Today's schedule
- ❌ Hide from: History

**Example:**
```typescript
{
  name: "Vitamin D",
  startDate: "2025-11-15", // Майбутнє
  endDate: "2025-12-15",
  status: "SCHEDULED" // ← Автоматично розраховано
}
```

---

### 2. ACTIVE (Активний)

**AC-2.1: Визначення**
```typescript
GIVEN: (startDate is NULL OR startDate <= today)
AND: (endDate is NULL OR endDate >= today)
THEN: status = 'ACTIVE'
```

**AC-2.2: UI Відображення**
- Badge: 🟢 Green (`bg-green-100`, `text-green-800`)
- Label: "Active"
- Icon: `CheckCircle`
- Description: "This medication is currently active"

**AC-2.3: User Actions**
- ✅ CAN: View details
- ✅ CAN: Edit medication
- ✅ CAN: Delete medication
- ✅ CAN: Mark as taken
- ✅ CAN: Print schedule

**AC-2.4: Visibility**
- ✅ Show in: All Medications list
- ✅ Show in: Today's schedule
- ✅ Show in: History
- ✅ Show in: Week View

**Examples:**

**Case 1: Lifetime medication (no dates)**
```typescript
{
  name: "Blood Pressure Pills",
  startDate: null, // Немає дат
  endDate: null,
  status: "ACTIVE" // ← Активний назавжди
}
```

**Case 2: Ongoing course (within date range)**
```typescript
{
  name: "Antibiotics",
  startDate: "2025-11-01",
  endDate: "2025-11-20",
  today: "2025-11-09", // ← Сьогодні між датами
  status: "ACTIVE" // ← Активний курс
}
```

**Case 3: Started, no end date**
```typescript
{
  name: "Vitamins",
  startDate: "2025-11-01",
  endDate: null,
  status: "ACTIVE" // ← Почався і триває
}
```

---

### 3. COMPLETED (Завершено)

**AC-3.1: Визначення**
```typescript
GIVEN: Medication has endDate
AND: endDate < today
THEN: status = 'COMPLETED'
```

**AC-3.2: UI Відображення**
- Badge: ⚪ Gray (`bg-gray-100`, `text-gray-800`)
- Label: "Completed"
- Icon: `CheckCheck`
- Description: "This medication course has been completed"

**AC-3.3: User Actions**
- ✅ CAN: View details
- ✅ CAN: View history
- ✅ CAN: Delete medication
- ❌ CANNOT: Mark as taken (course finished)
- ❌ CANNOT: Edit (archived, read-only)

**AC-3.4: Visibility**
- ✅ Show in: All Medications list (with "Completed" filter)
- ✅ Show in: History (past records)
- ❌ Hide from: Today's schedule
- ❌ Hide from: Week View

**AC-3.5: Special Behavior**
- If user tries to mark as taken → Show error toast:
  ```
  "Cannot mark completed medication as taken"
  "This medication course ended on [date]"
  ```

**Example:**
```typescript
{
  name: "Antibiotics Course",
  startDate: "2025-10-01",
  endDate: "2025-10-14", // ← Минуле
  today: "2025-11-09",
  status: "COMPLETED" // ← Курс завершено
}
```

---

### 4. DELETED (Видалено)

**AC-4.1: Визначення**
```typescript
GIVEN: Medication.deletedAt is NOT NULL
OR: User clicked "Delete" button
THEN: status = 'DELETED'
```

**AC-4.2: Soft Delete (М'яке видалення)**
```typescript
DELETE /medications/:id
→ SET deletedAt = NOW()
→ SET status = 'DELETED'
→ Keep record in database ✅
→ NOT physically deleted ❌
```

**AC-4.3: UI Відображення**
- Badge: 🔴 Red (`bg-red-100`, `text-red-800`)
- Label: "Deleted"
- Icon: `Trash2`
- Description: "This medication has been deleted"

**AC-4.4: User Actions**
- ❌ CANNOT: View in normal lists
- ❌ CANNOT: Mark as taken
- ❌ CANNOT: Edit
- ✅ CAN: View in "Recycle Bin" (future feature)
- ✅ CAN: Restore (future feature)
- ✅ CAN: Delete permanently (future feature)

**AC-4.5: Visibility**
- ❌ Hide from: All Medications list
- ❌ Hide from: Today's schedule
- ❌ Hide from: History
- ✅ Show in: Recycle Bin (future feature)

**AC-4.6: Recycle Bin (Future Feature)**
```typescript
// GET deleted medications
GET /medications?status=DELETED

// Restore medication
POST /medications/:id/restore
→ SET deletedAt = NULL
→ Recalculate status (SCHEDULED/ACTIVE/COMPLETED)

// Delete permanently
DELETE /medications/:id/permanently
→ Remove from database forever
```

---

## 🔄 Status Transition Rules

### Automatic Transitions (System)

```
1. SCHEDULED → ACTIVE
   When: startDate arrives (today >= startDate)
   
2. ACTIVE → COMPLETED
   When: endDate passes (today > endDate)

3. ANY → DELETED
   When: User clicks Delete button
```

### Manual Transitions (User)

```
4. DELETED → (SCHEDULED/ACTIVE/COMPLETED)
   When: User clicks Restore in Recycle Bin
   Then: System recalculates status based on dates

5. DELETED → PERMANENTLY_DELETED
   When: User confirms permanent deletion
   Then: Remove from database
```

---

## 📅 Date Logic Examples

### Example 1: Створення medication "заднім числом"

**Input:**
```typescript
{
  name: "Old Medication",
  startDate: "2025-10-01", // ← Минуле
  endDate: "2025-10-15",   // ← Минуле
  createdAt: "2025-11-09"  // Сьогодні
}
```

**Expected Result:**
```typescript
{
  ...medication,
  status: "COMPLETED" // ← Автоматично розраховано
}
```

**Behavior:**
- ❌ NOT shown in Today's schedule
- ❌ NOT shown in Week View
- ✅ Shown in History (read-only)
- ✅ Shown in All Medications (with "Completed" badge)

---

### Example 2: Lifetime medication (без дат)

**Input:**
```typescript
{
  name: "Blood Pressure Pills",
  startDate: null, // ← Немає дати початку
  endDate: null    // ← Немає дати кінця
}
```

**Expected Result:**
```typescript
{
  ...medication,
  status: "ACTIVE" // ← Завжди активний
}
```

**Behavior:**
- ✅ Always shown in Today's schedule
- ✅ Can mark as taken every day
- ✅ No automatic completion

---

### Example 3: Medication починається завтра

**Input:**
```typescript
{
  name: "New Medication",
  startDate: "2025-11-10", // ← Завтра
  endDate: "2025-11-20",
  today: "2025-11-09"
}
```

**Expected Result:**
```typescript
{
  ...medication,
  status: "SCHEDULED" // ← Запланований
}
```

**Behavior (Today: 2025-11-09):**
- ❌ NOT shown in Today's schedule
- ✅ Shown in All Medications with "Scheduled" badge
- ❌ Cannot mark as taken

**Behavior (Tomorrow: 2025-11-10):**
- ✅ Status automatically changes to "ACTIVE"
- ✅ Shown in Today's schedule
- ✅ Can mark as taken

---

## 🧪 Testing Scenarios

### Scenario 1: Create medication with past dates
```
GIVEN: User creates medication
AND: startDate = "2025-10-01"
AND: endDate = "2025-10-14"
AND: today = "2025-11-09"

THEN:
- Status should be "COMPLETED" ✅
- NOT shown in Today's schedule ✅
- Shown in History as read-only ✅
- Cannot mark as taken ✅
```

### Scenario 2: Create medication with future startDate
```
GIVEN: User creates medication
AND: startDate = "2025-11-15"
AND: endDate = "2025-11-30"
AND: today = "2025-11-09"

THEN:
- Status should be "SCHEDULED" ✅
- NOT shown in Today's schedule ✅
- Shown in All Medications with blue badge ✅
- Cannot mark as taken ✅
```

### Scenario 3: Active medication course
```
GIVEN: User creates medication
AND: startDate = "2025-11-01"
AND: endDate = "2025-11-20"
AND: today = "2025-11-09"

THEN:
- Status should be "ACTIVE" ✅
- Shown in Today's schedule ✅
- Can mark as taken ✅
- Shown in Week View ✅
```

### Scenario 4: Lifetime medication
```
GIVEN: User creates medication
AND: startDate = null
AND: endDate = null

THEN:
- Status should be "ACTIVE" ✅
- Always shown in Today's schedule ✅
- Can mark as taken indefinitely ✅
```

### Scenario 5: Delete medication
```
GIVEN: User clicks Delete on medication
WHEN: Confirm deletion

THEN:
- deletedAt should be set to NOW() ✅
- Status should be "DELETED" ✅
- NOT shown in any lists ✅
- Can be restored from Recycle Bin (future) ✅
```

---

## 🎨 UI/UX Requirements

### 1. Status Badge Component

```tsx
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeColor, getStatusLabel } from '@/utils/medicationStatusManager';

<Badge className={`${colors.bg} ${colors.text} ${colors.border} border-2`}>
  <Icon className="w-4 h-4 mr-1" />
  {getStatusLabel(status)}
</Badge>
```

**Sizes:**
- Mobile: 28px height, 16px font
- Desktop: 32px height, 18px font
- Touch target: 44×44px minimum

---

### 2. Filter by Status

**All Medications page should have filters:**
```tsx
[All] [Active] [Scheduled] [Completed]
```

**Filter counts:**
```
All (12)  Active (8)  Scheduled (2)  Completed (2)
```

---

### 3. Tooltip on Status Badge

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Badge>Completed</Badge>
    </TooltipTrigger>
    <TooltipContent>
      <p>This medication course ended on 14 October 2025</p>
      <p className="text-xs">Course duration: 14 days</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### 4. Empty States per Status

**Scheduled (empty):**
```
Icon: CalendarClock (80px)
Title: "No Scheduled Medications"
Description: "You have no medications scheduled to start in the future"
```

**Active (empty):**
```
Icon: CheckCircle (80px)
Title: "No Active Medications"
Description: "Add your first medication to start tracking"
Action: "Add Medication" button
```

**Completed (empty):**
```
Icon: CheckCheck (80px)
Title: "No Completed Medications"
Description: "Completed medication courses will appear here"
```

---

## 🔧 Implementation Guide

### Step 1: Add utility function (✅ Done)
```bash
Created: /utils/medicationStatusManager.ts
```

### Step 2: Update API integration
```typescript
// In api.getMedications()
const medications = await fetch('/medications');
const medicationsWithStatus = updateMedicationStatuses(medications);
return medicationsWithStatus;
```

### Step 3: Update UI components
```typescript
// In MainSchedule.tsx, MedicationsList.tsx
import { shouldShowInTodayList, canMarkMedicationTaken } from '@/utils/medicationStatusManager';

const todayMedications = medications.filter(shouldShowInTodayList);

const handleMarkTaken = (med) => {
  if (!canMarkMedicationTaken(med)) {
    toast.error('Cannot mark completed medication as taken');
    return;
  }
  // ... proceed with marking
};
```

### Step 4: Add status badges
```typescript
// In MedicationCard component
import { getStatusBadgeColor, getStatusLabel } from '@/utils/medicationStatusManager';

const colors = getStatusBadgeColor(medication.status);
<Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
  {getStatusLabel(medication.status)}
</Badge>
```

### Step 5: Add filters
```typescript
// In MedicationsList component
const [statusFilter, setStatusFilter] = useState<MedicationStatus[]>(['ACTIVE']);

const filteredMedications = filterMedicationsByStatus(medications, statusFilter);
```

---

## 📝 Backend Requirements

### Database Schema Update

```sql
ALTER TABLE medications 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE',
ADD COLUMN deleted_at TIMESTAMP NULL;

-- Create index for performance
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medications_deleted_at ON medications(deleted_at);
```

### API Endpoints

**1. Calculate status on CREATE:**
```typescript
POST /medications
{
  name: "Medication",
  startDate: "2025-11-15",
  endDate: "2025-11-30"
}

→ Backend calculates: status = "SCHEDULED"
→ Returns: { ...medication, status: "SCHEDULED" }
```

**2. Soft delete:**
```typescript
DELETE /medications/:id

→ SET deleted_at = NOW()
→ SET status = "DELETED"
→ Returns: 204 No Content
```

**3. Filter by status:**
```typescript
GET /medications?status=COMPLETED
GET /medications?status=ACTIVE,SCHEDULED
```

**4. Future: Recycle Bin:**
```typescript
GET /medications/deleted
POST /medications/:id/restore
DELETE /medications/:id/permanently
```

---

## ✅ Acceptance Criteria Summary

### AC-1: Status Calculation
- [ ] Status auto-calculated based on startDate/endDate
- [ ] SCHEDULED when startDate > today
- [ ] ACTIVE when in date range or no dates
- [ ] COMPLETED when endDate < today
- [ ] DELETED when deletedAt is set

### AC-2: UI Display
- [ ] Each status has correct badge color
- [ ] Status icon matches status type
- [ ] Tooltip shows status description
- [ ] Status visible on all medication cards

### AC-3: User Actions
- [ ] COMPLETED medications cannot be marked as taken
- [ ] SCHEDULED medications not shown in Today
- [ ] DELETED medications hidden from all lists
- [ ] Error toast when invalid action attempted

### AC-4: Filtering
- [ ] Filter by ACTIVE shows only active medications
- [ ] Filter by COMPLETED shows finished courses
- [ ] Filter by SCHEDULED shows future medications
- [ ] "All" filter shows all except DELETED

### AC-5: History
- [ ] COMPLETED medications visible in History
- [ ] ACTIVE medications with past records in History
- [ ] SCHEDULED medications not in History
- [ ] DELETED medications not in History

### AC-6: Backend Integration
- [ ] Status calculated on CREATE
- [ ] Status updated on UPDATE
- [ ] Soft delete sets deletedAt and status
- [ ] API returns status in response

---

## 🚀 Rollout Plan

### Phase 1: Frontend Only (Immediate)
1. ✅ Create `medicationStatusManager.ts` utility
2. Apply status calculation on frontend
3. Update UI to show status badges
4. Filter completed medications from Today

### Phase 2: Backend Integration (Next Sprint)
1. Update database schema
2. Add status calculation to API
3. Implement soft delete
4. Add status filters to API

### Phase 3: Recycle Bin (Future)
1. Create Recycle Bin UI
2. Add restore functionality
3. Add permanent delete with confirmation
4. Add auto-purge after 30 days

---

## 📊 Impact Analysis

### Problem Solved:
- ✅ No more "active" medications with past endDate
- ✅ Clear lifecycle for medication courses
- ✅ Medical-grade accuracy for elderly users
- ✅ GDPR/HIPAA compliant soft delete

### User Benefits:
- 📅 Future medications don't clutter Today's schedule
- ✅ Completed courses clearly marked
- 🗑️ Deleted medications can be restored
- 📊 Better adherence analytics (active vs completed)

### Business Value:
- Medical-grade data integrity ✅
- Compliance with healthcare standards ✅
- Better UX for elderly users ✅
- Foundation for advanced features ✅

---

## 🎉 COMPLETE!

**Status:** 🟢 AC DEFINED & UTILITY CREATED  
**Files Created:**
- ✅ `/utils/medicationStatusManager.ts`
- ✅ `/✅_MEDICATION_STATUS_AC_NOV9_2025.md`

**Next Steps:**
1. Review AC with Vladyslav
2. Implement status badges in UI
3. Update backend API
4. Test all scenarios

**Date:** 9 November 2025  
**Developer:** AI Assistant  
**Quality:** Medical-Grade Lifecycle Management  

**🎯 MEDICATION STATUS AC COMPLETE! 🚀**
