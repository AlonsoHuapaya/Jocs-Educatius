@extends('plantillas.joc')

@section('title', $joc['nom'] . ' | Arxiu Històric')

@section('content')
    {{-- La mecànica de cada nivell la crea public/js/italia.js --}}
@endsection

@section('scripts')
    {{--
        Plantilles HTML dels nivells.
        Van fora de la zona de joc perquè el motor la buida a cada nivell.
        El JS només les clona i les omple: el contingut és aquí, l'aspecte a joc.css
        i el comportament a italia.js.
    --}}

    {{-- Comú als nivells 1 i 2: fitxa que s'arrossega --}}
    <template id="plantilla-fitxa">
        <div class="fitxa" role="button">
            <span class="fitxa-etiqueta"></span>
            <span class="fitxa-titol"></span>
        </div>
    </template>

    {{-- Nivell 1: línia del temps sense anys per ordenar els fets --}}
    <template id="plantilla-ordre">
        <div class="tauler">
            <div class="linia-temps linia-ordre"></div>
            <div class="linia-safata" tabindex="0" aria-label="Fets per ordenar"></div>
        </div>
    </template>

    <template id="plantilla-posicio">
        <div class="linia-temps-punt">
            <span class="linia-temps-any"></span>
            <div class="casella" role="button" data-casella></div>
        </div>
    </template>

    {{-- Nivell 2: carpetes de l'arxiu on es classifiquen les mesures --}}
    <template id="plantilla-classificacio">
        <div class="tauler">
            <div class="linia-safata" tabindex="0" aria-label="Mesures per classificar"></div>
            <div class="carpetes"></div>
        </div>
    </template>

    <template id="plantilla-carpeta">
        <section class="carpeta" role="button" data-casella>
            <h3 class="carpeta-nom"></h3>
            <p class="carpeta-descripcio"></p>
            <div class="carpeta-contingut" aria-live="polite"></div>
        </section>
    </template>

    <template id="plantilla-tira">
        <span class="tira"></span>
    </template>

    {{-- Nivell 3: dues columnes per unir causes i conseqüències --}}
    <template id="plantilla-parelles">
        <div class="parelles">
            <div class="parelles-columna">
                <p class="parelles-titol">CAUSES</p>
                <div class="parelles-llista" data-tipus="causa"></div>
            </div>
            <div class="parelles-columna">
                <p class="parelles-titol">CONSEQÜÈNCIES</p>
                <div class="parelles-llista" data-tipus="consequencia"></div>
            </div>
        </div>
    </template>

    <template id="plantilla-parella">
        <button type="button" class="parella">
            <span class="parella-numero" aria-hidden="true"></span>
            <span class="parella-cos">
                <span class="fitxa-etiqueta"></span>
                <span class="parella-text"></span>
            </span>
        </button>
    </template>

    <script src="{{ asset('js/italia.js') }}"></script>
@endsection
