<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\RegistreController::class, 'index'])->name('vista_registre');
Route::get('/login', [App\Http\Controllers\LoginController::class, 'index'])->name('login');
