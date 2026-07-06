@echo off
REM Gavyadhenu Full Stack Startup Script
REM Starts both backend (PM2) and frontend (Vite) dev servers

SETLOCAL ENABLEDELAYEDEXPANSION
SET "APPDATA_PATH=%APPDATA%"
SET "PM2_CMD=%APPDATA_PATH%\npm\pm2.cmd"
SET "SERVER_DIR=C:\Users\abhay\Gavyadhenu\server"
SET "CLIENT_DIR=C:\Users\abhay\Gavyadhenu\client"
SET "BACKEND_URL=http://localhost:5000/api/products"
SET /A "MAX_WAIT_SECONDS=60"
SET /A "WAIT_INTERVAL=5"
SET /A "WAITED=0"

if not exist "%PM2_CMD%" (
  echo PM2 command not found at %PM2_CMD%
  echo Installing PM2 globally...
  npm install -g pm2 >nul 2>&1
)

REM Start Backend with PM2
echo [1/3] Starting Backend with PM2...
cd /d "%SERVER_DIR%"
"%PM2_CMD%" resurrect >nul 2>&1 || "%PM2_CMD%" start ecosystem.config.cjs --env production >nul 2>&1
"%PM2_CMD%" save >nul 2>&1

echo Waiting for backend to become available at %BACKEND_URL%...
:wait_backend
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%BACKEND_URL%' -UseBasicParsing -TimeoutSec 5; exit $r.StatusCode -eq 200 ? 0 : 1 } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL%==0 goto backend_ready
if %WAITED% GEQ %MAX_WAIT_SECONDS% goto backend_timeout
set /A "WAITED+=WAIT_INTERVAL"
echo Waiting... %WAITED%/%MAX_WAIT_SECONDS% seconds elapsed
timeout /t %WAIT_INTERVAL% /nobreak >nul
goto wait_backend

:backend_ready
echo Backend is ready.

echo [2/3] Starting Frontend with Vite...
start "Gavyadhenu Frontend" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"

echo.
echo ===================================
echo Startup Complete!
echo ===================================
echo.
echo Backend (PM2):  http://localhost:5000
echo Frontend (Vite): http://localhost:5173
echo.
echo Opening browser to http://localhost:5173...
timeout /t 3 /nobreak

start "Gavyadhenu" http://localhost:5173

goto end

:backend_timeout
echo Backend did not become ready within %MAX_WAIT_SECONDS% seconds.
echo Starting frontend anyway, but the app may show a proxy error.

echo [2/3] Starting Frontend with Vite...
start "Gavyadhenu Frontend" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"

echo.
echo ===================================
echo Startup Complete with warnings.
echo ===================================
echo.
echo Backend (PM2):  http://localhost:5000
echo Frontend (Vite): http://localhost:5173
echo.
echo Opening browser to http://localhost:5173...
timeout /t 3 /nobreak

start "Gavyadhenu" http://localhost:5173

:end
ENDLOCAL
exit /b 0
