# ==============================================================================
# TrainSME Launcher (Zero-Popup GUI + Maximized Screen + Clean Termination)
# ==============================================================================
param (
    [Parameter(Position=0)]
    [string]$Command,
    [Parameter(Position=1)]
    [string]$SubCommand
)

# 1. Obtener la ruta del proyecto
if ($PSScriptRoot) {
    $ProjectPath = $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
    $ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
    $ProjectPath = [System.AppDomain]::CurrentDomain.BaseDirectory
}

if (-not $ProjectPath) {
    $ProjectPath = (Get-Location).Path
}

Set-Location -LiteralPath $ProjectPath

$LogFile = Join-Path $ProjectPath "trainsme.log"

# API de Windows para conectar con la terminal
if (-not ([System.Management.Automation.PSTypeName]'Win32ConsoleHelper').Type) {
    try {
        Add-Type -TypeDefinition @"
        using System;
        using System.Runtime.InteropServices;
        public class Win32ConsoleHelper {
            [DllImport("kernel32.dll", SetLastError = true)]
            public static extern bool AttachConsole(int dwProcessId);
        }
"@ -ErrorAction SilentlyContinue | Out-Null
    } catch {}
}

# --- MODO COMANDO 'logs' ---
if ($Command -eq "logs" -or $Command -eq "--logs" -or $Command -eq "-l" -or $Command -eq "-f") {
    [void][Win32ConsoleHelper]::AttachConsole(-1)

    $stdOut = [System.Console]::OpenStandardOutput()
    $writer = New-Object System.IO.StreamWriter($stdOut, [System.Text.Encoding]::UTF8)
    $writer.AutoFlush = $true
    [System.Console]::SetOut($writer)

    if ($SubCommand -eq "docker" -or $SubCommand -eq "-d") {
        [System.Console]::WriteLine(">>> Conectando con logs en vivo de Docker Compose (Ctrl + C para salir)...")
        cmd /c "docker compose logs -f"
        [System.Diagnostics.Process]::GetCurrentProcess().Kill()
    }

    if (-not (Test-Path -LiteralPath $LogFile)) {
        [System.Console]::WriteLine("No hay archivo de logs activo en: $LogFile")
        [System.Diagnostics.Process]::GetCurrentProcess().Kill()
    }

    [System.Console]::WriteLine("")
    [System.Console]::WriteLine("==========================================================")
    [System.Console]::WriteLine("        TRAINSME LIVE LOGS (Ctrl + C para salir)         ")
    [System.Console]::WriteLine("==========================================================")
    [System.Console]::WriteLine("")

    $lines = [System.IO.File]::ReadAllLines($LogFile, [System.Text.Encoding]::UTF8)
    $startIdx = [Math]::Max(0, $lines.Length - 30)
    for ($i = $startIdx; $i -lt $lines.Length; $i++) {
        [System.Console]::WriteLine($lines[$i])
    }

    $fs = New-Object System.IO.FileStream($LogFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $fs.Seek(0, [System.IO.SeekOrigin]::End) | Out-Null
    $reader = New-Object System.IO.StreamReader($fs, [System.Text.Encoding]::UTF8)

    while ($true) {
        $line = $reader.ReadLine()
        if ($line -ne $null) {
            [System.Console]::WriteLine($line)
        } else {
            Start-Sleep -Milliseconds 250
        }
    }
    [System.Diagnostics.Process]::GetCurrentProcess().Kill()
}

# Función para escribir logs en disco con UTF-8
function Log-Write ($text) {
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $logLine = "[$timestamp] $text`r`n"
    [System.IO.File]::AppendAllText($LogFile, $logLine, [System.Text.Encoding]::UTF8)
}

# Ejecutor silencioso con codificación UTF-8
function Execute-CommandDetails ($exe, $arguments, $timeoutSeconds = 25) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $exe
    $psi.Arguments = $arguments
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    try {
        $proc = [System.Diagnostics.Process]::Start($psi)
        $stdout = $proc.StandardOutput.ReadToEnd()
        $stderr = $proc.StandardError.ReadToEnd()
        
        if (-not $proc.WaitForExit($timeoutSeconds * 1000)) {
            $proc.Kill()
        }

        return @{
            ExitCode = $proc.ExitCode
            Output = ($stdout + "`n" + $stderr).Trim()
        }
    } catch {
        return @{
            ExitCode = -1
            Output = "EXECUTION_FAILED: $_"
        }
    }
}

# Función para encontrar la ruta real de Docker Desktop
function Find-DockerDesktopPath {
    $candidatePaths = @(
        "C:\Program Files\Docker\Docker\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Programs\DockerDesktop\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Programs\Docker\Docker\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Docker\Docker Desktop.exe"
    )

    foreach ($path in $candidatePaths) {
        if ($path -and (Test-Path -LiteralPath $path)) {
            return $path
        }
    }

    $cmd = Get-Command "Docker Desktop.exe" -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source) {
        return $cmd.Source
    }

    return $null
}

# Comprobación de Docker mediante ExitCode
function Test-DockerReady {
    $res = Execute-CommandDetails "docker" "ps -q" 5
    if ($res.ExitCode -ne 0) {
        return $false
    }
    if ($res.Output -match "failed to connect" -or 
        $res.Output -match "cannot find the file specified" -or 
        $res.Output -match "500 Internal Server Error" -or
        $res.Output -match "EXECUTION_FAILED") {
        return $false
    }
    return $true
}

# Iniciar nuevo bloque de logs
[System.IO.File]::WriteAllText($LogFile, "==========================================================`r`n", [System.Text.Encoding]::UTF8)
Log-Write "Iniciando TrainSME en modo silencioso..."

