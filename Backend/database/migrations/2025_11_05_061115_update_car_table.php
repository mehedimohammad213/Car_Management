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
            $table->string('package', 255)->nullable()->after('status');
            $table->string('body', 64)->nullable()->after('package');
            $table->string('type', 64)->nullable()->after('body');
            $table->string('engine_number', 64)->nullable()->after('type');
            $table->integer('number_of_keys')->nullable()->after('engine_number');
            $table->string('keys_feature')->nullable()->after('number_of_keys');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->dropColumn([
                'package',
                'body',
                'type',
                'engine_number',
                'number_of_keys',
                'keys_feature'
            ]);
        });
    }
};
