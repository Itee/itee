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

echo Creation du raccourci pour le script de lancement du serveur web dans le dossier Startup...

set CurrentDirectory=%cd%
set ScriptWebserver="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
set StartupScript="%CurrentDirectory%\services\start_webserver.cmd"
set StartupScriptLink="C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\start_webserver.lnk"
if not exist %StartupScriptLink% (
	echo Set oWS = WScript.CreateObject("WScript.Shell"^) >> %ScriptWebserver%
    echo sLinkFile = %StartupScriptLink% >> %ScriptWebserver%
    echo Set oLink = oWS.CreateShortcut(sLinkFile^) >> %ScriptWebserver%
    echo oLink.TargetPath = %StartupScript% >> %ScriptWebserver%
    echo oLink.WorkingDirectory = "%CurrentDirectory%" >> %ScriptWebserver%
    echo oLink.Description = "Lance le script start_webserver.cmd au demarrage de windows, pour lancer le serveur web." >> %ScriptWebserver%
    echo oLink.WindowStyle = "1" >> %ScriptWebserver%
    echo oLink.Save >> %ScriptWebserver%
    cscript /nologo %ScriptWebserver%
    del %ScriptWebserver%
    echo Fin de l'installation des services pour le lancement du serveur web !
) else (
    echo Le raccourci pour le script de lancement du serveur web dans le dossier Startup exist deja !
)

timeout 3
echo L'ordinateur va redemarrer...
shutdown /r /c "Restart pour lancement et mise a jours des services web et base de donnees..." /t 10
