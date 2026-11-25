<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Joc;
use App\Models\Partida;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PartidaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Desa una partida quan s'acaba un nivell. La crida el joc amb fetch() i respon en JSON.
     *
     * Una partida s'acaba de dues maneres:
     * - guanyada: el jugador completa el nivell;
     * - perduda: gasta els 3 intents o s'acaba el temps (llavors la puntuació és 0).
     *
     * El joc es busca a la BD pel nom de config/jocs.php i el nivell per ordreDesbloqueig.
     * La puntuació ponderada és punts × número de nivell: els nivells difícils valen més.
     */
    public function store(Request $request): JsonResponse
    {
        $dades = $request->validate([
            'codi' => ['required', 'string'],
            'nivell' => ['required', 'integer', 'between:1,3'],
            'guanyada' => ['required', 'boolean'],
            'durada' => ['required', 'integer', 'min:0', 'max:36000'],
            'errors' => ['required', 'integer', 'min:0', 'max:100'],
            'punts' => ['required', 'integer', 'min:0', 'max:1000'],
        ]);

        $config = config("jocs.{$dades['codi']}");
        abort_if($config === null, 404, 'Aquest joc no existeix.');

        $joc = Joc::where('nom', $config['nom'])->firstOrFail();
        $nivell = $joc->nivells()->where('ordreDesbloqueig', $dades['nivell'])->firstOrFail();
        $puntuacio = $dades['guanyada'] ? $dades['punts'] : 0;

        $partida = new Partida();
        $partida->data = now()->format('Y-m-d H:i:s');
        $partida->durada = $dades['durada'];
        $partida->numErrors = $dades['errors'];
        $partida->puntuacio = $puntuacio;
        $partida->puntuacioPonderada = $puntuacio * $dades['nivell'];
        $partida->guanyada = $dades['guanyada'];
        $partida->id_Usuari = Auth::id();
        $partida->id_Joc = $joc->id;
        $partida->id_Nivell = $nivell->id;
        $partida->save();

        return response()->json(['ok' => true, 'id' => $partida->id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Partida $partida)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Partida $partida)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Partida $partida)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partida $partida)
    {
        //
    }
}
