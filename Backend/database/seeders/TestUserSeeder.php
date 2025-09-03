<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@carselling.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'John Doe',
            'username' => 'user',
            'email' => 'user@carselling.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
        ]);

        $this->command->info('Test users created successfully!');
        $this->command->info('Admin: admin/admin123');
        $this->command->info('User: user/user123');
    }
}
