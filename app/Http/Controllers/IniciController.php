<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class IniciController extends Controller
{
    /**
     * Pantalla principal: mapa amb els tres països i l'estat de cada joc.
     */
    public function index(): View
    {
        $usuari = Auth::user();

        $jocs = collect(config('jocs'))
            ->map(fn (array $joc) => $joc + ['estat' => $usuari->estatJoc($joc['numero'])]);

        // El joc on l'usuari s'havia quedat (null si ja els ha acabat tots)
        $jocActual = $jocs->firstWhere('estat', 'disponible');

        return view('inici', [
            'usuari' => $usuari,
            'jocs' => $jocs,
            'jocActual' => $jocActual,
            'completats' => $jocs->where('estat', 'completat')->count(),
        ]);
    }
}
