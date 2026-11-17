<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\RegistreController::class, 'index'])->name('vista_registre');
Route::get('/login', [App\Http\Controllers\LoginController::class, 'index'])->name('login');
Route::post('/registre', [App\Http\Controllers\RegistreController::class, 'store'])->name('registre.store');
Route::post('/login', [App\Http\Controllers\LoginController::class, 'login'])->name('login.dades');

Route::middleware('auth')->group(function () {
    Route::get('/inici', [App\Http\Controllers\IniciController::class, 'index'])->name('inici');
    Route::post('/logout', [App\Http\Controllers\LoginController::class, 'logout'])->name('logout');

    Route::get('/joc/{codi}', [App\Http\Controllers\JocController::class, 'show'])->name('joc.show');
    Route::post('/joc/{codi}/superat', [App\Http\Controllers\JocController::class, 'superat'])->name('joc.superat');
});
