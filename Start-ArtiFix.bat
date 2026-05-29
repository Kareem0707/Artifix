@echo off
echo Starting ArtiFix local server...
start cmd /k "npm run dev"
timeout /t 5 /nobreak
start http://localhost:3000
