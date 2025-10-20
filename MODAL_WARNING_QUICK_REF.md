# Quick Reference - Modal Warning Messages

## 🎯 What You'll See

When you open the "Add Unavailability" modal and select dates:

### Red Warning Banner (Top of Modal)
```
┌─────────────────────────────────────────────┐
│ ⚠️ Your warning message here...        ✕  │
└─────────────────────────────────────────────┘
```

---

## 📍 When Warnings Appear

### 1️⃣ Start Date with Bookings
- **When:** You click a date that has existing bookings
- **Message:** "⚠️ This start date has bookings. Be careful when selecting the end date!"
- **Duration:** 3 seconds (auto-dismiss) or click ✕

### 2️⃣ Invalid End Date
- **When:** You select an end date before the start date
- **Message:** "⚠️ End date cannot be before start date. Please select a later date."
- **Duration:** 3 seconds (auto-dismiss) or click ✕

### 3️⃣ Range Conflicts
- **When:** You select an end date that covers booked dates
- **Message:** Shows list of conflicting dates
- **Example:**
  ```
  ⚠️ Selected range has 3 booked date(s):
  
  📅 2025-10-23, 2025-10-24, 2025-10-25
  
  You won't be able to add unavailability for these dates.
  ```
- **Duration:** 4 seconds (auto-dismiss) or click ✕

### 4️⃣ Cannot Save with Conflicts
- **When:** You click "Save" with conflicting dates
- **Message:** Detailed error with booking statuses and dates
- **Example:**
  ```
  ⚠️ Cannot add unavailability!
  
  You have Accepted/Confirmed bookings on these dates:
  
  📅 2025-10-22, 2025-10-23, 2025-10-24, +1 more
  
  Please cancel or complete these bookings first.
  ```
- **Duration:** 5 seconds (auto-dismiss) or click ✕
- **Action:** Cannot proceed until dates are changed

---

## 🎨 Design Features

✅ **Red Color:** `#FF6B6B` - Immediately signals a warning
✅ **Left Border:** Dark red accent on left side
✅ **Icon:** Alert circle for quick recognition
✅ **Close Button:** Click ✕ to dismiss immediately
✅ **Animation:** Slides down smoothly into view
✅ **Auto-dismiss:** Disappears automatically after timeout
✅ **Multi-line:** Text wraps for long messages

---

## 🔄 User Actions

### Option 1: Auto-Dismiss
- Warning appears
- Wait for timeout (3-5 seconds)
- Warning disappears automatically

### Option 2: Manual Close
- Warning appears
- Click ✕ button
- Warning disappears immediately

### Option 3: Dismiss by Fixing
- Warning shows conflict
- Change your date selection
- Warning dismisses automatically
- Continue with valid dates

---

## 💡 Tips for Users

1. **Pay Attention:** Red banner means something needs your attention
2. **Read the Message:** It tells you exactly what's wrong
3. **Check Dates:** Review existing bookings in the calendar
4. **Adjust Dates:** Choose dates without booking conflicts
5. **Ask for Help:** Contact support if you need assistance managing bookings

---

## 🚀 User Journey

```
1. Click "+ Add" Button
   ↓
2. Modal Opens
   ↓
3. Select Start Date
   ├─ ✓ No conflicts? → Continue
   └─ ✗ Has bookings? → ⚠️ Warning appears (3 sec)
   ↓
4. Select End Date
   ├─ ✓ Valid range? → Continue
   ├─ ✗ Before start? → ⚠️ Warning (blocks selection)
   └─ ✗ Has conflicts? → ⚠️ Warning appears (4 sec)
   ↓
5. Fill Optional Details (Reason, Notes, Recurrence)
   ↓
6. Click "Save"
   ├─ ✓ All valid? → Confirmation dialog
   └─ ✗ Conflicts? → ⚠️ Final warning (5 sec, blocks save)
   ↓
7. Click "Confirm" (if no conflicts)
   ↓
✅ Unavailability Added Successfully
```

---

## ⚙️ Technical Details

**Location in Code:**
- JSX: Lines 1439-1451 in `availability.tsx`
- Styles: Lines 2507-2533 in `availability.tsx`

**Styles Applied:**
```
modalWarningNotification - Container styling
modalWarningContent - Flex layout for content
modalWarningIcon - Alert icon styling
modalWarningText - Warning text styling
```

**State Used:**
```
showWarning - Controls visibility
warningMessage - Contains warning text
```

---

## 📞 Support

If warnings aren't appearing or behaving unexpectedly:
1. Check browser console for errors
2. Verify you have bookings on selected dates
3. Contact development team with details
4. Include screenshot of the issue

