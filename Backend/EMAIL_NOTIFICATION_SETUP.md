# Email Notification System Setup Guide

## Overview
The Car Management System now sends real email notifications to all users when stock is updated, even without admin privileges. The system uses Gmail SMTP for reliable email delivery.

## Current Configuration
- **Mail Driver**: SMTP (Gmail)
- **SMTP Host**: smtp.gmail.com
- **Port**: 587 (TLS)
- **From Address**: risalat9744@gmail.com
- **Queue System**: Database-driven with automatic retry

## How It Works

### 1. Stock Update Process
- Any user can update stock via the API endpoint: `PUT /api/stocks/{stock}`
- No authentication required (stock routes are public)
- When stock is updated, an email notification job is automatically dispatched
- The API responds immediately without waiting for emails to be sent

### 2. Email Notification Flow
1. Stock update triggers `SendStockUpdateNotification` job
2. Job is queued in the database
3. Queue worker processes the job in the background
4. Email is sent to all users with valid email addresses
5. Job is marked as completed or retried on failure

### 3. Email Content
Each email includes:
- Car details (make, model, year, etc.)
- Stock information (quantity, price, status)
- Recent updates made to the stock
- Car photos (if available)
- Link to view car details

## Setup Instructions

### 1. Start the Queue Worker
To process email notifications, you need to run the queue worker:

**Option A: Using Batch File**
```bash
# Double-click the file or run from command prompt
start_queue_worker.bat
```

**Option B: Using PowerShell**
```powershell
# Run in PowerShell
.\start_queue_worker.ps1
```

**Option C: Manual Command**
```bash
C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan queue:work --verbose --tries=3 --timeout=120
```

### 2. Keep Queue Worker Running
For production use, you should:
- Run the queue worker as a Windows service
- Use a process manager like Supervisor (on Linux)
- Or run it in a screen/tmux session

### 3. Test the System
```bash
# Test email notification
C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan test:stock-email

# Process the test job
C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan queue:work --once
```

## API Usage

### Update Stock (Triggers Email Notification)
```http
PUT /api/stocks/{stock_id}
Content-Type: application/json

{
    "quantity": 5,
    "price": 25000.00,
    "status": "available",
    "notes": "Updated stock information"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "car_id": 1,
        "quantity": 5,
        "price": 25000.00,
        "status": "available",
        "notes": "Updated stock information",
        "car": {
            "make": "Ferrari",
            "model": "488",
            "year": 2020
        }
    },
    "message": "Stock updated successfully"
}
```

## Monitoring and Troubleshooting

### Check Queue Status
```bash
# View failed jobs
C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan queue:failed

# Retry failed jobs
C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan queue:retry all

# Clear failed jobs
C:\laragon\bin\php\php-8.3.24-nts-Win32-vs16-x64\php.exe artisan queue:flush
```

### Check Logs
```bash
# View application logs
tail -f storage/logs/laravel.log
```

### Common Issues

1. **Emails not being sent**
   - Check if queue worker is running
   - Verify Gmail SMTP credentials
   - Check firewall/network connectivity

2. **Queue jobs failing**
   - Check database connection
   - Verify email template exists
   - Check user email addresses are valid

3. **PHP extension errors**
   - Use PHP 8.3.24 (included in Laragon)
   - Ensure mbstring extension is enabled

## Security Notes

- Stock update endpoints are public (no authentication required)
- Email notifications are sent to all users with valid email addresses
- Gmail app password is used for SMTP authentication
- Failed jobs are logged for debugging

## Production Recommendations

1. **Use a dedicated email service** (SendGrid, Mailgun, etc.) instead of Gmail
2. **Set up proper queue monitoring** with tools like Laravel Horizon
3. **Implement rate limiting** to prevent spam
4. **Add user preferences** for email notifications
5. **Use environment-specific email templates**

## Support

If you encounter issues:
1. Check the logs in `storage/logs/laravel.log`
2. Verify queue worker is running
3. Test email configuration with the test command
4. Ensure database is accessible and migrations are run
