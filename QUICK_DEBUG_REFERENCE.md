# ⚡ Quick Reference: Debug Logs Cheat Sheet

## 🎯 Where to Look

**File:** `frontend/mobile_app_frontend/app/(vehicle)/myVehicles.tsx`

**Console:** Open DevTools (F12) → Console tab

**Filter:** Search for emoji: 🚀, 🔑, 👤, 📤, ✅, ❌

---

## 📍 Nine Phases of Execution

| Phase | What to Look For | Success = | Failure = |
|-------|-----------------|-----------|-----------|
| 1️⃣ Mount | 🎯 COMPONENT MOUNTED | Log appears | No log |
| 2️⃣ Call | 🚀 getData() CALLED | Log appears | No log |
| 3️⃣ Token | 1️⃣ access_token: ✅ Found | Token found | ❌ Not found |
| 4️⃣ JWT | 👤 JWT decoded successfully | "successfully" | ❌ ERROR |
| 5️⃣ ID | 👤 userId: [VALUE] | Has value | Empty or error |
| 6️⃣ URL | 🔗 Final API URL: http://... | Shows URL | Error message |
| 7️⃣ Fetch | ⏳ About to call fetch() | Log appears | Stops here = NO API CALL |
| 8️⃣ Response | ✅ RESPONSE RECEIVED | Status 200 | Status ≥400 |
| 9️⃣ Complete | ✅ COMPLETED SUCCESSFULLY | Success msg | ❌ ERROR msg |

---

## 🔴 IF NO API CALL IS HAPPENING

### Quick Diagnosis Checklist

```
Are you seeing these logs in order? Mark each:

☐ Phase 1: 🎯 COMPONENT MOUNTED
  └─ If NO: Navigation/rendering issue

☐ Phase 2: 🚀 getData() FUNCTION CALLED AT: [TIME]
  └─ If NO: useEffect not triggering

☐ Phase 3: 1️⃣ Checking access_token: ✅ Found
  └─ If NO: Token not in AsyncStorage - user needs to login

☐ Phase 4: ✅ JWT decoded successfully!
  └─ If NO: Token is invalid - user needs to login again

☐ Phase 5: 👤 Extracted userId: [VALUE]
  └─ If NO: JWT doesn't have id/sub field - backend issue

☐ Phase 6: 🔗 Final API URL: http://localhost:8080/vehicle/owner?vehicleOwnerId=[ID]
  └─ If NO: URL construction failed

☐ Phase 7: ⏳ About to call fetch()...
  └─ If YES but phase 8 missing: FETCH CALL NEVER MADE!

☐ Phase 8: ✅ ===== API RESPONSE RECEIVED =====
  └─ If NO: Network/backend issue

☐ Phase 9: ✅ ===== COMPLETED SUCCESSFULLY =====
  └─ If NO: Check specific error messages above
```

---

## ✅ Step 1: Clear Cache
```bash
npm start -- --reset-cache
```

## ✅ Step 2: Open Console
- Browser: Press F12
- Mobile: Press D (in terminal)

## ✅ Step 3: Navigate to My Vehicles

## ✅ Step 4: Find Where Logs Stop

If logs stop at **Phase 7** ("About to call fetch()"), the API is NEVER being called.

If logs continue to **Phase 8**, the API IS being called (check status code for errors).

---

## 🔴 Most Common Issues

| Issue | Look For | Fix |
|-------|----------|-----|
| No logs at all | Nothing in console | Component not loading / wrong page |
| Stop at Phase 3 | ❌ Not found (token) | User needs to login |
| Stop at Phase 4 | ❌ JWT DECODE ERROR | Token corrupted / user login again |
| Stop at Phase 5 | ❌ userId empty | JWT missing id/sub field |
| **Stop at Phase 7** | **⏳ About to call fetch()** | **fetch() never runs - execution hangs** |
| Stop at Phase 8 | Status 401/403 | Token rejected by backend |
| Stop at Phase 9 | Various errors | Check error diagnostic message |

---

## 🚀 Quick Commands

### Restart Everything
```bash
npm start -- --reset-cache
```

### Check Backend Running
```bash
curl http://localhost:8080/vehicle/owner
```

### Test API in Postman
```
GET http://localhost:8080/vehicle/owner?vehicleOwnerId=[USER_ID]
Header: Authorization: Bearer [TOKEN]
```

---

## 📊 Expected vs Actual

### ✅ Expected (Everything Works)
```
✅ All 9 phases complete
✅ Status code 200
✅ Vehicles shown on screen
✅ "COMPLETED SUCCESSFULLY" in logs
```

### ❌ If No API Call (Phase 7 Fails)
```
❌ Logs stop at "About to call fetch()"
❌ No network request in DevTools Network tab
❌ Phase 8+ logs missing
❌ Either error or nothing after Phase 7
```

---

## 📞 When Asking for Help, Share:

1. **Screenshot of console logs** (from start until failure)
2. **Where logs stop** (which phase)
3. **Any error messages** (especially in red)
4. **Backend status** (is it running?)
5. **Login status** (are you logged in?)

---

## 🎯 TL;DR

If `getData()` is being called but no API call is made:
- Check Phase 7: "About to call fetch()" log
- If you see this log but not Phase 8, the problem is at fetch() execution
- Likely causes: 
  - Error thrown in try block (not caught)
  - fetch() hanging
  - Browser/network issue

Run the debugging version and share the console output!

