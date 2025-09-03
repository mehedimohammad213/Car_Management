<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stock;
use App\Models\Car;
use App\Models\Category;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some existing cars or create them if they don't exist
        $cars = Car::take(10)->get();
        
        if ($cars->isEmpty()) {
            // Create some sample cars first
            $category = Category::first();
            if (!$category) {
                $category = Category::create([
                    'name' => 'Sedan',
                    'description' => 'Standard sedan cars',
                    'parent_category_id' => null,
                ]);
            }

            for ($i = 1; $i <= 10; $i++) {
                $cars->push(Car::create([
                    'category_id' => $category->id,
                    'ref_no' => 'CAR' . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'make' => $this->getRandomMake(),
                    'model' => $this->getRandomModel(),
                    'year' => rand(2018, 2024),
                    'transmission' => $this->getRandomTransmission(),
                    'fuel' => $this->getRandomFuel(),
                    'color' => $this->getRandomColor(),
                    'status' => 'available',
                ]));
            }
        }

        // Create sample stocks
        $statuses = ['available', 'sold', 'reserved', 'damaged'];
        $notes = [
            'New arrival from Japan',
            'Excellent condition',
            'Minor scratches on front bumper',
            'Fully serviced',
            'Low mileage',
            'One owner',
            'Import ready',
            'Certified pre-owned',
            'Warranty included',
            'Fresh import'
        ];

        foreach ($cars as $index => $car) {
            // Skip some cars to show available cars for stock creation
            if ($index < 7) {
                Stock::create([
                    'car_id' => $car->id,
                    'quantity' => rand(1, 10),
                    'price' => rand(15000, 50000) + (rand(0, 99) / 100),
                    'status' => $statuses[array_rand($statuses)],
                    'notes' => $notes[array_rand($notes)],
                ]);
            }
        }

        $this->command->info('Stock seeder completed successfully!');
        $this->command->info('Created ' . Stock::count() . ' stock records');
        $this->command->info('Available cars for stock creation: ' . Car::whereNotIn('id', Stock::pluck('car_id'))->count());
    }

    private function getRandomMake(): string
    {
        $makes = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Lexus', 'Infiniti', 'Acura'];
        return $makes[array_rand($makes)];
    }

    private function getRandomModel(): string
    {
        $models = ['Camry', 'Civic', 'Altima', 'Mazda3', 'Impreza', 'Lancer', 'ES', 'Q50', 'TLX'];
        return $models[array_rand($models)];
    }

    private function getRandomTransmission(): string
    {
        $transmissions = ['Automatic', 'Manual', 'CVT'];
        return $transmissions[array_rand($transmissions)];
    }

    private function getRandomFuel(): string
    {
        $fuels = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
        return $fuels[array_rand($fuels)];
    }

    private function getRandomColor(): string
    {
        $colors = ['Silver', 'Black', 'White', 'Red', 'Blue', 'Gray', 'Green'];
        return $colors[array_rand($colors)];
    }
}
