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
        Schema::table('purchase_history', function (Blueprint $table) {
            if (! Schema::hasColumn('purchase_history', 'hs_code')) {
                $table->string('hs_code', 64)->nullable()->after('miscellaneous');
            }
            if (! Schema::hasColumn('purchase_history', 'price_amount')) {
                $table->decimal('price_amount', 15, 2)->nullable()->after('hs_code');
            }
            if (! Schema::hasColumn('purchase_history', 'price_basis')) {
                $table->string('price_basis', 64)->nullable()->after('price_amount');
            }
            if (! Schema::hasColumn('purchase_history', 'fob_value_usd')) {
                $table->decimal('fob_value_usd', 15, 2)->nullable()->after('price_basis');
            }
            if (! Schema::hasColumn('purchase_history', 'freight_usd')) {
                $table->decimal('freight_usd', 15, 2)->nullable()->after('fob_value_usd');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_history', function (Blueprint $table) {
            $columns = ['hs_code', 'price_amount', 'price_basis', 'fob_value_usd', 'freight_usd'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('purchase_history', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
