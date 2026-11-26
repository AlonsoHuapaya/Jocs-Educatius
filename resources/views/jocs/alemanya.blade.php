@extends('plantillas.joc')

@section('title', $joc['nom'] . ' | Arxiu Històric')

@section('content')
    {{-- La mecànica de cada nivell la crea public/js/alemanya.js --}}
@endsection

@section('scripts')
    {{--
        Plantilles HTML del joc. Van fora de la zona de joc perquè el motor
        la buida a cada nivell. El JS només les clona i les omple.
    --}}

    {{-- Registre d'entrada: formulari abans de començar --}}
    <template id="plantilla-registre">
        <form class="dossier" novalidate>
            <p class="dossier-cap">
                <span>ARXIU HISTÒRIC · REGISTRE D'ENTRADA</span>
                <span>EXPEDIENT ALEMANYA</span>
            </p>
            <p class="dossier-text">Abans d'obrir l'expedient, signa el registre de l'arxiu.</p>
            <div class="dossier-camp">
                <label class="dossier-etiqueta" for="agent-nom">NOM D'AGENT</label>
                <input class="dossier-any dossier-nom" id="agent-nom" name="agent" type="text"
                       maxlength="20" autocomplete="nickname" placeholder="El teu nom"
                       aria-describedby="agent-error">
                <button class="btn-joc btn-joc--principal" type="submit">ENTRA A L'ARXIU</button>
            </div>
            <p class="dossier-error" id="agent-error" role="alert"></p>
        </form>
    </template>

    {{-- Nivell 1: línia cronològica --}}
    <template id="plantilla-linia">
        <div class="tauler">
            <div class="linia-temps"></div>
            <div class="linia-safata" tabindex="0" aria-label="Fets per col·locar"></div>
        </div>
    </template>

    <template id="plantilla-punt">
        <div class="linia-temps-punt">
            <span class="linia-temps-any"></span>
            <div class="casella" role="button" data-forat>?</div>
        </div>
    </template>

    <template id="plantilla-fitxa">
        <div class="fitxa" role="button">
            <span class="fitxa-etiqueta">FET</span>
            <span class="fitxa-titol"></span>
        </div>
    </template>

    {{-- Nivell 2: document de l'arxiu i targetes il·lustrades --}}
    <template id="plantilla-document">
        <div class="targeta-definicio">
            <p class="targeta-definicio-etiqueta"></p>
            <p class="targeta-definicio-text" aria-live="polite"></p>
        </div>
    </template>

    <template id="plantilla-targeta">
        <button type="button" class="targeta">
            <span class="targeta-imatge"></span>
            <span class="targeta-cos">
                <span class="fitxa-etiqueta"></span>
                <span class="fitxa-titol"></span>
            </span>
        </button>
    </template>

    <template id="il-sa">
        <svg viewBox="0 0 120 90" aria-hidden="true">
            <path class="il-marro" d="M40 18 L52 12 Q60 20 68 12 L80 18 L98 32 L88 46 L80 40 L80 82 L40 82 L40 40 L32 46 L22 32 Z"/>
            <path class="il-accent" d="M28 28 L33 24 L41 38 L36 42 Z"/>
            <path class="il-linia-marro" d="M52 12 L60 26 L68 12"/>
            <circle class="il-paper" cx="60" cy="40" r="2.5"/>
            <circle class="il-paper" cx="60" cy="54" r="2.5"/>
            <circle class="il-paper" cx="60" cy="68" r="2.5"/>
            <rect class="il-marro-fosc" x="40" y="62" width="40" height="5"/>
        </svg>
    </template>

    <template id="il-reichstag">
        <svg viewBox="0 0 120 90" aria-hidden="true">
            <path class="il-accent" d="M60 2 Q51 13 55 21 Q48 17 47 26 Q58 33 70 26 Q72 16 65 15 Q67 8 60 2 Z M30 30 Q26 36 30 40 L36 40 Q38 34 33 33 Z M88 30 Q84 36 88 40 L94 40 Q96 34 91 33 Z"/>
            <path class="il-paper" d="M46 30 Q60 12 74 30 Z M22 42 L60 30 L98 42 Z"/>
            <rect class="il-paper" x="22" y="42" width="76" height="5"/>
            <path class="il-paper-fosc" d="M27 49 h6 v25 h-6 Z M41 49 h6 v25 h-6 Z M55 49 h6 v25 h-6 Z M69 49 h6 v25 h-6 Z M83 49 h6 v25 h-6 Z"/>
            <rect class="il-paper" x="18" y="74" width="84" height="7"/>
        </svg>
    </template>

    <template id="il-gestapo">
        <svg viewBox="0 0 120 90" aria-hidden="true">
            <ellipse class="il-fosc" cx="44" cy="58" rx="32" ry="7"/>
            <path class="il-gris" d="M23 58 Q24 28 44 28 Q64 28 65 58 Z"/>
            <path class="il-linia" d="M36 30 Q44 38 52 30"/>
            <rect class="il-accent" x="24" y="48" width="40" height="6"/>
            <circle class="il-traç-paper" cx="86" cy="40" r="14" stroke-width="5"/>
            <circle class="il-accent" cx="86" cy="40" r="4"/>
            <path class="il-traç-paper" d="M96 50 L108 64" stroke-width="8"/>
        </svg>
    </template>

    <template id="il-nuremberg">
        <svg viewBox="0 0 120 90" aria-hidden="true">
            <rect class="il-paper" x="24" y="10" width="48" height="66"/>
            <path class="il-tinta" d="M31 19 h34 v3 h-34 Z M31 27 h34 v3 h-34 Z M31 35 h26 v3 h-26 Z M31 43 h34 v3 h-34 Z"/>
            <circle class="il-contorn-accent" cx="58" cy="62" r="9" stroke-width="3"/>
            <path class="il-contorn-accent" d="M53 62 L63 62 M58 57 L58 67" stroke-width="2"/>
            <g transform="rotate(-35 94 46)">
                <rect class="il-accent" x="81" y="34" width="27" height="12" rx="2"/>
                <rect class="il-paper-fosc" x="92" y="46" width="5" height="28"/>
            </g>
        </svg>
    </template>

    {{-- Nivell 3: telegrames i safates --}}
    <template id="plantilla-telegrama">
        <div class="telegrama">
            <span class="telegrama-cap">
                <span>TELEGRAMA · FRONT</span>
                <span class="telegrama-num"></span>
            </span>
            <span class="telegrama-text"></span>
        </div>
    </template>

    <template id="plantilla-safates">
        <div class="safates-vf">
            <button type="button" class="safata-vf safata-vf--vertader" data-resposta="true">
                <span class="safata-vf-icona" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3"/></svg>
                </span>
                <span class="safata-vf-nom">VERTADER</span>
                <span class="safata-vf-llista"></span>
            </button>
            <button type="button" class="safata-vf safata-vf--fals" data-resposta="false">
                <span class="safata-vf-icona" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="3"/></svg>
                </span>
                <span class="safata-vf-nom">FALS</span>
                <span class="safata-vf-llista"></span>
            </button>
        </div>
    </template>

    <script src="{{ asset('js/alemanya.js') }}"></script>
@endsection
