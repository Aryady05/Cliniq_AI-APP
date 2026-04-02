$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot "apps\backend"
$pythonExe = Join-Path $backendDir ".venv313\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
    Write-Error "Backend venv not found at apps\backend\.venv313. Create it first or ask me to recreate it."
}

Push-Location $backendDir
try {
    & $pythonExe -m uvicorn app.main:app --reload
}
finally {
    Pop-Location
}