# Leer puerto (por defecto 80 en Docker)
$FrontendPort = "80"
# $envFile = Join-Path $ProjectPath ".env"
# if (Test-Path -LiteralPath $envFile) {
#     Get-Content -LiteralPath $envFile | ForEach-Object {
#         if ($_ -match "^\s*FRONTEND_PORT\s*=\s*(\d+)") {
#             $FrontendPort = $matches[1]
#         }
#     }
# }
$AppUrl = if ($FrontendPort -eq "80") { "http://127.0.0.1" } else { "http://127.0.0.1:$FrontendPort" }

# 2. Comprobar / Iniciar Docker Desktop
Log-Write "[1/5] Comprobando disponibilidad de Docker..."
$dockerRunning = Test-DockerReady

if (-not $dockerRunning) {
    $dockerExe = Find-DockerDesktopPath
    
    if (-not $dockerExe) {
        Log-Write "  [!] ERROR: No se pudo localizar el ejecutable de Docker Desktop."
        [System.Diagnostics.Process]::GetCurrentProcess().Kill()
    }

    Log-Write "  -> Docker no esta activo. Iniciando Docker Desktop desde: $dockerExe"
    $null = Start-Process -FilePath $dockerExe

    $waited = 0
    $maxWait = 60
    while (-not $dockerRunning -and $waited -lt $maxWait) {
        Start-Sleep -Seconds 2
        $waited += 2
        $dockerRunning = Test-DockerReady
    }

    if (-not $dockerRunning) {
        Log-Write "  [!] ERROR: Docker Desktop tardo demasiado en arrancar."
        [System.Diagnostics.Process]::GetCurrentProcess().Kill()
    }

    Start-Sleep -Seconds 2
}
Log-Write "  -> Docker Engine activo y listo para recibir imagenes."

# 3. Levantar contenedores
Log-Write "[2/5] Levantando contenedores (docker compose up -d)..."
$composeSuccess = $false
$composeRetries = 0
while (-not $composeSuccess -and $composeRetries -lt 3) {
    $res = Execute-CommandDetails "docker" "compose up -d" 30
    Log-Write "  $($res.Output)"

    if ($res.ExitCode -eq 0 -and $res.Output -notmatch "failed to connect" -and $res.Output -notmatch "500 Internal Server Error") {
        $composeSuccess = $true
    } else {
        Log-Write "  -> Esperando estabilizacion de Docker Compose (reintento $composeRetries/3)..."
        Start-Sleep -Seconds 2
        $composeRetries++
    }
}

# 4. Comprobación de puerto mediante Socket TCP
Log-Write "[3/5] Verificando puerto $FrontendPort en 127.0.0.1..."

function Test-PortOpen ($port) {
    $tcp = New-Object System.Net.Sockets.TcpClient
    try {
        $async = $tcp.BeginConnect("127.0.0.1", [int]$port, $null, $null)
        $wait = $async.AsyncWaitHandle.WaitOne(1000, $false)
        if ($wait -and $tcp.Connected) {
            $null = $tcp.EndConnect($async)
            return $true
        }
        return $false
    } catch {
        return $false
    } finally {
        $tcp.Close()
    }
}

$appReady = $false
$retries = 0
while (-not $appReady -and $retries -lt 30) {
    if (Test-PortOpen $FrontendPort) {
        $appReady = $true
    } else {
        Start-Sleep -Seconds 1
        $retries++
    }
}

if (-not $appReady) {
    Log-Write "  [!] ERROR: El puerto $FrontendPort no respondio a tiempo."
    [System.Diagnostics.Process]::GetCurrentProcess().Kill()
}
Log-Write "  -> Servidor web listo en $AppUrl."

# 5. Abrir la aplicación en Pantalla Completa / Maximizada
Log-Write "[4/5] Abriendo ventana de la aplicacion en pantalla completa..."

$browserPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path -LiteralPath $browserPath)) {
    $browserPath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path -LiteralPath $browserPath)) {
    $browserPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

$profileDir = Join-Path $env:LOCALAPPDATA "TrainSME_BrowserProfile"

if (Test-Path -LiteralPath $browserPath) {
    # --start-maximized y -WindowStyle Maximized abren la app ocupando toda la pantalla
    $appArgs = "--app=$AppUrl --user-data-dir=`"$profileDir`" --start-maximized --no-first-run --no-default-browser-check --disable-sync --disable-features=msEdgeSync,msHub --disable-signin-promo"
    
    $appProcess = Start-Process -FilePath $browserPath -ArgumentList $appArgs -WindowStyle Maximized -PassThru
    $null = $appProcess.WaitForExit()
} else {
    $null = Start-Process $AppUrl
}

# 6. Apagado silencioso al cerrar la ventana
Log-Write "[5/5] Ventana cerrada por el usuario. Apagando contenedores..."
$resDown = Execute-CommandDetails "docker" "compose down" 20
Log-Write "  $($resDown.Output)"

# 6.1. Salir de Docker Desktop limpiamente
Log-Write "Ejecutando salida limpia de Docker Desktop (Quit Docker Desktop)..."
$stopRes = Execute-CommandDetails "docker" "desktop stop" 20
Log-Write "  $($stopRes.Output)"


Log-Write "Apagado completado exitosamente. Terminando proceso TrainSME."
# 6.2. Limpiar CUALQUIER proceso residual de TrainSME en segundo plano
Get-Process -Name "TrainSME" -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $PID } | ForEach-Object {
    [void]$_.Kill()
}

# 7. Terminación inmediata del proceso actual
[System.Diagnostics.Process]::GetCurrentProcess().Kill()