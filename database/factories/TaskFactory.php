<?php

namespace Database\Factories;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;


class TaskFactory extends Factory
{

    public function definition()
    {
        $state = [true,false];
        return [
            'user_id'=>1,
            'name' => $this->faker->sentence($nbWords = 3, $variableNbWords = true),
            'description' => $this->faker->paragraph($nbSentences = 3, $variableNbSentences = true),
            'completed' => $this->faker->randomElement($state)
        ];
    }
}
