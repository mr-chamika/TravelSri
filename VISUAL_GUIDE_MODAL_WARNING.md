# Visual Guide - Modal Warning Message Display

## 📐 Modal Layout Diagram

### Complete Modal Structure with Warning

```
┌──────────────────────────────────────────────────────────────┐
│                    Availability Screen                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Add Unavailability Modal                     │ │
│  │                                                        │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  Add Unavailability                              ✕   │ │  ← Modal Header
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │ ⚠️  Selected range has 3 booked dates       ✕  │ │ │  ← WARNING BANNER (NEW)
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  Select start date                                    │ │
│  │  ┌──────────────────┬──────────────────┐             │ │
│  │  │ Start Date      │ End Date        │             │ │
│  │  │ Oct 25, 2025    │ —               │             │ │
│  │  └──────────────────┴──────────────────┘             │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │      [Calendar Widget]                         │  │ │  ← Calendar for selection
│  │  │                                                │  │ │
│  │  │   Oct 2025                                     │  │ │
│  │  │   S  M  T  W  T  F  S                          │  │ │
│  │  │         1  2  3  4                             │  │ │
│  │  │   5  6  7  8  9  10 11                         │  │ │
│  │  │   ...                                          │  │ │
│  │  │   25 26 27 28 29 30 31                         │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  Reason (Optional)                                    │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ [Text Input]                                   │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  Additional Notes (Optional)                          │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ [Multi-line Text Area]                         │  │ │
│  │  │                                                │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  ☑ Is this recurring?                                │ │
│  │  [ Weekly ]  [ Monthly ]                             │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  [Cancel]                [Save]                │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Warning Banner Design

### Warning Banner Components

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  Selected range has 3 booked date(s):  📅  2025-10-23   ✕ │
│     2025-10-24, 2025-10-25, +1 more                         │
│     You won't be able to add unavailability for these dates. │
└─────────────────────────────────────────────────────────────┘

Component Breakdown:
├─ Left Border [4px #E53935]
├─ Alert Icon [20px, white]
├─ Warning Message [13px, semi-bold, white, line-height 18px]
└─ Close Button [18px X]
```

### Color Palette

```
Background:  #FF6B6B  ████████ (Red)
Left Border: #E53935  ████████ (Dark Red - Accent)
Text:        #FFFFFF  ████████ (White)
Icon:        #FFFFFF  ████████ (White)
```

### Spacing

```
┌─────────────────────────────────────────┐
│ 12px ⚠️  Message Text            ✕  12px │  ← Vertical padding
└─────────────────────────────────────────┘
  ↑  16px  ↑                  ↑  16px  ↑
  Margin   Icon    Flex-1     Close  Margin
           Space   Message    Button
```

---

## 🔄 Warning Scenarios Visual

### Scenario 1: Start Date Has Bookings

```
User selects Oct 22 (has booking)
         ↓
  ⚠️ Warning Appears
  ┌─────────────────────────────────────────────┐
  │ ⚠️  This start date has bookings.        ✕ │
  │     Be careful when selecting the end date! │
  └─────────────────────────────────────────────┘
         ↓
  Auto-dismiss in 3 seconds OR click ✕
         ↓
  User continues to select end date
```

### Scenario 2: End Date Before Start Date

```
User selects Start: Oct 25, End: Oct 22
         ↓
  ⚠️ Warning Appears
  ┌──────────────────────────────────────────────┐
  │ ⚠️  End date cannot be before start date.  ✕ │
  │     Please select a later date.              │
  └──────────────────────────────────────────────┘
         ↓
  Auto-dismiss in 3 seconds OR click ✕
         ↓
  End date is NOT set - User must re-select
```

### Scenario 3: Range Contains Bookings

```
User selects Start: Oct 22, End: Oct 25
(bookings on Oct 23, 24, 25)
         ↓
  ⚠️ Warning Appears
  ┌──────────────────────────────────────────────┐
  │ ⚠️  Selected range has 3 booked date(s):   ✕ │
  │                                              │
  │ 📅 2025-10-23, 2025-10-24, 2025-10-25       │
  │                                              │
  │ You won't be able to add unavailability for  │
  │ these dates.                                 │
  └──────────────────────────────────────────────┘
         ↓
  Auto-dismiss in 4 seconds OR click ✕
         ↓
  User is aware of conflicts - can continue or change dates
```

### Scenario 4: Save Blocked - Conflicts Found

```
User clicks "Save" with conflicting dates
         ↓
  ⚠️ Final Warning Appears
  ┌──────────────────────────────────────────────┐
  │ ⚠️  Cannot add unavailability!              ✕ │
  │                                              │
  │ You have Accepted/Confirmed bookings on     │
  │ these dates:                                 │
  │                                              │
  │ 📅 2025-10-22, 2025-10-23, 2025-10-24,     │
  │    +1 more                                   │
  │                                              │
  │ Please cancel or complete these bookings    │
  │ first.                                       │
  └──────────────────────────────────────────────┘
         ↓
  Auto-dismiss in 5 seconds OR click ✕
         ↓
  User CANNOT save - must adjust dates
```

---

## 🎬 Animation Flow

### Warning Entry Animation

