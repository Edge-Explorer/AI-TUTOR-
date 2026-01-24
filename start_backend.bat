@echo off
REM Set Ollama environment variable
set OLLAMA_HOST=http://127.0.0.1:11434

echo Starting AI Tutor Backend...
echo OLLAMA_HOST is set to: %OLLAMA_HOST%

cd backend
call ..\venv\Scripts\activate.bat
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
