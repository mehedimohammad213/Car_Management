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
        Schema::table('cars', function (Blueprint $table) {
            $table->string('code', 50)->nullable()->after('ref_no');
            $table->decimal('fob_value_usd', 12, 2)->nullable()->after('price_basis');
            $table->decimal('freight_usd', 12, 2)->nullable()->after('fob_value_usd');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->dropColumn(['code', 'fob_value_usd', 'freight_usd']);
        });
    }
};
