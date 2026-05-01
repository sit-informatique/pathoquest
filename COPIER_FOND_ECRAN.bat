@echo off
echo ================================================
echo  PathoQuest - Copie des photos fond d'ecran
echo ================================================
echo.

set "BRAIN=C:\Users\user\.gemini\antigravity\brain\95d4efcd-8f12-44cd-90f5-0475ac9bc068"
set "DEST=C:\Users\user\Desktop\rahma\pathoquest\assets"

echo Recherche des 2 nouvelles photos envoyees...
echo.

REM Copier les 2 photos les plus recentes du dossier brain
set "COUNT=0"
for /f "delims=" %%F in ('dir /b /o-d "%BRAIN%\media__*.jpg" 2^>nul') do (
    if !COUNT!==0 (
        echo Copie de "%%F" vers lab_bg2.jpg
        copy "%BRAIN%\%%F" "%DEST%\lab_bg2.jpg" /Y
        set /a COUNT+=1
    ) else if !COUNT!==1 (
        echo Copie de "%%F" vers lab_bg1.jpg
        copy "%BRAIN%\%%F" "%DEST%\lab_bg1.jpg" /Y
        set /a COUNT+=1
    )
    if !COUNT!==2 goto done
)

:done
echo.
if %COUNT%==2 (
    echo [OK] Les 2 photos ont ete copiees avec succes !
    echo  - assets\lab_bg1.jpg
    echo  - assets\lab_bg2.jpg
) else (
    echo [ERREUR] Seulement %COUNT% photo(s) trouvee(s).
    echo Verifiez que les photos ont bien ete envoyees dans le chat.
)

echo.
echo Rafraichissez votre navigateur (F5)
echo ================================================
pause
