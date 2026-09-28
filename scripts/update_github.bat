@echo off
setlocal
cd /d "%~dp0.."
if not exist .git (
  echo ERROR: This folder is not a Git repository.
  exit /b 1
)

echo Fetching latest GitHub changes...
git pull --rebase
if errorlevel 1 (
  echo ERROR: git pull failed. Resolve conflicts before continuing.
  exit /b 1
)

git status

echo.
git add .
git diff --cached --quiet
if %errorlevel%==0 (
  echo No local changes to upload.
  exit /b 0
)

git commit -m "Update FinChat AI Gateway"
if errorlevel 1 exit /b 1

git push
if errorlevel 1 exit /b 1

echo GitHub update completed.
endlocal
