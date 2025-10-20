# 🐛 Debugging: Tour Details Not Showing on Submitted Quotations

## 📋 Problem
Tour details are NOT displaying on the "Submitted" quotations tab, while the quotation details (price, status, notes) ARE showing correctly.

---

## 🔍 Root Cause Analysis

### Frontend Expected Structure
The frontend expects submitted quotations to have a `tourDetails` field with:
```typescript
tourDetails: {
  ptId: string;
  title: string;
  startLocation: string;
  endLocation: string;
  numberOfSeats: number;
  date: string;
  numberOfDates: number;
  pickupTime: string;
  descriptionAboutStartLocation?: string;
  path?: string;
}
```

### Backend Response (Should Include)
The backend endpoint `/VehicleOwnerQuotation/submittedQuotation/{vehicleOwnerId}` returns:
```json
{
  "quotationId": "...",
  "vehicleOwnerId": "...",
  "tourId": "...",
  "tourDetails": { "entire PendingTrip object" },
  "quotedAmount": 5000,
  "quotationNotes": "...",
  "quotationDate": "...",
  "status": "pending"
}
```

---

## 🚀 Debugging Steps

### Step 1: Check Backend Response

The backend should be returning the full `PendingTrip` object as `tourDetails`. See:
**File:** `backend/src/main/java/com/example/student/controller/VehicleQuotationController.java`
**Line:** ~189
**Code:**
```java
data.put("tourDetails", tour);  // Entire Tour model
```

### Step 2: Run App and Check Console Logs

1. **Clear cache and restart:**
   ```bash
   npm start -- --reset-cache
   ```

2. **Open console** (F12 or DevTools)

3. **Login and navigate to Group Tour Quotations**

4. **Click on "✅ Submitted" tab**

5. **Look for console logs starting with:**
   - `📋 Quotation 1:` - Shows quotation data
   - `📍 Tour Details Analysis:` - Shows tourDetails check
   - `Has tourDetails: true/false` - KEY INFO!

### Step 3: Check for Tour Details in Response

In console, look for these specific logs:

**If tourDetails EXISTS:**
```
📍 Tour Details Analysis:
  Has tourDetails: true
  tourDetails type: object
  tourDetails keys: [ptId, title, startLocation, ...]
  tourDetails.ptId: 123
  tourDetails.title: "Kandy City Tour"
  tourDetails.startLocation: "Colombo"
  tourDetails.endLocation: "Kandy"
```

**If tourDetails MISSING:**
```
📍 Tour Details Analysis:
  Has tourDetails: false
  ⚠️ NO tourDetails field in quotation!
```

---

## 🔴 Common Issues & Fixes

### Issue 1: tourDetails is NULL

**Symptom:**
```
Has tourDetails: false
⚠️ NO tourDetails field in quotation!
```

**Cause:** Backend is not including tourDetails in response

**Fix:** Check backend endpoint `/VehicleOwnerQuotation/submittedQuotation/{vehicleOwnerId}`
- Verify it's adding: `data.put("tourDetails", tour);`
- Ensure `tour` object is being fetched from database
- Verify `tourRepo.findById(quotation.getPendingTripId())` is finding the tour

**Test with Postman:**
```
GET http://localhost:8080/VehicleOwnerQuotation/submittedQuotation/{userId}
Header: Authorization: Bearer {token}
```

Check if response includes `tourDetails` field.

---

### Issue 2: tourDetails Exists but Fields are Missing

**Symptom:**
```
Has tourDetails: true
tourDetails.title: undefined
tourDetails.startLocation: undefined
```

**Cause:** PendingTrip object exists but fields aren't being populated correctly

**Fix:** Check PendingTrip model has these properties:
- `ptId`
- `title`
- `startLocation`
- `endLocation`
- `numberOfSeats`
- `date`
- `numberOfDates`
- `pickupTime`
- `descriptionAboutStartLocation`

**Verify in console:**
```
Full Quotation Data: [shows entire JSON response]
```

Look at the `tourDetails` sub-object and verify all fields are present.

---

### Issue 3: tourDetails Exists but Wrong Format

**Symptom:**
```
tourDetails: "string instead of object"
```

**Cause:** Backend is serializing tourDetails incorrectly

**Fix:** Ensure backend is adding complete object:
```java
data.put("tourDetails", tour);  // ✅ Correct
// NOT:
data.put("tourDetails", tour.toString());  // ❌ Wrong
```

---

## 📊 Data Flow Diagram

```
Frontend Request
  ↓
GET /VehicleOwnerQuotation/submittedQuotation/{userId}
  ↓
Backend:
  1. Find all VehicleOwnerQuotation for userId
  2. For each quotation:
     - Get PendingTrip by quotation.pendingTripId
     - Create response with: quotationId, tourDetails, quotedAmount, etc.
  ↓
Response includes tourDetails: { full PendingTrip object }
  ↓
Frontend receives response
  ↓
RENDER CHECK:
  - Extract tourDetails from quotation
  - Display tourDetails.title, startLocation, endLocation
  ↓
IF tourDetails missing → DISPLAY NOT SHOWN
IF tourDetails exists → DISPLAY SHOWN
```

---

## 🎯 Expected vs Actual

### ✅ Expected (When Working)

