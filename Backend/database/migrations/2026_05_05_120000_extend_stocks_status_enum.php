<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add workflow statuses aligned with car form: pending, in_transit, preorder.
     * MySQL: extend ENUM. SQLite: Laravel stores enum as flexible varchar — no alter needed.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement(
                "ALTER TABLE stocks MODIFY COLUMN status ENUM("
                . "'available','sold','reserved','damaged','lost','stolen','pending','in_transit','preorder'"
                . ") NOT NULL DEFAULT 'available'"
            );
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement(
                "ALTER TABLE stocks MODIFY COLUMN status ENUM("
                . "'available','sold','reserved','damaged','lost','stolen'"
                . ") NOT NULL DEFAULT 'available'"
            );
        }
    }
};