```
Frame 1 (Start - t=0ms)
Modal Opens
Warning starts above top of visible area
Opacity: 0%

Frame 2 (Middle - t=150ms)
Warning slides down
Opacity: 50%
Position: -50px from final

Frame 3 (End - t=300ms)
Warning in final position
Opacity: 100%
Position: 12px from top

Display warning for duration (3-5 sec)

Frame 4 (Dismiss - t=3300ms)
Auto-dismiss begins OR
User clicks ✕
Warning fades out and disappears
```

---

## 📱 Responsive Behavior

### Desktop (Wide Screen)

```
┌──────────────────────────────────────────────────────┐
│ ⚠️  Selected range has 3 booked dates        ✕     │
│     2025-10-23, 2025-10-24, 2025-10-25, +1 more    │
│     You won't be able to add unavailability...       │
└──────────────────────────────────────────────────────┘
```

### Tablet (Medium Screen)

```
┌──────────────────────────────────────────┐
│ ⚠️  Selected range has 3 booked dates  ✕ │
│     2025-10-23, 2025-10-24,              │
│     2025-10-25, +1 more                  │
│     You won't be able to add...           │
└──────────────────────────────────────────┘
```

### Mobile (Small Screen)

```
┌────────────────────────────────┐
│ ⚠️  Selected range has      ✕  │
│    3 booked date(s):           │
│                                │
│ 📅 2025-10-23,                 │
│    2025-10-24,                 │
│    2025-10-25                  │
│                                │
│ You won't be able to add...     │
└────────────────────────────────┘
```

---

## 🎯 User Interaction Flow

### Visual State Transitions

```
State 1: Modal Closed
┌─────────────────────────┐
│    Availability Page    │
│                         │
│  + Add Unavailability   │
│     Button              │
└─────────────────────────┘

                ↓ (Click "+ Add")

State 2: Modal Opened - No Warning
┌─────────────────────────┐
│   Add Unavailability    │
│                         │
│ Select start date...    │
│ ┌───────────────────┐   │
│ │  [Calendar]       │   │
│ └───────────────────┘   │
└─────────────────────────┘

                ↓ (Select conflicting date)

State 3: Warning Shown
┌─────────────────────────┐
│   Add Unavailability    │
│ ┌─────────────────────┐ │
│ │ ⚠️  Warning here  ✕ │ │ ← NEW
│ └─────────────────────┘ │
│ Select start date...    │
│ ┌───────────────────┐   │
│ │  [Calendar]       │   │
│ └───────────────────┘   │
└─────────────────────────┘

                ↓ (Auto-dismiss or click ✕)

State 2: Warning Hidden
(returns to State 2 after timeout)
```

---

## 📊 Warning Priority Levels

### By Duration (Importance)

```
Level 1 - 3 seconds (Informational)
├─ Start date has booking
└─ Low-medium importance

Level 2 - 4 seconds (Attention)
├─ End date invalid (before start)
├─ Range has conflicts
└─ Medium importance

Level 3 - 5 seconds (Critical)
├─ Cannot save - conflicts block operation
└─ High importance - must be resolved
```

---

## 🎨 Color Usage Guide

### Warning Colors Meaning

```
Red (#FF6B6B) = Immediate attention needed
Dark Red (#E53935) = Accent/Border emphasis
White (#FFFFFF) = High contrast text

Background combination:
Red + Dark Red = Urgent visual signal
```

### Why These Colors?

```
✓ High contrast with white text
✓ Internationally recognized as warning/alert
✓ Stands out from surrounding UI
✓ Professional appearance
✓ Accessible for color-blind users (with icon + text)
```

---

## 📐 Sizing Reference

### Typography

```
Modal Title:        16px (bold)
Instruction Text:   14px
Warning Text:       13px (semi-bold)
Close Button:       18px icon
Alert Icon:         20px
```

### Spacing

```
Modal Margin:       16px (all sides)
Warning Margin:     16px horizontal, 12px top, 16px bottom
Content Padding:    12px vertical, 16px horizontal
Icon Margin:        12px right, 2px top
```

### Border Radius

```
Warning Banner:     10px
Modal:              20px (typical)
Buttons:            10-12px (typical)
```

---

## ✅ Implementation Checklist Visual

```
┌─────────────────────────────────────────────────┐
│ Modal Warning Implementation Checklist          │
├─────────────────────────────────────────────────┤
│ ✓ JSX Component Added to Modal                 │
│ ✓ Conditional Rendering (showWarning check)    │
│ ✓ Animation (FadeInDown)                       │
│ ✓ Alert Icon Display                           │
│ ✓ Warning Message Text                         │
│ ✓ Close Button (✕)                             │
│ ✓ Style Object: modalWarningNotification       │
│ ✓ Style Object: modalWarningContent            │
│ ✓ Style Object: modalWarningIcon               │
│ ✓ Style Object: modalWarningText               │
│ ✓ Colors & Spacing                             │
│ ✓ Responsive Design                            │
│ ✓ Auto-dismiss Functionality                   │
│ ✓ Manual Close Functionality                   │
│ ✓ All Scenarios Tested                         │
│ ✓ TypeScript Errors: 0                         │
│ ✓ Lint Warnings: 0                             │
└─────────────────────────────────────────────────┘
```

