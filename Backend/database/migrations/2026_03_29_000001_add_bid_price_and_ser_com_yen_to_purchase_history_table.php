<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_history', function (Blueprint $table) {
            $table->decimal('bid_price', 18, 2)->nullable()->after('miscellaneous');
            $table->decimal('ser_com', 18, 2)->nullable()->after('bid_price');
        });
    }

    public function down(): void
    {
        Schema::table('purchase_history', function (Blueprint $table) {
            $table->dropColumn(['bid_price', 'ser_com']);
        });
    }
};
