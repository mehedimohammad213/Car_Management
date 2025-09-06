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
            // Update reg_year_month from char(7) to varchar(10)
            $table->string('reg_year_month', 10)->nullable()->change();

            // Update grade_exterior from char(1) to varchar(32)
            $table->string('grade_exterior', 32)->nullable()->change();

            // Update grade_interior from char(1) to varchar(32)
            $table->string('grade_interior', 32)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            // Revert reg_year_month back to char(7)
            $table->char('reg_year_month', 7)->nullable()->change();

            // Revert grade_exterior back to char(1)
            $table->char('grade_exterior', 1)->nullable()->change();

            // Revert grade_interior back to char(1)
            $table->char('grade_interior', 1)->nullable()->change();
        });
    }
};
