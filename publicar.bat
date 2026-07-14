@echo off
title Publicar VestCasaMoro
color 0A
echo.
echo  =========================================
echo    VestCasaMoro - Publicando site...
echo  =========================================
echo.

cd /d "%~dp0"

git add .
git commit -m "atualizar produtos e imagens"
git push

echo.
echo  =========================================
echo    Pronto! Site atualizado em ~1 minuto.
echo    https://vestcasamoro.vercel.app
echo  =========================================
echo.
pause
