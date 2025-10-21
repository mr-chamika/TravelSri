# 🚀 Step-by-Step Debugging Instructions

## Goal
Find out exactly where the `getData()` function execution stops to understand why no API call is being made.

---

## 📋 Pre-Testing Checklist

Before you start testing, make sure:

- [ ] Backend server is running on `localhost:8080`
- [ ] You are logged in (have a valid JWT token)
- [ ] React Native dev tools are accessible
- [ ] You haven't made any other code changes

---

## 🎯 Testing Steps

### Step 1: Clear Cache and Restart
```bash
npm start -- --reset-cache
```

This ensures you're running the latest code, not cached old code.

**Expected output:** Dev server starts and shows:
```
Bundling JavaScript (100%)
Started bundling JavaScript
Metro waiting on localhost:8081
```

### Step 2: Open Console/Debugger

#### For Expo on Mobile:
- Press `d` in the terminal to open React Native debugger
- Or press `j` to open remote debugger in browser

#### For Web Browser:
- Press `F12` to open Developer Tools
- Go to **Console** tab

#### For React DevTools:
- Use React DevTools extension if installed

### Step 3: Navigate to My Vehicles Page

1. In your app, navigate to the **My Vehicles** page
2. **Do not** interact with anything else
3. Just let it load

### Step 4: Monitor Console Output

Look for console logs in this order:

#### ✅ First Check: Component Mount
```
═══════════════════════════════════════════════════════════════
🎯 ===== myVehicles COMPONENT MOUNTED =====
⏰ Component mounted at: [TIME]
```

**If you see this:** ✅ Component is loading
**If you DON'T see this:** ❌ Component never mounted - navigation issue

---

#### ✅ Second Check: getData() Called
```
═══════════════════════════════════════════════════════════════
🚀 getData() FUNCTION CALLED AT: [TIME]
```

**If you see this:** ✅ useEffect triggered getData()
**If you DON'T see this:** ❌ useEffect didn't trigger or getData not called

---

#### ✅ Third Check: Token Extraction
```
🔑 ===== TOKEN EXTRACTION STARTED =====
⏳ Retrieving access_token from AsyncStorage...
✔️ access_token retrieval completed
1️⃣ Checking access_token: ✅ Found (XXX chars)
```

**If you see "✅ Found":** ✅ Token exists in AsyncStorage
**If you see "❌ Not found":** Token retrieval might fail, check fallback

---

#### ✅ Fourth Check: Token Validation
```
✅ ===== TOKEN FOUND =====
📊 Token length: XXX characters
✅ Token format check: ✅ Valid JWT (starts with eyJ)
```

**If you see this:** ✅ Token is valid JWT format
**If you see error:** ❌ Token is invalid or corrupted

---

#### ✅ Fifth Check: JWT Decoding
```
👤 ===== JWT DECODING STARTED =====
✅ JWT decoded successfully!
✅ ===== USER ID EXTRACTED =====
👤 Extracted userId: [USER_ID]
```

**If you see userId:** ✅ JWT decoded and userId extracted
**If you see error:** ❌ JWT decode failed or userId missing

---

#### ✅ Sixth Check: API URL Construction
```
🌐 ===== API URL CONSTRUCTION =====
📍 userId value: [USER_ID]
🔗 Final API URL: http://localhost:8080/vehicle/owner?vehicleOwnerId=[USER_ID]
```

**If you see URL:** ✅ URL constructed successfully
**If you see error:** ❌ URL construction failed

---

#### ✅ Seventh Check: About to Send Request
```
📤 ===== SENDING API REQUEST =====
⏳ About to call fetch()...
📊 Request method: GET
🌐 Request URL: http://localhost:8080/vehicle/owner?vehicleOwnerId=[USER_ID]
⏱️ Request sent at: [TIME]
```

**🔴 CRITICAL CHECKPOINT:** If logs stop here, the fetch() is never called!

**If you see this:** ✅ About to make API call
**If logs stop here:** ❌ **THIS IS THE BREAKPOINT** - fetch() is not being called

---

#### ✅ Eighth Check: API Response Received
```
✅ ===== API RESPONSE RECEIVED =====
⏱️ Response received at: [TIME]
📊 Status Code: [CODE]
📊 Status Text: [TEXT]
```

**If Status Code is 200:** ✅ API call succeeded
**If Status Code is 401:** ❌ Token rejected by backend
**If Status Code is 403:** ❌ User not authorized
**If Status Code is 404:** ❌ Endpoint not found
**If Status Code is 500:** ❌ Backend error

---

## 🔴 Common Failure Points & How to Fix

### Failure Point 1: Component Never Mounts
**Problem:** Don't see "🎯 COMPONENT MOUNTED" log

**Causes:**
- Page not loading
- Navigation broken
- Component not rendering

