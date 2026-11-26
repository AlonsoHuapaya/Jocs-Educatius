@php
    // Números romans per als expedients i el total de nivells del joc
    $romans = ['I', 'II', 'III', 'IV', 'V'];
    $numeroExpedient = $romans[$joc['numero'] - 1] ?? $joc['numero'];
@endphp
<!DOCTYPE html>
<html lang="ca">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title')</title>

        {{-- Tipografies comunes (Cormorant Garamond, Inter) i les pròpies de cada joc (Bodoni Moda, Oswald, Special Elite, Jost) --}}
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600&family=Bodoni+Moda:ital,wght@0,500;0,700;1,500&family=Oswald:wght@500;600&family=Special+Elite&family=Jost:wght@400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
        <link rel="stylesheet" href="{{ asset('css/joc.css') }}">

        @yield('styles')
    </head>

    {{-- Les dades que necessita el motor (joc-comu.js) van als atributs data-* --}}
    <body class="pagina-joc joc-{{ $codi }}"
          data-codi="{{ $codi }}"
          data-usuari="{{ auth()->id() }}"
          data-nivell-inicial="1"
          data-url-mapa="{{ route('inici') }}">

        {{-- ===================== CAPÇALERA ===================== --}}
        <header class="joc-capcalera">
            <a class="logo" href="{{ route('inici') }}" aria-label="Arxiu Històric: torna al mapa">ARXIU <span>HISTÒRIC</span></a>

            <div class="joc-expedient">
                <p class="joc-pais">
                    <span class="bandera" role="img" aria-label="Bandera de {{ $joc['nom'] }}"><i></i><i></i><i></i></span>
                    <span class="joc-pais-nom">{{ $joc['nom'] }}</span>
                    <span class="joc-pais-num">EXPEDIENT {{ $numeroExpedient }}</span>
                </p>

                <span class="separador" aria-hidden="true"></span>

                <ol class="indicador-nivells" aria-label="Nivells de l'expedient">
                    @foreach ($joc['nivells'] as $numero => $nomNivell)
                        @if (! $loop->first)
                            <li class="indicador-linia" aria-hidden="true"></li>
                        @endif
                        <li class="indicador-nivell" data-nivell="{{ $numero }}" data-estat="bloquejat">
                            <span class="indicador-quadre">{{ $numero }}</span>
                            <span class="indicador-nom">{{ $nomNivell }}</span>
                        </li>
                    @endforeach
                </ol>
            </div>

            <div class="joc-marcadors">
                <dl class="marcadors">
                    <div>
                        <dt>TEMPS</dt>
                        <dd id="marcador-temps" class="marcador-numero">00:00</dd>
                    </div>
                    <div>
                        <dt>INTENTS</dt>
                        <dd id="marcador-intents" class="marcador-numero">3</dd>
                    </div>
                    <div>
                        <dt>PUNTS</dt>
                        <dd id="marcador-punts" class="marcador-numero marcador-punts">0</dd>
                    </div>
                </dl>

                <button type="button" id="boto-pausa" class="boto-icona" aria-label="Pausa">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="5" y="4" width="4.5" height="16"></rect>
                        <rect x="14.5" y="4" width="4.5" height="16"></rect>
                    </svg>
                </button>
            </div>
        </header>

        {{-- Franja amb els colors de la bandera --}}
        <div class="franja-bandera" aria-hidden="true"><i></i><i></i><i></i></div>

        <main class="joc-cos">

            {{-- ===================== ZONA DEL REPTE ===================== --}}
            <section class="joc-principal" aria-labelledby="repte-titol">
                <div class="repte-cap">
                    <div>
                        <p id="repte-eyebrow" class="eyebrow eyebrow--joc">NIVELL 1</p>
                        <h1 id="repte-titol" class="repte-titol">{{ $joc['titol'] }}</h1>
                        <p id="repte-instruccio" class="repte-instruccio"></p>
                    </div>

                    <div class="progres-nivell">
                        <div class="progres-nivell-text">
                            <span>PROGRÉS DEL NIVELL</span>
                            <span id="progres-text">0/0</span>
                        </div>
                        <div id="progres-barra" class="progres-nivell-barra" role="progressbar"
                             aria-label="Progrés del nivell" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0">
                            <div id="progres-ple" class="progres-nivell-ple"></div>
                        </div>
                    </div>
                </div>

                {{-- Aquí cada joc hi posa la seva mecànica --}}
                <div id="zona-joc" class="zona-joc">
                    @yield('content')
                </div>

                <div class="botonera">
                    <button type="button" id="boto-reinicia" class="btn-joc btn-joc--fantasma">↻ REINICIA</button>
                    <button type="button" id="boto-pista" class="btn-joc btn-joc--secundari">? DEMANA UNA PISTA</button>
                    <button type="button" id="boto-comprova" class="btn-joc btn-joc--principal">COMPROVA</button>
                </div>
            </section>

            {{-- ===================== PANELL LATERAL ===================== --}}
            <aside class="joc-panell" aria-label="La Núria i el nivell">
                <div class="panell-bloc">
                    <h2 class="eyebrow eyebrow--or">LA NÚRIA DIU</h2>
                    <div class="nuria">
                        <div class="nuria-avatar" role="img" aria-label="La Núria">
                            <svg aria-hidden="true" width="44" height="46" viewBox="0 0 44 46">
                                <circle cx="22" cy="16" r="9" fill="#C9B48A"></circle>
                                <path d="M16 9c2-5 10-6 14-1l1 5c-4-3-10-3-15-1z" fill="#3A2E22"></path>
                                <path d="M6 46c1-11 8-16 16-16s15 5 16 16z" fill="#5C4A36"></path>
                                <path d="M19 30l3 5 3-5z" fill="#EAE3D3"></path>
                            </svg>
                        </div>
                        <p id="nuria-text" class="nuria-bafarada" aria-live="polite"></p>
                    </div>
                </div>

                <div class="pistes-disponibles">
                    <span>Pistes disponibles</span>
                    <span class="pistes-valor"><span id="pistes-valor">—</span><small>−50 punts cada una</small></span>
                </div>

                {{-- Bloc de context del nivell (mapa, cronologia, peça del patró…), propi de cada joc --}}
                @yield('panell')

                <dl class="estadistiques">
                    <div><dt>ENCERTS</dt><dd id="estat-encerts">0</dd></div>
                    <div><dt>ERRORS</dt><dd id="estat-errors">0</dd></div>
                    <div><dt>PISTES</dt><dd id="estat-pistes">0</dd></div>
                    <div><dt>RÈCORD</dt><dd id="estat-record">—</dd></div>
                </dl>
            </aside>
        </main>

        {{-- ===================== MODAL COMÚ ===================== --}}
        {{-- El motor hi posa el contingut: briefing, pausa, nivell superat, sense intents i expedient resolt --}}
        <div id="modal" class="modal ocult" role="dialog" aria-modal="true" aria-labelledby="modal-titol">
            <div class="modal-caixa">
                <p id="modal-eyebrow" class="eyebrow eyebrow--joc"></p>
                <h2 id="modal-titol" class="modal-titol"></h2>
                <p id="modal-text" class="modal-text"></p>
                <div id="modal-botons" class="modal-botons"></div>
            </div>
        </div>

        {{-- En acabar el nivell 3, el motor envia aquest formulari per desbloquejar el següent expedient --}}
        <form id="form-superat" method="POST" action="{{ route('joc.superat', $codi) }}" hidden>
            @csrf
        </form>

        <script src="{{ asset('js/joc-comu.js') }}"></script>
        @yield('scripts')
    </body>
</html>
