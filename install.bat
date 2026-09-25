@echo off
chcp 65001 > nul
title Installation av EDA Toolbox (PRO)

echo ======================================================================
echo          EDA Toolbox - Installation och Byggskript för Dator
echo ======================================================================
echo.

:: 1. Kontrollera Node.js
echo [1/4] Kontrollerar Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [FEL] Node.js hittades inte på datorn!
    echo Vänligen installera Node.js (version 20 LTS rekommenderas):
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo   Hittade Node.js: %NODE_VER%

:: 2. Installera beroenden
echo.
echo [2/4] Installerar nödvändiga paket och bibliotek via npm...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [VARNING] npm install stötte på ett problem. Försöker med --legacy-peer-deps...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [FEL] Kunde inte installera beroenden.
        pause
        exit /b 1
    )
)
echo   Samtliga paket installerades korrekt!

:: 3. Bygg applikationen för produktion
echo.
echo [3/4] Kompilerar och bygger applikationen (TypeScript + Vite)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [FEL] Bygget misslyckades. Kör 'npm run lint' för att kontrollera syntaxfel.
    pause
    exit /b 1
)
echo   Produktionsbygget i /dist är klart!

:: 4. Klart!
echo.
echo ======================================================================
echo   EDA Toolbox har installerats framgångsrikt på din dator!
echo ======================================================================
echo.
echo Hur vill du starta applikationen nu?
echo   [1] Starta utvecklingsserver (npm run dev på port 3000)
echo   [2] Starta produktionsförhandsgranskning (npm run preview på port 4173)
echo   [3] Avsluta installationsskriptet
echo.

set /p CHOICE="Välj ett alternativ (1, 2 eller 3): "

if "%CHOICE%"=="1" (
    echo Startar utvecklingsserver...
    call npm run dev
) else if "%CHOICE%"=="2" (
    echo Startar produktionsserver...
    call npm run preview
) else (
    echo Klart! Du kan starta appen när som helst med 'npm run dev' eller genom att dubbelklicka på run.bat.
)

pause
