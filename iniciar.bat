@echo off
title VestCasaMoro
color 0A
echo.
echo  =========================================
echo    VestCasaMoro - Iniciando servidor...
echo  =========================================
echo.

:: Verifica se o Node.js esta instalado
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo  ERRO: Node.js nao encontrado!
    echo.
    echo  Instale em: https://nodejs.org
    echo  Baixe a versao LTS e instale normalmente.
    echo.
    pause
    exit /b
)

echo.
echo Atualizando projeto...
git pull

if %errorlevel% neq 0 (
    echo.
    echo ERRO ao atualizar o projeto!
    pause
    exit /b
)

:: Instala dependencias (caso existam novas)
if exist package.json (
    echo.
    echo Verificando dependencias...
    call npm install
)

echo.
echo Iniciando servidor...

:: Inicia o servidor em segundo plano
start "VestCasaMoro Servidor" /min node "%~dp0server.js"

:: Aguarda 2 segundos para o servidor subir
timeout /t 2 /nobreak > nul

:: Abre o painel admin no navegador
start "" "http://localhost:4321/admin.html"

echo  Servidor iniciado com sucesso!
echo.
echo  Painel Admin: http://localhost:4321/admin.html
echo  Site:         http://localhost:4321
echo.
echo  Para ENCERRAR o servidor, feche a janela
echo  minimizada na barra de tarefas.
echo.
pause
