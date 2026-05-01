@echo off
echo ================================================
echo  PathoQuest - Copie des images Phase 1
echo ================================================
echo.

set "SRC=C:\Users\user\.gemini\antigravity\brain\95d4efcd-8f12-44cd-90f5-0475ac9bc068"
set "DEST=C:\Users\user\Desktop\rahma\pathoquest\assets"

echo Copie de l'image Phase 1 (Sain)...
copy "%SRC%\media__1777488591670.jpg" "%DEST%\phase1_sain.jpg" /Y
if %errorlevel%==0 (
    echo [OK] phase1_sain.jpg copie avec succes !
) else (
    echo [ERREUR] Impossible de copier phase1_sain.jpg
)

echo.
echo Copie de l'image Phase 1 (Tumoral)...
copy "%SRC%\media__1777488591762.jpg" "%DEST%\phase1_tumoral.jpg" /Y
if %errorlevel%==0 (
    echo [OK] phase1_tumoral.jpg copie avec succes !
) else (
    echo [ERREUR] Impossible de copier phase1_tumoral.jpg
)

echo.
echo ================================================
echo  Terminé ! Rafraîchissez votre navigateur (F5)
echo ================================================
echo.
pause