Console should show:
```
📋 Quotation 1:
  ID (_id): 507f1f77bcf86cd799439011
  quotationId: 507f1f77bcf86cd799439011
  Tour ID (tourId): pt123
  Quoted Amount: 5000
  Notes: Good condition
  Status: pending
  
  📍 Tour Details Analysis:
    Has tourDetails: true
    tourDetails type: object
    tourDetails keys: ptId,title,startLocation,endLocation,numberOfSeats,date,pickupTime,numberOfDates
    tourDetails.ptId: pt123
    tourDetails.title: Kandy City Tour
    tourDetails.startLocation: Colombo
    tourDetails.endLocation: Kandy
    tourDetails.numberOfSeats: 4
```

And on screen: "Kandy City Tour" title and "Colombo → Kandy" route SHOULD display.

### ❌ Actual (When Not Working)

Console shows:
```
📍 Tour Details Analysis:
  Has tourDetails: false
  ⚠️ NO tourDetails field in quotation!

Full Quotation Data:
{
  "quotationId": "...",
  "vehicleOwnerId": "...",
  "tourId": "...",
  "quotedAmount": 5000,
  // ❌ NO tourDetails field here!
  "status": "pending"
}
```

And on screen: Tour information NOT displayed, only quotation details shown.

---

## 🔧 How to Verify Tour Details Are Being Sent

### Option 1: Check Network Tab (Browser DevTools)

1. Open DevTools (F12)
2. Go to **Network** tab
3. Navigate to submitted quotations
4. Look for request to: `/VehicleOwnerQuotation/submittedQuotation/...`
5. Click on it → **Response** tab
6. Search for `"tourDetails"`
7. If found: Backend is sending it
8. If not found: Backend needs to be fixed

### Option 2: Check Console Logs

Look for this exact output:
```
tourDetails full: {
  "_id": "...",
  "ptId": "...",
  "title": "...",
  ...
}
```

If this shows `undefined` or `null` → tourDetails not in response

---

## 📝 Debug Checklist

Before asking for help, verify:

- [ ] Backend endpoint `/VehicleOwnerQuotation/submittedQuotation/{userId}` exists
- [ ] Backend is calling `data.put("tourDetails", tour);`
- [ ] Backend `tour` object is being fetched from database
- [ ] Console shows `Has tourDetails: true`
- [ ] Console shows tourDetails has all required fields
- [ ] Network tab shows tourDetails in response JSON
- [ ] You've restarted app with `npm start -- --reset-cache`
- [ ] Browser cache cleared (Ctrl+Shift+Delete)

---

## 🎯 Next Steps

### If tourDetails is MISSING from backend response:

1. Backend needs to be fixed
2. Ensure `tourRepo.findById()` is working
3. Verify tour data exists in database
4. Check if PendingTrip model has all required fields

### If tourDetails EXISTS but fields are undefined:

1. Check PendingTrip model properties
2. Verify data is saved correctly in database
3. Check for null values in database records

### If tourDetails EXISTS and complete:

1. Check if frontend is correctly parsing the response
2. Look for JavaScript errors in console
3. Verify conditional rendering logic in TSX

---

## 💻 Test Commands

### Run App with Fresh Cache
```bash
npm start -- --reset-cache
```

### Check Backend Logs
```bash
# While running backend, look for:
# "Fetching submitted quotations for vehicle owner ID: ..."
# "Returning X quotations for vehicle owner ID: ..."
```

### Test API with curl
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/VehicleOwnerQuotation/submittedQuotation/YOUR_USER_ID
```

Should return JSON with `tourDetails` field.

---

## 📞 When to Report Issue

If after following these steps, tourDetails is still not showing:

1. **Screenshot console logs** showing the full quotation data
2. **Screenshot network response** showing the API response
3. **Screenshot app display** showing what's shown
4. Share these with developer team

Include:
- Are you seeing "Has tourDetails: true" or "false"?
- What fields are present in tourDetails?
- What fields are missing?
- Full JSON of one quotation from console

---

## 🎨 Visual Debugging

The submitted quotations expandable card should show:

```
┌─────────────────────────────────────┐
│ KANDY CITY TOUR              #1    │  ← From tourDetails.title
│ Colombo → Kandy                   │  ← From tourDetails.start/endLocation
├─────────────────────────────────────┤
│ Date: Jan 15, 2025   Seats: 4    │  ← From tourDetails
│ Amount: ₨5,000                   │  ← From quotedAmount
├─────────────────────────────────────┤
│ [⬇] Tap to view details           │
└─────────────────────────────────────┘

When expanded:
┌─────────────────────────────────────┐
│ Quotation Details                 │
│ Quoted Amount: ₨5,000              │
│ Status: Pending                   │
│ Notes: Good condition             │
│                                   │
│ Tour Information                  │  ← FROM tourDetails
│ Tour Title: Kandy City Tour       │  ← tourDetails.title
│ Pickup Time: 06:00 AM             │  ← tourDetails.pickupTime
│ Pickup Location: Colombo          │  ← tourDetails.descriptionAboutStartLocation
│ Route: Colombo → Kandy            │  ← Parsed from tourDetails.path
│ Distance: 146 km                  │  ← Parsed from tourDetails.path
│ Est. Time: 3 hours                │  ← Parsed from tourDetails.path
└─────────────────────────────────────┘
```

If "Tour Information" section is NOT showing → tourDetails is missing!

