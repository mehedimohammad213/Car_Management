<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_history', function (Blueprint $table) {
            $table->id();
            
            // Car information
            $table->foreignId('car_id')->nullable()->constrained('cars')->onDelete('set null');
            
            // Wholesaler information
            $table->string('showroom_name')->nullable();
            $table->string('wholesaler_address')->nullable();
            $table->decimal('purchase_amount', 15, 2)->nullable();
            $table->date('purchase_date')->nullable();
            
            // Customer information
            $table->string('nid_number')->nullable();
            $table->string('tin_certificate')->nullable();
            $table->string('customer_address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_history');
    }
};
