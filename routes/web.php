<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\RegistreController::class, 'index'])->name('vista_registre');
Route::get('/login', [App\Http\Controllers\LoginController::class, 'index'])->name('login');
Route::post('/registre', [App\Http\Controllers\RegistreController::class, 'store'])->name('registre.store');
Route::post('/login', [App\Http\Controllers\LoginController::class, 'login'])->name('login.dades');

Route::get('/inici', [App\Http\Controllers\IniciController::class, 'index'])->name('inici');
