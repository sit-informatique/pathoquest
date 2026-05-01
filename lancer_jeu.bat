@echo off
echo ===================================================
echo Lancement du serveur local pour PathoQuest...
echo ===================================================
echo.
echo Veuillez patienter... Une fenetre de navigateur va s'ouvrir.
echo Ne fermez pas cette fenetre noire tant que vous jouez.
echo.

:: Ouvre le navigateur
start http://localhost:8000

:: Lance le serveur Python
python -m http.server 8000

if %errorlevel% neq 0 (
    echo Python n'a pas fonctionne. Essai avec npx...
    start http://localhost:3000
    npx serve .
    if %errorlevel% neq 0 (
        echo.
        echo ERREUR : Impossible de lancer un serveur local.
        echo Solution : Installez l'extension "Live Server" dans VS Code, 
        echo faites un clic droit sur "index.html" et choisissez "Open with Live Server".
        pause
    )
)
