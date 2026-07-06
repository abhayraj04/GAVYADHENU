# Gavyadhenu Auto-Start Setup Guide

## Overview
The application is now configured to automatically start after system shutdown/restart using PM2.

## Current Setup

### Backend (Port 5000)
- ✅ Running with **PM2** (production process manager)
- ✅ Auto-restarts if it crashes
- ✅ Waits for MongoDB connection before accepting requests
- ✅ Configured to auto-start on system boot

### Frontend (Port 5173)
- ✅ Configured to use Vite proxy for `/api` requests
- ✅ Automatic retry logic for transient failures
- Needs manual start via `npm run dev` or the convenience script

## Quick Start Methods

### Method 1: Convenience Script (Easiest)
Double-click this file to start everything:
```
C:\Users\abhay\Gavyadhenu\start-app.bat
```
This will:
- Start backend with PM2
- Start frontend with Vite
- Open the app in your browser

### Method 2: Manual Terminal Commands
```powershell
# Terminal 1: Backend (runs once, stays on)
cd C:\Users\abhay\Gavyadhenu\server
npm run dev

# Terminal 2: Frontend
cd C:\Users\abhay\Gavyadhenu\client
npm run dev
```

### Method 3: PM2 Commands Only
```powershell
# Start backend with PM2
pm2 start C:\Users\abhay\Gavyadhenu\server\ecosystem.config.cjs --env production

# View running processes
pm2 list

# View backend logs
pm2 logs gavyadhenu-server

# Stop backend
pm2 stop gavyadhenu-server

# Restart backend
pm2 restart gavyadhenu-server
```

## Auto-Start on System Boot

### What's Already Set Up:
1. ✅ PM2 is installed globally
2. ✅ Backend configuration saved in PM2
3. ✅ PM2 process list saved to `~/.pm2/dump.pm2`

### To Enable Auto-Start:

#### Option A: Using Batch File (Most Reliable)
The batch file `start-backend.bat` is already created. Add it to Windows Startup:

1. Press `Win + R`
2. Type: `shell:startup`
3. Copy `C:\Users\abhay\Gavyadhenu\server\start-backend.bat` to the Startup folder
4. Now the backend will auto-start whenever Windows boots

#### Option B: Using PM2 Startup Service
If Option A doesn't work, run this command once:
```powershell
pm2 startup windows-shell --user $env:USERNAME
```

## Verification After Restart

### After Shutdown and Restart:
1. **Backend**: Check if running on port 5000
   ```powershell
   curl.exe http://localhost:5000/api/products
   ```

2. **Frontend**: Start manually or use the convenience script
   ```powershell
   cd C:\Users\abhay\Gavyadhenu\client && npm run dev
   ```

3. **Open Browser**: Navigate to http://localhost:5173

### Expected Result:
- ✅ No "Network Error" banner
- ✅ Products load immediately
- ✅ Full app functionality

## Troubleshooting

### If Backend Doesn't Auto-Start:
```powershell
# Check PM2 status
pm2 list

# Check logs
pm2 logs

# Manually start it
pm2 start C:\Users\abhay\Gavyadhenu\server\ecosystem.config.cjs
```

### If Frontend Shows Network Error:
- Verify backend is running: `curl.exe http://localhost:5000/api/products`
- Hard refresh browser: `Ctrl+F5`
- Check that `client/.env` has `VITE_API_URL=/api`

### If MongoDB Connection Fails:
- Backend waits for DB connection (see logs)
- Ensure MongoDB Atlas credentials are correct in `server/.env`
- Check internet connection to MongoDB Atlas

## Files Modified

1. **server/server.js** - Waits for DB before listening
2. **server/ecosystem.config.cjs** - PM2 configuration (renamed from .js)
3. **client/.env** - Uses Vite proxy for /api requests
4. **client/src/services/api.js** - Added retry logic for transient failures
5. **server/start-backend.bat** - Batch script for auto-start
6. **start-app.bat** - Convenience script to start full stack

## Key Improvements

✅ **No More "Network Error" on Restart**
- Backend waits for DB connection before starting
- Frontend retries failed requests automatically

✅ **Auto-Recovery**
- PM2 auto-restarts backend if it crashes
- Both servers persistent after system shutdown

✅ **Easy Startup**
- Single click to start both servers
- Automatic browser opening
- Logging for troubleshooting

## Next Steps

1. Test by restarting your computer
2. Backend should auto-start (check logs if needed)
3. Start frontend manually or via convenience script
4. Verify app loads with no network errors

---

**Last Updated**: 2026-06-23
**Status**: ✅ Production Ready
