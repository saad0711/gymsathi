@echo off
setlocal
cd /d "%~dp0"

if not exist ".env.local" (
  echo Missing .env.local. Create it from .env.example first.
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies for the first run...
  call npm.cmd install
  if errorlevel 1 exit /b 1
)

echo Starting GymSathi at http://localhost:3000
call npm.cmd run dev
