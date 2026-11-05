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
        // Validar los datos del formulario
     
        // Crear un nuevo usuario
        $usuari = new Usuari();
        $usuari->nom = $request->input('name');
        $usuari->correu = $request->input('email');
        $usuari->contrasenya = bcrypt($request->input('password'));
        $usuari->save();

        // Redirigir a la página de inicio de sesión con un mensaje de éxito
        return redirect()->route('login')->with('success', 'Registro exitoso. Ahora puedes iniciar sesión.');
    }

}
