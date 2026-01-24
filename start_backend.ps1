# Refresh environment variables from registry
$env:OLLAMA_HOST = [System.Environment]::GetEnvironmentVariable('OLLAMA_HOST', 'User')

# If not set in User variables, use default
if (-not $env:OLLAMA_HOST) {
    $env:OLLAMA_HOST = "http://127.0.0.1:11434"
}

Write-Host "Starting AI Tutor Backend..." -ForegroundColor Green
Write-Host "OLLAMA_HOST is set to: $env:OLLAMA_HOST" -ForegroundColor Cyan

Set-Location backend
& ..\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
