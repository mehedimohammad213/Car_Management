# Stock Update Email Notifications

This system automatically sends email notifications to all users when stock is updated. The emails are sent asynchronously using Laravel's queue system, so the API response is not delayed.

## How It Works

1. **Stock Update**: When a stock is updated via the API
2. **Job Dispatch**: An email notification job is dispatched to the queue
3. **Immediate Response**: The API returns success immediately (doesn't wait for emails)
4. **Background Processing**: Queue workers process the email job in the background
5. **Email Delivery**: All users receive a beautifully formatted email with stock details

## Features

- ✅ **Asynchronous Processing**: No delay in API responses
- ✅ **Queue-based**: Reliable email delivery with retry mechanism
- ✅ **Beautiful Email Template**: Professional HTML email design
- ✅ **Comprehensive Details**: Car information, stock details, and recent updates
- ✅ **Error Handling**: Robust error handling and logging
- ✅ **Retry Logic**: Failed emails are retried automatically

## Setup Instructions

### 1. Queue Configuration

The system uses Laravel's database queue driver by default. Make sure your `.env` file has:

```env
QUEUE_CONNECTION=database
```

### 2. Mail Configuration

For testing, emails are logged to `storage/logs/laravel.log`. For production, configure your mail settings:

```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="CarSelling System"
```

### 3. Run Migrations

The jobs table migration should already be run. If not:

```bash
php artisan migrate
```

### 4. Start Queue Worker

To process email jobs, run the queue worker:

```bash
php artisan queue:work
```

For production, use a process manager like Supervisor to keep the worker running.

## Testing

### Test Email Notifications

```bash
# Test with any stock
php artisan test:stock-email

# Test with specific stock ID
php artisan test:stock-email 1
```

### Check Queue Status

```bash
# View pending jobs
php artisan queue:monitor

# View failed jobs
php artisan queue:failed
```

## API Usage

### Update Stock (triggers email notifications)

```http
POST /api/stocks/{id}
Content-Type: application/json
Authorization: Bearer {token}

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
            "id": 1,
            "make": "Toyota",
            "model": "Camry",
            "year": 2023,
            "category": {
                "name": "Sedan"
            },
            "photos": [...]
        }
    },
    "message": "Stock updated successfully"
}
```

## Email Template

The email includes:

- **Car Details**: Make, model, year, category
- **Stock Information**: Quantity, price, status
- **Recent Updates**: What fields were changed
- **Car Images**: Primary car photo
- **Call-to-Action**: Link to view car details

## Monitoring

### Logs

Check the application logs for email processing status:

```bash
tail -f storage/logs/laravel.log
```

### Queue Monitoring

Monitor queue performance:

```bash
# View queue statistics
php artisan queue:monitor

# Retry failed jobs
php artisan queue:retry all
```

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check mail configuration and queue worker status
2. **Jobs failing**: Check logs for error details
3. **Queue not processing**: Ensure queue worker is running

### Debug Commands

```bash
# Test email configuration
php artisan tinker
>>> Mail::raw('Test email', function($msg) { $msg->to('test@example.com')->subject('Test'); });

# Check queue jobs
php artisan tinker
>>> DB::table('jobs')->get();

# Process a single job
php artisan queue:work --once
```

## Production Considerations

1. **Use Supervisor**: Keep queue workers running
2. **Monitor Queue**: Set up monitoring for queue health
3. **Email Limits**: Consider rate limiting for large user bases
4. **Error Handling**: Set up alerts for failed jobs
5. **Database Optimization**: Index the jobs table for better performance

## File Structure

```
app/
├── Jobs/
│   └── SendStockUpdateNotification.php
├── Http/Controllers/Api/Stock/
│   └── StockController.php
└── Console/Commands/
    └── TestStockEmailNotification.php

resources/views/emails/
└── stock-update.blade.php

database/migrations/
└── 0001_01_01_000002_create_jobs_table.php
```

## Security Notes

- Email addresses are validated before sending
- Failed email attempts are logged but don't expose sensitive data
- Queue jobs are processed securely in the background
- No user data is exposed in error messages
