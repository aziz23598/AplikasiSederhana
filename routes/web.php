<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Test1Controller;
use App\Http\Controllers\Test2Controller;
use App\Http\Controllers\Test3Controller;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/test1', [Test1Controller::class, 'index' ])->name('test1'); 
    
    Route::get('/test2', [Test2Controller::class, 'index'])->name('test2.index');
    Route::get('/test2/list', [Test2Controller::class, 'index'])->name('test2.list');
    Route::get('/test2/rekap', [Test2Controller::class, 'index'])->name('test2.rekap');
    Route::resource('/test2', Test2Controller::class);


    Route::get('/test3', [Test3Controller::class, 'index'])->name('test3');
    Route::post('/test3/calculate', [Test3Controller::class, 'calculate'])->name('test3.calculate');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';