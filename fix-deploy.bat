@echo off
echo ==========================================
echo LiveBackdrop Auto Fix & Deploy Script
echo ==========================================

:: Step 1 - Go to project folder
cd /d D:\Users\zeng\Documents\GitHub\livebackdrop

:: Step 2 - Install required dependencies
echo Installing missing dependencies...
npm install next-auth mongoose bcryptjs

:: Step 3 - Add and commit changes
echo Committing updates to GitHub...
git add package.json package-lock.json
git commit -m "Auto fix: ensure next-auth and mongoose dependencies"
git push

:: Step 4 - Done message
echo ==========================================
echo Update pushed to GitHub! Vercel will automatically rebuild your project.
echo ==========================================
pause
