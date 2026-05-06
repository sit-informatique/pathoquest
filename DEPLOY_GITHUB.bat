@echo off
echo ========================================================
echo Miseen ligne de PathoQuest sur GitHub (Deploiement web)
echo ========================================================
echo.

git add .
git commit -m "Mise à jour : Gestion des étudiants, suppression et bilans détaillés"
git push origin main

echo.
echo ========================================================
echo Termine ! Vos modifications sont en route vers GitHub.
echo Le site sera mis a jour dans quelques minutes.
echo ========================================================
pause
