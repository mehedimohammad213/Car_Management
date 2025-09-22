@echo off
echo Starting Laravel Queue Worker for Email Notifications...
echo.
echo This will process email notification jobs in the background.
echo Press Ctrl+C to stop the worker.
echo.

C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan queue:work --verbose --tries=3 --timeout=120

pause
