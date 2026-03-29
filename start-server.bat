@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "NODE_EXE="

for %%I in (node.exe) do set "NODE_EXE=%%~$PATH:I"

if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LocalAppData%\Programs\nodejs\node.exe" set "NODE_EXE=%LocalAppData%\Programs\nodejs\node.exe"

if defined NODE_EXE (
  "%NODE_EXE%" "%SCRIPT_DIR%server.js"
  goto :eof
)

echo Node.js introuvable. Bascule sur le serveur PowerShell de secours...
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-server.ps1"
