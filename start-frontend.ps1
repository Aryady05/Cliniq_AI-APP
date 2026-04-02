$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot "apps\frontend"
$nodeModulesDir = Join-Path $frontendDir "node_modules"

Push-Location $frontendDir
try {
    if (-not (Test-Path $nodeModulesDir)) {
        Write-Host "Installing frontend dependencies..."
        npm install
    }

    npm run dev
}
finally {
    Pop-Location
}
