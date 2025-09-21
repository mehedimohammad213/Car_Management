<?php

namespace App\Console\Commands;

use App\Models\Stock;
use App\Jobs\SendStockUpdateNotification;
use Illuminate\Console\Command;

class TestStockEmailNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:stock-email {stock_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test stock update email notification system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $stockId = $this->argument('stock_id');
        
        if ($stockId) {
            $stock = Stock::with(['car.category', 'car.subcategory', 'car.photos'])->find($stockId);
            if (!$stock) {
                $this->error("Stock with ID {$stockId} not found.");
                return 1;
            }
        } else {
            $stock = Stock::with(['car.category', 'car.subcategory', 'car.photos'])->first();
            if (!$stock) {
                $this->error("No stocks found in database.");
                return 1;
            }
        }

        $this->info("Testing email notification for stock ID: {$stock->id}");
        $this->info("Car: {$stock->car->make} {$stock->car->model}");

        // Simulate some updated fields
        $updatedFields = [
            'quantity' => $stock->quantity,
            'status' => $stock->status,
            'price' => $stock->price
        ];

        try {
            // Dispatch the job
            SendStockUpdateNotification::dispatch($stock, $updatedFields);
            
            $this->info("✅ Email notification job dispatched successfully!");
            $this->info("Check the logs for email sending status.");
            $this->info("To process the queue, run: php artisan queue:work");
            
        } catch (\Exception $e) {
            $this->error("❌ Failed to dispatch email notification job: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
