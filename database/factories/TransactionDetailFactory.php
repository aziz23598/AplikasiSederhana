<?php

namespace Database\Factories;

use App\Models\TransactionDetail; 
use App\Models\TransactionHeader;
use App\Models\MsCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionDetail>
 */
class TransactionDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = TransactionDetail::class;

    public function definition(): array
    {
        $transactionHeaderId = TransactionHeader::factory();
        $category = MsCategory::inRandomOrder()->first();
        if (!$category) {
            $category = MsCategory::factory()->create(['name' => 'Income']);
        }
        return [
            'transaction_id' => $transactionHeaderId,
            'transaction_category_id' => $category->id, 
            'name' => $this->faker->sentence(3), 
            'value_idr' => $this->faker->randomFloat(2, 10000, 10000000),
        ];
    }
}