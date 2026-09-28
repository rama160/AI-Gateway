@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ==========================================
echo FinChat AI Gateway - GitHub Sync
 echo ==========================================

where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git tidak ditemukan di PATH.
  pause
  exit /b 1
)

if not exist ".git" (
  echo [MODE] Repository baru - upload awal
  git init
  git branch -M main
  git add .
  git diff --cached --quiet
  if errorlevel 1 (
    git commit -m "Initial FinChat AI Gateway"
  ) else (
    echo Tidak ada file untuk di-commit.
  )

  git remote get-url origin >nul 2>nul
  if errorlevel 1 (
    echo.
    set /p REPO_URL="Masukkan URL repository GitHub: "
    if "!REPO_URL!"=="" (
      echo ERROR: URL repository kosong.
      pause
      exit /b 1
    )
    git remote add origin "!REPO_URL!"
  )

  git push -u origin main
  if errorlevel 1 (
    echo ERROR: Upload awal gagal.
    pause
    exit /b 1
  )
) else (
  echo [MODE] Repository sudah ada - update otomatis
  git fetch origin
  if errorlevel 1 (
    echo ERROR: git fetch gagal.
    pause
    exit /b 1
  )

  git branch --show-current > "%TEMP%\finchat_branch.txt"
  set /p BRANCH=<"%TEMP%\finchat_branch.txt"
  if "!BRANCH!"=="" set BRANCH=main

  git add .
  git diff --cached --quiet
  if errorlevel 1 (
    git commit -m "Update FinChat AI Gateway"
    if errorlevel 1 (
      echo ERROR: commit gagal.
      pause
      exit /b 1
    )
  ) else (
    echo Tidak ada perubahan lokal untuk di-commit.
  )

  git pull --rebase origin !BRANCH!
  if errorlevel 1 (
    echo.
    echo ERROR: pull --rebase gagal. Kemungkinan ada konflik.
    echo Selesaikan konflik secara manual lalu jalankan file ini lagi.
    pause
    exit /b 1
  )

  git push origin !BRANCH!
  if errorlevel 1 (
    echo ERROR: push gagal.
    pause
    exit /b 1
  )
)

echo.
echo ==========================================
echo SELESAI
 echo ==========================================
echo Jika ini update, perubahan sudah dipush ke GitHub.
echo Jika ini upload pertama, repository sudah dibuat sebagai Git repository lokal.
pause
