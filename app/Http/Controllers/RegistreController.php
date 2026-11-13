<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Usuari;
use Illuminate\Http\Request;

class RegistreController extends Controller
{
    function index()
    {
        return view('registre');
    }

    public function store(Request $request)
    {
     
        $usuari = new Usuari();
        $usuari->nom = $request->input('name');
        $usuari->correu = $request->input('email');
        $usuari->contrasenya = bcrypt($request->input('password'));
        $usuari->progresJoc = 1;

        $usuari->save();

        return redirect()->route('login')->with('success', 'Registro exitoso. Ahora puedes iniciar sesión.');
    }

}
