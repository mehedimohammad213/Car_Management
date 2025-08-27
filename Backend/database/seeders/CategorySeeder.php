<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create parent categories
        $sportsCars = Category::create([
            'name' => 'Sports Cars',
            'status' => 'active',
            'short_des' => 'High-performance sports vehicles designed for speed and agility',
        ]);

        $suvs = Category::create([
            'name' => 'SUVs',
            'status' => 'active',
            'short_des' => 'Sport Utility Vehicles for versatile transportation',
        ]);

        $sedans = Category::create([
            'name' => 'Sedans',
            'status' => 'active',
            'short_des' => 'Four-door passenger cars with comfortable interiors',
        ]);

        $luxury = Category::create([
            'name' => 'Luxury Vehicles',
            'status' => 'active',
            'short_des' => 'Premium vehicles with high-end features and comfort',
        ]);

        $electric = Category::create([
            'name' => 'Electric Vehicles',
            'status' => 'active',
            'short_des' => 'Environmentally friendly electric-powered vehicles',
        ]);

        // Create child categories for Sports Cars
        Category::create([
            'name' => 'Supercars',
            'parent_category_id' => $sportsCars->id,
            'status' => 'active',
            'short_des' => 'Ultra-high-performance sports cars',
        ]);

        Category::create([
            'name' => 'Muscle Cars',
            'parent_category_id' => $sportsCars->id,
            'status' => 'active',
            'short_des' => 'High-powered American performance cars',
        ]);

        Category::create([
            'name' => 'Track Cars',
            'parent_category_id' => $sportsCars->id,
            'status' => 'active',
            'short_des' => 'Racing-focused sports cars',
        ]);

        // Create child categories for SUVs
        Category::create([
            'name' => 'Compact SUVs',
            'parent_category_id' => $suvs->id,
            'status' => 'active',
            'short_des' => 'Smaller SUV models for urban driving',
        ]);

        Category::create([
            'name' => 'Full-Size SUVs',
            'parent_category_id' => $suvs->id,
            'status' => 'active',
            'short_des' => 'Large SUV models with maximum space',
        ]);

        Category::create([
            'name' => 'Luxury SUVs',
            'parent_category_id' => $suvs->id,
            'status' => 'active',
            'short_des' => 'Premium SUV models with luxury features',
        ]);

        // Create child categories for Sedans
        Category::create([
            'name' => 'Compact Sedans',
            'parent_category_id' => $sedans->id,
            'status' => 'active',
            'short_des' => 'Small sedan models for fuel efficiency',
        ]);

        Category::create([
            'name' => 'Mid-Size Sedans',
            'parent_category_id' => $sedans->id,
            'status' => 'active',
            'short_des' => 'Medium-sized sedans with balanced features',
        ]);

        Category::create([
            'name' => 'Full-Size Sedans',
            'parent_category_id' => $sedans->id,
            'status' => 'active',
            'short_des' => 'Large sedans with maximum comfort',
        ]);

        // Create child categories for Luxury Vehicles
        Category::create([
            'name' => 'Luxury Sedans',
            'parent_category_id' => $luxury->id,
            'status' => 'active',
            'short_des' => 'Premium sedan models with luxury amenities',
        ]);

        Category::create([
            'name' => 'Luxury SUVs',
            'parent_category_id' => $luxury->id,
            'status' => 'active',
            'short_des' => 'Premium SUV models with luxury features',
        ]);

        Category::create([
            'name' => 'Luxury Sports Cars',
            'parent_category_id' => $luxury->id,
            'status' => 'active',
            'short_des' => 'High-end sports cars with luxury features',
        ]);

        // Create child categories for Electric Vehicles
        Category::create([
            'name' => 'Electric Sedans',
            'parent_category_id' => $electric->id,
            'status' => 'active',
            'short_des' => 'Electric-powered sedan models',
        ]);

        Category::create([
            'name' => 'Electric SUVs',
            'parent_category_id' => $electric->id,
            'status' => 'active',
            'short_des' => 'Electric-powered SUV models',
        ]);

        Category::create([
            'name' => 'Electric Sports Cars',
            'parent_category_id' => $electric->id,
            'status' => 'active',
            'short_des' => 'High-performance electric sports cars',
        ]);

        // Create some inactive categories for testing
        Category::create([
            'name' => 'Vintage Cars',
            'status' => 'inactive',
            'short_des' => 'Classic and vintage automobile models',
        ]);

        Category::create([
            'name' => 'Hybrid Vehicles',
            'status' => 'inactive',
            'short_des' => 'Hybrid-powered vehicles combining gas and electric',
        ]);
    }
}
