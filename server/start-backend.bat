@echo off
REM Gavyadhenu Backend Auto-Start Script for Windows
REM This script starts the PM2-managed backend server on system boot

SETLOCAL ENABLEDELAYEDEXPANSION
SET "APPDATA_PATH=%APPDATA%"
SET "PM2_CMD=%APPDATA_PATH%\npm\pm2.cmd"
SET "SERVER_DIR=C:\Users\abhay\Gavyadhenu\server"
SET "LOG_FILE=%SERVER_DIR%\startup.log"

REM Navigate to server directory
cd /d "%SERVER_DIR%"

REM Ensure PM2 is available
IF NOT EXIST "%PM2_CMD%" (
  echo PM2 not found, installing globally...
  npm install -g pm2
)

REM Start or resurrect the backend with PM2
"%PM2_CMD%" resurrect || "%PM2_CMD%" start ecosystem.config.cjs --env production
"%PM2_CMD%" save

REM Log the startup
echo Gavyadhenu backend started via PM2 >> "%LOG_FILE%"
date /t >> "%LOG_FILE%"
time /t >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

ENDLOCAL
exit /b 0
