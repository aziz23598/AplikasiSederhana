<?php

namespace Database\Factories;

use App\Models\TransactionHeader;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionHeader>
 */
class TransactionHeaderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = TransactionHeader::class;

    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(5), 
            'code' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{5}'), 
            'rate_euro' => $this->faker->randomFloat(2, 10000, 20000), 
            'date_paid' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}