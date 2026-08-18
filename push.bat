@echo off
REM ===================================================================
REM ELETRICA ROCAR - push.bat
REM Envia as alteracoes commitadas localmente para o GitHub (branch
REM atual). Rode este arquivo com duplo clique ou "push.bat" no
REM terminal, dentro da pasta do projeto.
REM ===================================================================

echo.
echo === Elétrica Rocar: enviando alterações para o GitHub ===
echo.

git push origin main

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [ERRO] O push falhou. Verifique sua conexão, login do Git/GitHub
  echo        e se há commits pendentes de "git pull" antes de tentar de novo.
  pause
  exit /b 1
)

echo.
echo === Push concluído com sucesso! ===
echo.
pause
