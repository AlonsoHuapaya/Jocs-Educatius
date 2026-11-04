<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\RegistreController::class, 'index'])->name('vista_registre');
