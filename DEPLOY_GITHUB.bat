@echo off
echo ========================================================
echo Miseen ligne de PathoQuest sur GitHub (Deploiement web)
echo ========================================================
echo.

git add .
git commit -m "Integration de toutes les images reelles (Niveaux 1, 2, 4) et MAJ du contexte"
git push origin main

echo.
echo ========================================================
echo Termine ! Vos modifications sont en route vers GitHub.
echo Le site sera mis a jour dans quelques minutes.
echo ========================================================
pause
