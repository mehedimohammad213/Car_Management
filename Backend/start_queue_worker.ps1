# PowerShell script to start Laravel Queue Worker for Email Notifications
Write-Host "Starting Laravel Queue Worker for Email Notifications..." -ForegroundColor Green
Write-Host ""
Write-Host "This will process email notification jobs in the background." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the worker." -ForegroundColor Yellow
Write-Host ""

# Start the queue worker
& "C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe" artisan queue:work --verbose --tries=3 --timeout=120

Write-Host ""
Write-Host "Queue worker stopped." -ForegroundColor Red
Read-Host "Press Enter to exit"
