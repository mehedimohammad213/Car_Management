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
            $table->decimal('foreign_amount', 15, 2)->nullable()->after('purchase_amount');
            $table->decimal('bdt_amount', 15, 2)->nullable()->after('foreign_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_history', function (Blueprint $table) {
            $table->dropColumn(['foreign_amount', 'bdt_amount']);
        });
    }
};
