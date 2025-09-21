<?php

namespace App\Jobs;

use App\Models\Stock;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendStockUpdateNotification implements ShouldQueue
{
    use Queueable;

    public $timeout = 120; // 2 minutes timeout
    public $tries = 3; // Retry 3 times

    protected $stock;
    protected $updatedFields;

    /**
     * Create a new job instance.
     */
    public function __construct(Stock $stock, array $updatedFields = [])
    {
        $this->stock = $stock;
        $this->updatedFields = $updatedFields;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Load the stock with car details
            $this->stock->load(['car.category', 'car.subcategory', 'car.photos']);
            
            // Get all users who should be notified
            $users = User::whereNotNull('email')->get();
            
            if ($users->isEmpty()) {
                Log::info('No users found to notify about stock update', [
                    'stock_id' => $this->stock->id
                ]);
                return;
            }

            // Send email to each user
            foreach ($users as $user) {
                try {
                    Mail::send('emails.stock-update', [
                        'user' => $user,
                        'stock' => $this->stock,
                        'updatedFields' => $this->updatedFields,
                        'car' => $this->stock->car
                    ], function ($message) use ($user) {
                        $message->to($user->email, $user->name)
                                ->subject('Stock Update Notification - ' . $this->stock->car->make . ' ' . $this->stock->car->model);
                    });
                    
                    Log::info('Stock update notification sent', [
                        'user_id' => $user->id,
                        'user_email' => $user->email,
                        'stock_id' => $this->stock->id
                    ]);
                    
                } catch (\Exception $e) {
                    Log::error('Failed to send stock update notification to user', [
                        'user_id' => $user->id,
                        'user_email' => $user->email,
                        'stock_id' => $this->stock->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }
            
            Log::info('Stock update notifications completed', [
                'stock_id' => $this->stock->id,
                'users_notified' => $users->count()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Stock update notification job failed', [
                'stock_id' => $this->stock->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw the exception to trigger retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Stock update notification job failed permanently', [
            'stock_id' => $this->stock->id,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}
