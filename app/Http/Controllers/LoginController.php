<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Usuari;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    
    public function index()
    {
        return view('login');
    }


    public function login(Request $request){

$usuari= Usuari::where('correu', $request->input('email'))->first();

    if ($usuari && Hash::check($request->input('password'), $usuari->contrasenya)) {
        Auth::login($usuari);
        $response = redirect()->route('inici');
    }
else {
    session()->flash('error', 'Credencials incorrectes');
    $response = redirect()->back()->withInput();
}
return $response;

}
}