**Fix:**
- Check if page loads at all
- Check if loading spinner appears
- Check browser console for other errors

---

### Failure Point 2: getData() Never Called
**Problem:** Don't see "🚀 getData() FUNCTION CALLED" log

**Causes:**
- useEffect not triggering
- Component unmounts immediately
- Navigation change before mounting

**Fix:**
- Verify you're on the right page
- Check if useEffect dependency array is correct
- Look for navigation changes

---

### Failure Point 3: Token Extraction Fails
**Problem:** See "❌ Not found" for both access_token and token

**Causes:**
- User not logged in
- Token not saved after login
- AsyncStorage cleared

**Fix:**
- Login again
- Clear app and restart
- Check if token is being saved during login

---

### Failure Point 4: JWT Decode Fails
**Problem:** See "❌ JWT DECODE ERROR" or token doesn't start with "eyJ"

**Causes:**
- Invalid JWT format
- Token corrupted
- Wrong token stored

**Fix:**
- Login again to get fresh token
- Check backend JWT generation
- Verify token structure

---

### Failure Point 5: userId Extraction Fails
**Problem:** See "❌ CRITICAL: userId is empty after extraction!"

**Causes:**
- JWT doesn't have `id` field
- JWT doesn't have `sub` field

**Fix:**
- Check JWT payload structure (log shows full payload)
- Backend needs to include `id` or `sub` in JWT
- Update backend JWT generation

---

### 🔴 Failure Point 6: Fetch Call Never Made
**Problem:** See "About to call fetch()..." but no response logs after

**Causes:**
- Network issue
- Fetch hanging
- Exception thrown but not caught
- Browser/mobile blocking request

**Fix:**
- Check network in browser DevTools (Network tab)
- Verify localhost:8080 is reachable
- Check for CORS errors in browser console
- Restart backend server

---

### Failure Point 7: API Returns Error Status (401, 403, etc.)
**Problem:** See "❌ Response NOT OK" with status code 401, 403, etc.

**Causes:**
- Token expired
- Token not recognized by backend
- Backend JWT validation failing
- CORS configuration wrong

**Fix:**
- Try logging out and logging in again
- Check backend token validation logic
- Check CORS headers on backend
- Verify Authorization header format

---

### Failure Point 8: JSON Parsing Fails
**Problem:** See "❌ JSON PARSING ERROR"

**Causes:**
- Response is HTML (error page) instead of JSON
- Response is empty
- Response is malformed

**Fix:**
- Check what backend is returning (use Postman to test)
- Check backend error logs
- Verify API endpoint is correct

---

### Failure Point 9: Vehicle Data Not Array
**Problem:** See "❌ ERROR: Response data is NOT an array!"

**Causes:**
- Backend API changed response format
- Response wrapping structure changed
- API returning object instead of array

**Fix:**
- Check backend API response structure
- Verify it should be array of vehicles
- Check if response is wrapped in an object

---

## 📸 How to Share Logs

When you need help, share:

1. **Full console output** from start to failure point
2. **Network tab screenshot** (if fetch fails)
3. **Backend error logs** (if you have access)
4. **Description** of where logs stop

To copy console logs:
1. Right-click in console
2. Select "Save as..."
3. Or select all (Ctrl+A) and copy (Ctrl+C)

---

## ✅ Expected Behavior When Everything Works

1. See component mount log ✅
2. See getData() called ✅
3. See token extraction success ✅
4. See JWT decode success ✅
5. See userId extracted ✅
6. See API URL constructed ✅
7. See "About to call fetch()" ✅
8. See "API RESPONSE RECEIVED" with status 200 ✅
9. See vehicles transformed ✅
10. See "COMPLETED SUCCESSFULLY" ✅
11. See vehicles loaded on screen ✅

---

## 🔧 Additional Troubleshooting

### Check Backend is Running
```bash
curl http://localhost:8080/vehicle/owner?vehicleOwnerId=test
```

Should return 401 (unauthorized) not "Connection refused"

### Test API with Postman

1. Open Postman
2. Create GET request to: `http://localhost:8080/vehicle/owner?vehicleOwnerId=[YOUR_USER_ID]`
3. Add header: `Authorization: Bearer [YOUR_TOKEN]`
4. Send and check response

### Check AsyncStorage
Look for logs showing token length and first 50 chars, verify they look correct.

### Check Network Tab (Browser)
1. Open DevTools
2. Go to Network tab
3. Reload/navigate to My Vehicles
4. Look for `/vehicle/owner` request
5. Check if request was made at all
6. Check response status and headers

---

## 🎯 Summary

The debugging logs will help you identify:
1. **Where** execution stops
2. **What** the error is (if any)
3. **Why** it's happening (diagnostic messages included)
4. **How** to fix it (actionable suggestions)

Just follow the phases in order and report back which phase completed and which phase failed!

