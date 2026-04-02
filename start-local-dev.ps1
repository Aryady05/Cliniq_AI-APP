$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendScript = Join-Path $repoRoot "start-backend.ps1"
$frontendScript = Join-Path $repoRoot "start-frontend.ps1"

if (-not (Test-Path $backendScript)) {
    Write-Error "Missing start-backend.ps1"
}

if (-not (Test-Path $frontendScript)) {
    Write-Error "Missing start-frontend.ps1"
}

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $backendScript
)

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $frontendScript
)

Write-Host "Started backend and frontend in separate PowerShell windows."
