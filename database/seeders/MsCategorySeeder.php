<?php

namespace Database\Seeders;

use App\Models\MsCategory; 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only insert if not exists to prevent duplicates on re-seeding
        if (!MsCategory::where('name', 'Income')->exists()) {
            MsCategory::create(['name' => 'Income']);
        }
        if (!MsCategory::where('name', 'Expense')->exists()) {
            MsCategory::create(['name' => 'Expense']);
        }
    }
}