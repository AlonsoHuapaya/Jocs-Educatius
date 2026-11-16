<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>El teu recorregut | Arxiu Històric</title>

    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/inici.css') }}">
</head>

<body>

{{-- ===================== CAPÇALERA ===================== --}}
<header class="capcalera">
    <div class="logo">ARXIU <span>HISTÒRIC</span></div>

    <div class="progres" aria-label="Expedients resolts: {{ $completats }} de {{ $jocs->count() }}">
        <span class="progres-text">Expedients resolts</span>
        <span class="progres-barres">
            @foreach ($jocs as $joc)
                <i class="progres-barra progres-barra--{{ $joc['estat'] }}"></i>
            @endforeach
        </span>
        <strong>{{ $completats }}/{{ $jocs->count() }}</strong>
    </div>

    <div class="usuari">
        <span>{{ $usuari->nom }}</span>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="btn-text">Tanca la sessió</button>
        </form>
    </div>
</header>

@if (session('success') || session('error'))
    <div class="avis {{ session('error') ? 'avis--error' : '' }}" role="status">
        {{ session('success') ?? session('error') }}
    </div>
@endif

<main class="layout">

    {{-- ===================== MAPA ===================== --}}
    <section class="mapa-zona">
        <div class="mapa-cap">
            <div class="eyebrow">El teu recorregut</div>
            <h1>Europa, <span>1919 – 1975</span></h1>
            <p>Tria un país al mapa. Resol el seu expedient per desbloquejar el següent.</p>
        </div>

        <div class="mapa-marc">
            <svg class="mapa" viewBox="110 140 720 590" role="group" aria-label="Mapa d'Europa amb els expedients del joc">
                <defs>
                    <radialGradient id="vinyeta" cx="50%" cy="50%" r="75%">
                        <stop offset="60%" stop-color="#171714" stop-opacity="0"/>
                        <stop offset="100%" stop-color="#0f0f0d" stop-opacity="0.85"/>
                    </radialGradient>
                </defs>

                <rect class="mapa-mar" width="1000" height="760"/>

                @include('partials.mapa-europa')

                {{-- Ruta entre els països, en ordre de desbloqueig --}}
                @foreach ($jocs->values() as $i => $joc)
                    @php $seguent = $jocs->values()->get($i + 1); @endphp
                    @if ($seguent)
                        @php
                            [$x1, $y1] = $joc['marcador'];
                            [$x2, $y2] = $seguent['marcador'];
                        @endphp
                        <path class="ruta {{ $joc['estat'] === 'completat' ? 'ruta--feta' : '' }}"
                              d="M{{ $x1 }},{{ $y1 }} Q{{ ($x1 + $x2) / 2 - 40 }},{{ min($y1, $y2) - 30 }} {{ $x2 }},{{ $y2 }}"/>
                    @endif
                @endforeach

                <rect x="110" y="140" width="720" height="590" fill="url(#vinyeta)" pointer-events="none"/>

                {{-- Segells sobre cada país --}}
                @foreach ($jocs as $codi => $joc)
                    @php [$x, $y] = $joc['marcador']; @endphp
                    <g class="segell segell--{{ $joc['estat'] }}" data-pais="{{ $codi }}"
                       transform="translate({{ $x }} {{ $y }})"
                       tabindex="0" role="button"
                       aria-label="Expedient {{ $joc['numero'] }}: {{ $joc['nom'] }} ({{ $joc['estat'] }})">
                        @if ($joc['estat'] === 'disponible')
                            <circle class="segell-pols" r="30"/>
                        @endif
                        <circle class="segell-cercle" r="24"/>
                        <circle class="segell-vora" r="19"/>
                        @if ($joc['estat'] === 'bloquejat')
                            {{-- Candau --}}
                            <path class="segell-icona" d="M-6,-1 v-4 a6,6 0 0 1 12,0 v4 M-8,-1 h16 v11 h-16 z"/>
                        @elseif ($joc['estat'] === 'completat')
                            <path class="segell-icona" d="M-8,0 l5,6 l11,-12"/>
                        @else
                            <text class="segell-num" y="7">{{ ['I', 'II', 'III', 'IV', 'V'][$joc['numero'] - 1] ?? $joc['numero'] }}</text>
                        @endif
                        <text class="segell-nom" y="46">{{ $joc['nom'] }}</text>
                    </g>
                @endforeach
            </svg>
        </div>
    </section>

    {{-- ===================== EXPEDIENTS ===================== --}}
    <aside class="expedients">
        @if ($jocActual)
            <div class="continua">
                <div class="eyebrow">On ho vas deixar</div>
                <h2>Expedient {{ $jocActual['numero'] }} · {{ $jocActual['nom'] }}</h2>
                <a class="btn" href="{{ route('joc.show', $jocs->search($jocActual)) }}">
                    {{ $completats === 0 ? 'Obre el primer expedient' : 'Continua la investigació' }}
                </a>
            </div>
        @else
            <div class="continua continua--fet">
                <div class="eyebrow">Investigació completa</div>
                <h2>Has resolt tots els expedients</h2>
                <p>Pots tornar a jugar a qualsevol per millorar la teva puntuació.</p>
            </div>
        @endif

        <ol class="llista-expedients">
            @foreach ($jocs as $codi => $joc)
                <li class="expedient expedient--{{ $joc['estat'] }}" id="expedient-{{ $codi }}" data-pais="{{ $codi }}">
                    <div class="expedient-cap">
                        <span class="expedient-num">Expedient {{ ['I', 'II', 'III', 'IV', 'V'][$joc['numero'] - 1] ?? $joc['numero'] }}</span>
                        <span class="etiqueta etiqueta--{{ $joc['estat'] }}">
                            @switch($joc['estat'])
                                @case('completat') Resolt @break
                                @case('disponible') Obert @break
                                @default Amb candau
                            @endswitch
                        </span>
                    </div>

                    <h3>{{ $joc['nom'] }} <small>{{ $joc['periode'] }}</small></h3>
                    <p class="expedient-titol">{{ $joc['titol'] }}</p>
                    <p class="expedient-desc">{{ $joc['descripcio'] }}</p>

                    <ul class="nivells">
                        @foreach ($joc['nivells'] as $n => $nivell)
                            <li><span>{{ $n + 1 }}</span>{{ $nivell }}</li>
                        @endforeach
                    </ul>

                    @if ($joc['estat'] === 'bloquejat')
                        <span class="btn btn--bloquejat" aria-disabled="true">
                            Resol l'expedient anterior
                        </span>
                    @else
                        <a class="btn {{ $joc['estat'] === 'completat' ? 'btn--secundari' : '' }}"
                           href="{{ route('joc.show', $codi) }}">
                            {{ $joc['estat'] === 'completat' ? 'Torna a jugar' : 'Juga' }}
                        </a>
                    @endif
                </li>
            @endforeach
        </ol>
    </aside>

</main>

<script>
    // En clicar un país (o el seu segell), es destaca el seu expedient a la llista.
    document.querySelectorAll('.mapa [data-pais]').forEach((el) => {
        const seleccionar = () => {
            const codi = el.dataset.pais;
            document.querySelectorAll('[data-pais]').forEach((e) =>
                e.classList.toggle('seleccionat', e.dataset.pais === codi));
            document.getElementById('expedient-' + codi)
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        el.addEventListener('click', seleccionar);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seleccionar(); }
        });
    });
</script>

</body>
</html>
