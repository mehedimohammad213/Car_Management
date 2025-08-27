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
        Schema::create('cars', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('subcategory_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('ref_no', 32)->unique()->nullable();
            $table->string('make', 64);
            $table->string('model', 64);
            $table->string('model_code', 32)->nullable();
            $table->string('variant', 128)->nullable();
            $table->smallInteger('year');
            $table->char('reg_year_month', 7)->nullable(); 
            $table->unsignedInteger('mileage_km')->nullable();
            $table->unsignedInteger('engine_cc')->nullable();
            $table->string('transmission', 32)->nullable();
            $table->string('drive', 32)->nullable();
            $table->string('steering', 16)->nullable();
            $table->string('fuel', 32)->nullable();
            $table->string('color', 64)->nullable();
            $table->unsignedTinyInteger('seats')->nullable();
            $table->decimal('grade_overall', 2, 1)->nullable();
            $table->char('grade_exterior', 1)->nullable();
            $table->char('grade_interior', 1)->nullable();
            $table->decimal('price_amount', 12, 2)->nullable();
            $table->char('price_currency', 3)->default('USD'); 
            $table->string('price_basis', 32)->nullable();
            $table->string('chassis_no_masked', 32)->nullable();
            $table->string('chassis_no_full', 64)->nullable();
            $table->string('location', 128)->nullable();
            $table->string('country_origin', 64)->nullable();
            $table->string('status', 32)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
