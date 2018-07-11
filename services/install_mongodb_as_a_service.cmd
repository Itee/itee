:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::                                                                                       ::
::   Copyright (c) 2016                                                                  ::
::   All rights reserved.                                                                ::
::                                                                                       ::
::    Redistribution and use in source and binary forms, with or without modification,   ::
::    are permitted provided that the following conditions are met:                      ::
::                                                                                       ::
::    - Redistributions of source code must retain the above copyright notice, this      ::
::      list of conditions and the following disclaimer.                                 ::
::    - Redistributions in binary form must reproduce the above copyright notice, this   ::
::      list of conditions and the following disclaimer in the documentation and/or      ::
::      other materials provided with the distribution.                                  ::
::    - Neither the name the names of its contributors may be                            ::
::      used to endorse or promote products derived from this software without           ::
::      specific prior written permission.                                               ::
::                                                                                       ::
::    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND    ::
::    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED      ::
::    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE             ::
::    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR   ::
::    ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES     ::
::    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;       ::
::    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON     ::
::    ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT            ::
::    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS      ::
::    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.                       ::
::                                                                                       ::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::                                                              ::
::    This script allow to create folder and install MongoDB    ::
::    service.                                                  ::
::    Then set start_webserver.cmd script as startup service    ::
::    for running this server on window launch.                 ::
::    Finally it will restart computer.                         ::
::                                                              ::
::    Author: Valcke Tristan                                    ::
::    Mail: valcke.tristan@gmail.com                            ::
::    Script version: 1.0.4                                     ::
::                                                              ::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
IF '%PROCESSOR_ARCHITECTURE%' EQU 'amd64' (
   >nul 2>&1 "%SYSTEMROOT%\SysWOW64\icacls.exe" "%SYSTEMROOT%\SysWOW64\config"
 ) ELSE (
   >nul 2>&1 "%SYSTEMROOT%\system32\icacls.exe" "%SYSTEMROOT%\system32\config"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"=""
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------


echo Initialisation du service MongoDB...

REM TODO Search for mongodb path !
set MongoDBExecutablePath=""
set /p MongoDBExecutablePath= Ou se trouve le fichier mongod.exe ? (Defaut: C:\Program Files\MongoDB\Server\3.4\bin):
if %MongoDBExecutablePath%=="" (
    set MongoDBExecutablePath=C:\Program Files\MongoDB\Server\3.4\bin
)
echo MongoDBExecutablePath: %MongoDBExecutablePath%

set MongoDBBasePath=""
set /p MongoDBBasePath= Ou voulez-vous stocker les donnees ? (Defaut: C:\data):
if %MongoDBBasePath%=="" (
    set MongoDBBasePath=C:\data
)

timeout 3
if not exist %MongoDBBasePath% (
    echo Creation du dossier %MongoDBBasePath% pour MongoDB
    mkdir %MongoDBBasePath%
) else (
    echo Le dossier %MongoDBBasePath% existe deja...
)

timeout 3
set MongoDBFolderDBPath=%MongoDBBasePath%\db
if not exist %MongoDBFolderDBPath% (
    echo Creation du dossier %MongoDBFolderDBPath% pour MongoDB
    mkdir %MongoDBFolderDBPath%
) else (
    echo Le dossier %MongoDBFolderDBPath% existe deja...
)

timeout 3
set MongoDBFolderLogPath=%MongoDBBasePath%\log
if not exist %MongoDBFolderLogPath% (
    echo Creation du dossier %MongoDBFolderLogPath% pour MongoDB
    mkdir %MongoDBFolderLogPath%
) else (
    echo Le dossier %MongoDBFolderLogPath% existe deja...
)

timeout 3
set MongoDBConfigFile="%MongoDBExecutablePath%\mongod.cfg"
if not exist %MongoDBConfigFile% (

    echo Creation du fichier de configuration de MongoDB...
    echo systemLog:> %MongoDBConfigFile%
    echo   destination: file>> %MongoDBConfigFile%
    echo   path: %MongoDBFolderLogPath%\mongod.log>> %MongoDBConfigFile%
    echo storage:>> %MongoDBConfigFile%
    echo   dbPath: %MongoDBFolderDBPath%>> %MongoDBConfigFile%

) else (
    echo Le fichier de configuration %MongoDBConfigFile% de MongoDB existe deja...
)

timeout 3
echo Installation du service MongoDB...
sc query mongodb > nul
if %errorlevel% EQU 1060 (

    "%MongoDBExecutablePath%\mongod.exe" --config %MongoDBConfigFile% --install

) else (
    echo Le service MongoDB existe deja...
)

timeout 3
echo Lancement du service MongoDB...
sc query mongodb | findstr "STATE" | findstr /C:"RUNNING" > nul
if %errorlevel% EQU 1 (

    net start MongoDB

) else (
    echo Le service MongoDB est deja lancé...
)
echo Fin de l'installation du service MongoDB !
