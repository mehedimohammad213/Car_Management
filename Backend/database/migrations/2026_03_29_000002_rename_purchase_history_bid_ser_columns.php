<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * If an older migration already created *_yen columns, rename them to bid_price / ser_com.
     */
    public function up(): void
    {
        if (Schema::hasColumn('purchase_history', 'bid_price_yen')
            && ! Schema::hasColumn('purchase_history', 'bid_price')) {
            Schema::table('purchase_history', function (Blueprint $table) {
                $table->renameColumn('bid_price_yen', 'bid_price');
            });
        }
        if (Schema::hasColumn('purchase_history', 'ser_com_yen')
            && ! Schema::hasColumn('purchase_history', 'ser_com')) {
            Schema::table('purchase_history', function (Blueprint $table) {
                $table->renameColumn('ser_com_yen', 'ser_com');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('purchase_history', 'bid_price')
            && ! Schema::hasColumn('purchase_history', 'bid_price_yen')) {
            Schema::table('purchase_history', function (Blueprint $table) {
                $table->renameColumn('bid_price', 'bid_price_yen');
            });
        }
        if (Schema::hasColumn('purchase_history', 'ser_com')
            && ! Schema::hasColumn('purchase_history', 'ser_com_yen')) {
            Schema::table('purchase_history', function (Blueprint $table) {
                $table->renameColumn('ser_com', 'ser_com_yen');
            });
        }
    }
};
