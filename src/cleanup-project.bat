@echo off
REM Cleanup script - remove all documentation and test files
REM Keep only essential files for production

echo 🗑️  Starting project cleanup...
echo.

REM Remove all .md files except README.md
for %%f in (*.md) do (
    if not "%%f"=="README.md" (
        del "%%f"
    )
)

REM Remove all .txt files
del *.txt 2>nul

REM Remove all test .html files (keep index.html)
for %%f in (*.html) do (
    if not "%%f"=="index.html" (
        del "%%f"
    )
)

REM Remove test HTML files in public
cd public
for %%f in (*.html) do (
    if not "%%f"=="offline.html" (
        del "%%f"
    )
)
cd ..

REM Remove all .bat scripts except this one
for %%f in (*.bat) do (
    if not "%%f"=="cleanup-project.bat" (
        del "%%f"
    )
)

REM Remove all .sh scripts
del *.sh 2>nul

REM Remove test files
del /S utils\*.test.ts 2>nul
del /S components\*.test.tsx 2>nul
del /S *.spec.ts 2>nul

REM Remove e2e folder
rmdir /S /Q e2e 2>nul

REM Remove workflows folder
rmdir /S /Q workflows 2>nul

REM Remove data documentation
del data\DATABASE_USAGE.md 2>nul
del data\README.txt 2>nul

REM Remove scripts documentation
del scripts\README.md 2>nul

echo.
echo ✅ Cleanup complete!
echo.
echo 📊 Kept:
echo   - README.md
echo   - guidelines/Guidelines.md
echo   - index.html
echo   - All source code (.tsx, .ts, .css files)
echo   - Configuration files (package.json, tsconfig.json, etc.)
echo.
echo 🗑️  Removed:
echo   - All documentation .md files (except README.md)
echo   - All .txt files
echo   - All test .html files
echo   - All .bat/.sh scripts
echo   - All test files (.test.ts, .test.tsx, .spec.ts)
echo   - e2e/ folder
echo   - workflows/ folder
echo.
pause
