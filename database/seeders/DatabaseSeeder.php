<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TransactionHeader;    
use App\Models\TransactionDetail;   
use App\Models\MsCategory;
use Database\Seeders\MsCategorySeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //User::factory()->create([
        //    'name' => 'Test User',
        //    'email' => 'test@example.com',
        //]);
        $this->call([
            MsCategorySeeder::class,
        ]);

        $incomeCategory = MsCategory::where('name', 'Income')->first();
        $expenseCategory = MsCategory::where('name', 'Expense')->first();

        if (!$incomeCategory || !$expenseCategory) {
            throw new \Exception("Kategori 'Income' atau 'Expense' tidak ditemukan setelah MsCategorySeeder dijalankan.");
        }

        TransactionHeader::factory()->count(20)->create()->each(function ($header) use ($incomeCategory, $expenseCategory) {
            TransactionDetail::factory()->count(rand(1, 5))->create([
                'transaction_id' => $header->id, 
                'transaction_category_id' => rand(0, 1) ? $incomeCategory->id : $expenseCategory->id,
            ]);
        });
    }
}