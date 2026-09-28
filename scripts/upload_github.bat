@echo off
setlocal
cd /d "%~dp0.."
if not exist .git (
  echo ERROR: This folder is not a Git repository.
  exit /b 1
)

git status

echo.
git add .
git diff --cached --quiet
if %errorlevel%==0 (
  echo No changes to commit.
  exit /b 0
)

git commit -m "Update FinChat AI Gateway"
if errorlevel 1 exit /b 1

git push
if errorlevel 1 exit /b 1

echo GitHub upload completed.
endlocal
