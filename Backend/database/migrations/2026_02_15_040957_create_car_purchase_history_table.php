<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('car_purchase_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');
            $table->foreignId('purchase_history_id')->constrained('purchase_history')->onDelete('cascade');
            $table->timestamps();
        });

        // Migrate existing data
        $existingData = DB::table('purchase_history')->whereNotNull('car_id')->get();
        foreach ($existingData as $row) {
            DB::table('car_purchase_history')->insert([
                'car_id' => $row->car_id,
                'purchase_history_id' => $row->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Drop old car_id column (optional but recommended)
        Schema::table('purchase_history', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->dropColumn('car_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_history', function (Blueprint $table) {
            $table->foreignId('car_id')
                ->nullable()
                ->after('id')
                ->constrained('cars')
                ->nullOnDelete();
        });

        // Restore data (optional and complex, skipping for simplicity in dev)

        Schema::dropIfExists('car_purchase_history');
    }
};
