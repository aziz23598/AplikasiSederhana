<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class Test3Controller extends Controller
{
    public function index () {
        return Inertia::render('test3/index');
    }

    public function calculate( Request $request){
        $request->validate([
            'n1' => 'required|integer|min:0',
            'n2' => 'required|integer|min:0',
        ]);

        // Fungsi Fibonacci
        $fib = function ($n) {
            if ($n <= 0) return 0;
            if ($n === 1) return 1;
            $a = 0;
            $b = 1;
            for ($i = 2; $i <= $n; $i++) {
                $temp = $a + $b;
                $a = $b;
                $b = $temp;
            }
            return $b;
        };

        $n1 = $request->n1;
        $n2 = $request->n2;
        $fib1 = $fib($n1);
        $fib2 = $fib($n2);
        $sum = $fib1 + $fib2;

        return Inertia::render('test3/index', [
            'result' => [
                'n1' => $n1,
                'n2' => $n2,
                'fib1' => $fib1,
                'fib2' => $fib2,
                'sum' => $sum
            ]
        ]);
    }
}