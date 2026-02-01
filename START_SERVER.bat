@echo off
title Alumni Connect - Backend Server
echo.
echo Starting Alumni Connect server...
echo Open in browser: http://localhost:5000/
echo.
echo Do NOT close this window while using the website.
echo.
cd /d "%~dp0backend"
if not exist "package.json" (
  echo ERROR: backend folder not found. Run this from the frontend folder.
  pause
  exit /b 1
)
call npm run dev
paus