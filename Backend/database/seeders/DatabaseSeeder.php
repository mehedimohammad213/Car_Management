<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Seed categories first, then cars, then stocks
        $this->call([
            CategorySeeder::class,
            CarSeeder::class,
            StockSeeder::class,
            TestUserSeeder::class,
        ]);
    }
}
