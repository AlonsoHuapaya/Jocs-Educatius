<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class JocController extends Controller
{
    /**
     * Obre el joc d'un país, si l'usuari l'ha desbloquejat.
     * Cada membre pot crear la seva vista a resources/views/jocs/{codi}.blade.php.
     */
    public function show(string $codi): View|RedirectResponse
    {
        $joc = config("jocs.$codi");
        abort_if($joc === null, 404);

        if (Auth::user()->estatJoc($joc['numero']) === 'bloquejat') {
            return redirect()->route('inici')
                ->with('error', "Encara no has desbloquejat l'expedient de {$joc['nom']}.");
        }

        $vista = view()->exists("jocs.$codi") ? "jocs.$codi" : 'jocs.en-construccio';

        return view($vista, ['codi' => $codi, 'joc' => $joc]);
    }

    /**
     * El joc l'envia en acabar-lo: desbloqueja el següent i torna al mapa.
     */
    public function superat(string $codi): RedirectResponse
    {
        $joc = config("jocs.$codi");
        abort_if($joc === null, 404);

        Auth::user()->superarJoc($joc['numero']);

        return redirect()->route('inici')
            ->with('success', "Expedient de {$joc['nom']} resolt!");
    }
}
