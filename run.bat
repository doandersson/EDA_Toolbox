@echo off
chcp 65001 > nul
title Starta EDA Toolbox

echo Startar EDA Toolbox på din dator...
echo Öppna webbläsaren på http://localhost:3000
echo Tryck Ctrl + C i detta fönster för att stoppa.
echo.

call npm run dev
pause
