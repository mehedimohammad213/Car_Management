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
        Schema::create('purchase_history', function (Blueprint $table) {
            $table->id();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_amount', 15, 2)->nullable();
            $table->string('govt_duty')->nullable();
            $table->decimal('cnf_amount', 15, 2)->nullable();
            $table->string('miscellaneous')->nullable();
            $table->date('lc_date')->nullable();
            $table->string('lc_number')->nullable();
            $table->string('lc_bank_name')->nullable();
            $table->string('lc_bank_branch_name')->nullable();
            $table->string('lc_bank_branch_address')->nullable();
            $table->string('total_units_per_lc')->nullable();
            $table->string('bill_of_lading')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('export_certificate')->nullable();
            $table->string('export_certificate_translated')->nullable();
            $table->string('bill_of_exchange_amount')->nullable();
            $table->string('custom_duty_copy_3pages')->nullable();
            $table->string('cheque_copy')->nullable();
            $table->string('certificate')->nullable();
            $table->string('custom_one')->nullable();
            $table->string('custom_two')->nullable();
            $table->string('custom_three')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_history');
    }
};
