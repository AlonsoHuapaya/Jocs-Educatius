/* =========================================================
   Arxiu Històric · Motor comú dels jocs (joc-comu.js)

   Gestiona tot el que és igual als tres jocs: nivells, temps,
   intents, pistes de la Núria, puntuació, documents trobats,
   modals i mètriques. Cada joc només programa la mecànica dels
   seus nivells i avisa el motor quan l'usuari encerta o falla.

   Ús des del JS de cada joc (per exemple, public/js/jocs/italia.js):

       const motor = new MotorJoc({
           nivells: [
               {
                   titol: "Ordena els fets que van portar Mussolini al poder",
                   instruccio: "Arrossega cada fitxa al seu any i prem «Comprova».",
                   nuria: "Comença pel final de la Gran Guerra.",
                   pistes: ["Primera pista…", "Segona pista…"],
                   reptes: 4,
                   preparar(zona, motor) {
                       // Crea els elements del nivell dins de `zona`
                   },
                   comprovar(zona, motor) {
                       // Opcional: s'executa en prémer «Comprova».
                       // Crida motor.encert(), motor.error() o motor.repteSuperat()
                   },
               },
               // nivell 2, nivell 3…
           ],
       });

   Mètodes que poden fer servir els jocs:
       motor.encert()             → una resposta correcta (estadística)
       motor.error()              → resta un intent i punts
       motor.repteSuperat()       → avança el progrés; en acabar els reptes, supera el nivell
       motor.afegirDocument(text) → omple la següent casella de «Documents trobats»
       motor.diuNuria(text)       → canvia el text de la bafarada de la Núria
       motor.nivell               → número del nivell actual
   ========================================================= */

class MotorJoc {
    /* ---------- Regles comunes als tres jocs ---------- */

    // Proposta de puntuació (encara per acordar amb l'equip): es canvia només aquí
    static PUNTS_INICIALS = 1000;
    static PUNTS_PER_PISTA = 50;
    static PUNTS_PER_ERROR = 100;
    static PUNTS_PER_SEGON = 1;
    static INTENTS = 3;

    // Dificultat de cada nivell: pistes màximes i límit de temps (en segons, null = sense límit)
    static DIFICULTAT = {
        1: { pistes: Infinity, temps: null, text: 'Pistes il·limitades, sense límit de temps.' },
        2: { pistes: 3, temps: null, text: 'Màxim 3 pistes.' },
        3: { pistes: 1, temps: 180, text: 'Només 1 pista i temporitzador.' },
    };

    /* ---------- Estat privat ---------- */

    #nivells;
    #el = {};           // referències als elements del DOM de la carcassa
    #codi;

    #nivellActual = 1;
    #segons = 0;
    #idInterval = null;
    #intents = MotorJoc.INTENTS;
    #errors = 0;
    #encerts = 0;
    #pistesUsades = 0;
    #reptesSuperats = 0;
    #puntsTotals = 0;   // suma dels punts dels nivells superats
    #documentsTrobats = 0;
    #nivellEnCurs = false; // false quan el nivell ja s'ha superat o fallat

    #sessionId;
    #iniciSessio;
    #metriques = [];

    /**
     * @param {{ nivells: Array<object> }} config Nivells del joc (vegeu l'exemple de dalt)
     */
    constructor(config) {
        if (!config || !Array.isArray(config.nivells) || config.nivells.length === 0) {
            throw new Error('MotorJoc: cal passar un array de nivells.');
        }

        this.#nivells = config.nivells;
        this.#codi = document.body.dataset.codi;

        // Dades de la sessió per a les mètriques
        this.#iniciSessio = new Date();
        this.#sessionId = `${this.#codi}-${this.#iniciSessio.getTime()}`;

        this.#agafarElements();
        this.#registrarEsdeveniments();

        // Nivell on comença l'usuari (el posa el servidor a data-nivell-inicial)
        const nivellInicial = Number(document.body.dataset.nivellInicial) || 1;
        this.#carregarNivell(Math.min(nivellInicial, this.#nivells.length));
    }

    /* =========================================================
       MÈTODES PÚBLICS (els fan servir els jocs)
       ========================================================= */

    /** Número del nivell actual (1, 2 o 3) */
    get nivell() {
        return this.#nivellActual;
    }

    /** L'usuari ha encertat una resposta o una peça */
    encert() {
        if (!this.#nivellEnCurs) {
            return;
        }
        this.#encerts++;
        this.#actualitzarEstadistiques();
    }

    /** L'usuari s'ha equivocat: perd un intent i punts */
    error() {
        if (!this.#nivellEnCurs) {
            return;
        }
        this.#errors++;
        this.#intents--;
        this.#actualitzarIntents();
        this.#actualitzarEstadistiques();
        this.#actualitzarPunts();

        if (this.#intents <= 0) {
            this.#nivellFallat('Has esgotat els intents d\'aquest nivell.');
        }
    }

    /** S'ha resolt un dels reptes del nivell */
    repteSuperat() {
        if (!this.#nivellEnCurs) {
            return;
        }
        this.#reptesSuperats++;
        this.#actualitzarProgres();

        if (this.#reptesSuperats >= this.#reptesDelNivell()) {
            this.#nivellEnCurs = false;
            this.#aturarTemps();
            // Petita espera perquè l'usuari vegi l'últim moviment abans del modal
            setTimeout(() => this.#nivellSuperat(), 400);
        }
    }

    /**
     * Omple la següent casella buida de «Documents trobats»
     * @param {string} text Text curt del document (p. ex. "Cartell 1919")
     */
    afegirDocument(text) {
        const caselles = this.#el.documents.querySelectorAll('.document');
        if (this.#documentsTrobats >= caselles.length) {
            return;
        }

        const casella = caselles[this.#documentsTrobats];
        casella.classList.remove('document--buit');
        casella.textContent = text;
        casella.setAttribute('role', 'img');
        casella.setAttribute('aria-label', `Document trobat: ${text}`);
        this.#documentsTrobats++;
    }

    /**
     * Canvia el missatge de la Núria
     * @param {string} text
     */
    diuNuria(text) {
        this.#el.nuria.textContent = text;
        this.#el.nuria.classList.remove('pista');
    }

    /* =========================================================
       AJUDES PER AL DRAG AND DROP (jocs 1 i 3)
       ========================================================= */

    /**
     * Fa arrossegable una fitxa. Cal que tingui un id únic.
     * @param {HTMLElement} element
     */
    static ferArrossegable(element) {
        element.draggable = true;
        element.addEventListener('dragstart', MotorJoc.#iniciArrossegar);
        element.addEventListener('dragend', MotorJoc.#fiArrossegar);
    }

    /**
     * Converteix un element en una casella on es poden deixar fitxes.
     * @param {HTMLElement} casella
     * @param {(fitxa: HTMLElement, casella: HTMLElement) => void} quanDeixen Funció que s'executa en deixar-hi una fitxa
     */
    static ferCasella(casella, quanDeixen) {
        casella.addEventListener('dragenter', MotorJoc.#permetreDeixar);
        casella.addEventListener('dragover', MotorJoc.#permetreDeixar);
        casella.addEventListener('dragleave', MotorJoc.#sortirCasella);
        casella.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('drag-over');

            const fitxa = document.getElementById(e.dataTransfer.getData('text/plain'));
            if (fitxa) {
                quanDeixen(fitxa, e.currentTarget);
            }
        });
    }

    static #iniciArrossegar(e) {
        e.dataTransfer.setData('text/plain', e.currentTarget.id);
        e.currentTarget.classList.add('arrossegant');
    }

    static #fiArrossegar(e) {
        e.currentTarget.classList.remove('arrossegant');
    }

    static #permetreDeixar(e) {
        e.preventDefault(); // obligatori a dragenter i dragover perquè salti el drop
        e.currentTarget.classList.add('drag-over');
    }

    static #sortirCasella(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    /* =========================================================
       PREPARACIÓ
       ========================================================= */

    /** Guarda les referències als elements de la carcassa */
    #agafarElements() {
        this.#el = {
            temps: document.querySelector('#marcador-temps'),
            intents: document.querySelector('#marcador-intents'),
            punts: document.querySelector('#marcador-punts'),
            indicadors: document.querySelectorAll('.indicador-nivell'),

            eyebrow: document.querySelector('#repte-eyebrow'),
            titol: document.querySelector('#repte-titol'),
            instruccio: document.querySelector('#repte-instruccio'),
            progresText: document.querySelector('#progres-text'),
            progresBarra: document.querySelector('#progres-barra'),
            progresPle: document.querySelector('#progres-ple'),
            zona: document.querySelector('#zona-joc'),

            botoPausa: document.querySelector('#boto-pausa'),
            botoReinicia: document.querySelector('#boto-reinicia'),
            botoPista: document.querySelector('#boto-pista'),
            botoComprova: document.querySelector('#boto-comprova'),

            nuria: document.querySelector('#nuria-text'),
            pistesValor: document.querySelector('#pistes-valor'),
            documents: document.querySelector('#documents'),
            estatEncerts: document.querySelector('#estat-encerts'),
            estatErrors: document.querySelector('#estat-errors'),
            estatPistes: document.querySelector('#estat-pistes'),

            modal: document.querySelector('#modal'),
            modalEyebrow: document.querySelector('#modal-eyebrow'),
            modalTitol: document.querySelector('#modal-titol'),
            modalText: document.querySelector('#modal-text'),
            modalBotons: document.querySelector('#modal-botons'),
            formSuperat: document.querySelector('#form-superat'),
        };
    }

    /** Listeners dels botons comuns (amb bind perquè `this` sigui el motor) */
    #registrarEsdeveniments() {
        this.#el.botoPausa.addEventListener('click', this.#pausar.bind(this));
        this.#el.botoReinicia.addEventListener('click', this.#demanarReiniciar.bind(this));
        this.#el.botoPista.addEventListener('click', this.#demanarPista.bind(this));
        this.#el.botoComprova.addEventListener('click', this.#comprovar.bind(this));
    }

    /* =========================================================
       NIVELLS
       ========================================================= */

    /** Posa a zero el nivell indicat, el pinta i mostra el briefing */
    #carregarNivell(numero) {
        this.#aturarTemps();

        this.#nivellActual = numero;
        this.#segons = 0;
        this.#intents = MotorJoc.INTENTS;
        this.#errors = 0;
        this.#encerts = 0;
        this.#pistesUsades = 0;
        this.#reptesSuperats = 0;
        this.#nivellEnCurs = true;

        const nivell = this.#dadesNivell();

        // Textos del repte
        this.#el.titol.textContent = nivell.titol ?? '';
        this.#el.instruccio.textContent = nivell.instruccio ?? '';
        this.diuNuria(nivell.nuria ?? 'Quan vulguis una pista, demana-me-la.');

        // Botó «Comprova» només si el nivell el fa servir
        this.#el.botoComprova.classList.toggle('ocult', typeof nivell.comprovar !== 'function');

        // Mecànica del joc
        if (typeof nivell.preparar === 'function') {
            this.#el.zona.replaceChildren();
            nivell.preparar(this.#el.zona, this);
        }

        this.#actualitzarIndicadorNivells();
        this.#actualitzarProgres();
        this.#actualitzarIntents();
        this.#actualitzarPistes();
        this.#actualitzarEstadistiques();
        this.#actualitzarRellotge();
        this.#actualitzarPunts();

        this.#mostrarBriefing();
    }

    #mostrarBriefing() {
        const nivell = this.#dadesNivell();
        const dificultat = MotorJoc.DIFICULTAT[this.#nivellActual];

        this.#obrirModal({
            eyebrow: `NIVELL ${this.#nivellActual} · ${this.#nomNivell()}`,
            titol: nivell.titol ?? '',
            text: `${nivell.instruccio ?? ''} ${dificultat ? dificultat.text : ''}`,
            botons: [
                { text: 'COMENÇA', classe: 'btn-joc--principal', accio: () => this.#reprendre() },
            ],
        });
    }

    #nivellSuperat() {
        this.#nivellEnCurs = false;
        this.#aturarTemps();

        const punts = this.#puntsNivell();
        this.#puntsTotals += punts;
        this.#registrarMetrica(true, punts);

        // Marca el nivell com a resolt a l'indicador
        const indicador = this.#indicador(this.#nivellActual);
        if (indicador) {
            indicador.dataset.estat = 'resolt';
        }

        const esUltim = this.#nivellActual >= this.#nivells.length;

        this.#obrirModal({
            eyebrow: `NIVELL ${this.#nivellActual} · SUPERAT`,
            titol: esUltim ? 'Has resolt l\'últim nivell' : 'Nivell superat',
            text: '',
            resum: [
                ['TEMPS', this.#formatTemps(this.#segons)],
                ['ERRORS', this.#errors],
                ['PISTES', this.#pistesUsades],
                ['PUNTS', punts],
            ],
            botons: [
                esUltim
                    ? { text: 'TANCA L\'EXPEDIENT', classe: 'btn-joc--principal', accio: () => this.#expedientResolt() }
                    : { text: 'SEGÜENT NIVELL', classe: 'btn-joc--principal', accio: () => this.#carregarNivell(this.#nivellActual + 1) },
            ],
        });
    }

    /** S'han acabat els intents o el temps: es torna a començar el nivell */
    #nivellFallat(motiu) {
        this.#nivellEnCurs = false;
        this.#aturarTemps();
        this.#registrarMetrica(false, 0);

        this.#obrirModal({
            eyebrow: `NIVELL ${this.#nivellActual} · ${this.#nomNivell()}`,
            titol: 'L\'expedient s\'ha de tornar a revisar',
            text: `${motiu} Torna-ho a provar: la Núria t'ajudarà si li demanes una pista.`,
            botons: [
                { text: 'TORNA AL MAPA', classe: 'btn-joc--fantasma', accio: () => this.#tornarAlMapa() },
                { text: 'TORNA-HO A PROVAR', classe: 'btn-joc--principal', accio: () => this.#carregarNivell(this.#nivellActual) },
            ],
        });
    }

    #expedientResolt() {
        this.#obrirModal({
            eyebrow: 'EXPEDIENT RESOLT',
            titol: `Has resolt l'expedient de ${document.querySelector('.joc-pais-nom').textContent}`,
            text: `Has aconseguit ${this.#puntsTotals} punts en total. La Núria ja té una peça més del patró.`,
            botons: [
                { text: 'CONTINUA', classe: 'btn-joc--principal', accio: () => this.#enviarSuperat() },
            ],
        });
    }

    /* =========================================================
       BOTONS COMUNS
       ========================================================= */

    #pausar() {
        if (!this.#nivellEnCurs) {
            return;
        }
        this.#aturarTemps();

        this.#obrirModal({
            eyebrow: 'PAUSA',
            titol: 'Investigació en pausa',
            text: 'El temps s\'ha aturat. Pots continuar quan vulguis.',
            botons: [
                { text: 'TORNA AL MAPA', classe: 'btn-joc--fantasma', accio: () => this.#tornarAlMapa() },
                { text: 'CONTINUA', classe: 'btn-joc--principal', accio: () => this.#reprendre() },
            ],
        });
    }

    #demanarReiniciar() {
        this.#aturarTemps();

        this.#obrirModal({
            eyebrow: `NIVELL ${this.#nivellActual} · ${this.#nomNivell()}`,
            titol: 'Vols reiniciar el nivell?',
            text: 'Es tornaran a posar a zero el temps, els intents i les pistes d\'aquest nivell.',
            botons: [
                { text: 'CANCEL·LA', classe: 'btn-joc--fantasma', accio: () => this.#reprendre() },
                { text: 'REINICIA', classe: 'btn-joc--principal', accio: () => this.#carregarNivell(this.#nivellActual) },
            ],
        });
    }

    #demanarPista() {
        if (!this.#nivellEnCurs) {
            return;
        }
        const pistes = this.#dadesNivell().pistes ?? [];

        if (this.#pistesUsades >= this.#pistesMaximes() || this.#pistesUsades >= pistes.length) {
            this.diuNuria('Ja no et puc donar més pistes en aquest nivell.');
            this.#actualitzarPistes();
            return;
        }

        this.#el.nuria.textContent = pistes[this.#pistesUsades];
        this.#el.nuria.classList.add('pista');
        this.#pistesUsades++;

        this.#actualitzarPistes();
        this.#actualitzarEstadistiques();
        this.#actualitzarPunts();
    }

    #comprovar() {
        if (!this.#nivellEnCurs) {
            return;
        }

        const nivell = this.#dadesNivell();
        if (typeof nivell.comprovar === 'function') {
            nivell.comprovar(this.#el.zona, this);
        }
    }

    /* =========================================================
       TEMPS
       ========================================================= */

    #reprendre() {
        this.#tancarModal();

        if (this.#idInterval === null) {
            this.#idInterval = setInterval(() => this.#tic(), 1000);
        }
    }

    #aturarTemps() {
        clearInterval(this.#idInterval);
        this.#idInterval = null;
    }

    /** S'executa cada segon mentre es juga */
    #tic() {
        this.#segons++;
        this.#actualitzarRellotge();
        this.#actualitzarPunts();

        const limit = this.#tempsLimit();
        if (limit !== null && this.#segons >= limit) {
            this.#nivellFallat('S\'ha acabat el temps.');
        }
    }

    /** En els nivells amb límit, el rellotge compta enrere */
    #actualitzarRellotge() {
        const limit = this.#tempsLimit();
        const segonsAMostrar = limit === null ? this.#segons : Math.max(0, limit - this.#segons);

        this.#el.temps.textContent = this.#formatTemps(segonsAMostrar);
        this.#el.temps.classList.toggle('compte-enrere', limit !== null);
    }

    /** 84 → "01:24" */
    #formatTemps(segons) {
        const minuts = String(Math.floor(segons / 60)).padStart(2, '0');
        const resta = String(segons % 60).padStart(2, '0');
        return `${minuts}:${resta}`;
    }

    /* =========================================================
       PUNTUACIÓ I MARCADORS
       ========================================================= */

    /** Punts que porta el nivell actual (mai negatius) */
    #puntsNivell() {
        const punts = MotorJoc.PUNTS_INICIALS
            - this.#errors * MotorJoc.PUNTS_PER_ERROR
            - this.#pistesUsades * MotorJoc.PUNTS_PER_PISTA
            - this.#segons * MotorJoc.PUNTS_PER_SEGON;

        return Math.max(0, punts);
    }

    /** El marcador mostra els punts del nivell actual (els totals surten en acabar l'expedient) */
    #actualitzarPunts() {
        if (this.#nivellEnCurs) {
            this.#el.punts.textContent = this.#puntsNivell();
        }
    }

    /** Mostra el nombre d'intents que queden */
    #actualitzarIntents() {
        this.#el.intents.textContent = Math.max(0, this.#intents);
    }

    #actualitzarPistes() {
        const maxim = this.#pistesMaximes();
        const disponibles = this.#dadesNivell().pistes ?? [];
        const queden = Math.min(maxim, disponibles.length) - this.#pistesUsades;

        this.#el.pistesValor.textContent = maxim === Infinity ? 'Il·limitades' : `${Math.max(0, queden)} de ${maxim}`;
        this.#el.botoPista.disabled = queden <= 0;
    }

    #actualitzarEstadistiques() {
        this.#el.estatEncerts.textContent = this.#encerts;
        this.#el.estatErrors.textContent = this.#errors;
        this.#el.estatPistes.textContent = this.#pistesUsades;
    }

    #actualitzarProgres() {
        const total = this.#reptesDelNivell();
        const fets = Math.min(this.#reptesSuperats, total);
        const nom = this.#nomNivell();
        const repteActual = Math.min(fets + 1, total);

        this.#el.eyebrow.textContent = `NIVELL ${this.#nivellActual} · ${nom} · REPTE ${repteActual} DE ${total}`;
        this.#el.progresText.textContent = `${fets}/${total}`;
        this.#el.progresPle.style.width = `${(fets / total) * 100}%`;
        this.#el.progresBarra.setAttribute('aria-valuemax', total);
        this.#el.progresBarra.setAttribute('aria-valuenow', fets);
    }

    /** Nivells anteriors: resolt · actual: actual · següents: bloquejat */
    #actualitzarIndicadorNivells() {
        this.#el.indicadors.forEach((indicador) => {
            const numero = Number(indicador.dataset.nivell);

            if (numero < this.#nivellActual) {
                indicador.dataset.estat = 'resolt';
            } else if (numero === this.#nivellActual) {
                indicador.dataset.estat = 'actual';
            } else {
                indicador.dataset.estat = 'bloquejat';
            }

            if (numero === this.#nivellActual) {
                indicador.setAttribute('aria-current', 'step');
            } else {
                indicador.removeAttribute('aria-current');
            }
        });
    }

    /* =========================================================
       MODAL
       ========================================================= */

    /**
     * @param {{ eyebrow: string, titol: string, text: string, resum?: Array, botons: Array<{text: string, classe: string, accio: Function}> }} opcions
     */
    #obrirModal({ eyebrow, titol, text, resum, botons }) {
        this.#el.modalEyebrow.textContent = eyebrow;
        this.#el.modalTitol.textContent = titol;
        this.#el.modalText.textContent = text;
        this.#el.modalText.classList.toggle('ocult', !text);

        // Resum de punts (només al modal de nivell superat)
        const resumAnterior = this.#el.modal.querySelector('.modal-resum');
        if (resumAnterior) {
            resumAnterior.remove();
        }
        if (resum) {
            this.#el.modalBotons.before(this.#crearResum(resum));
        }

        // Botons
        this.#el.modalBotons.replaceChildren();
        for (const boto of botons) {
            const element = document.createElement('button');
            element.type = 'button';
            element.className = `btn-joc ${boto.classe}`;
            element.textContent = boto.text;
            element.addEventListener('click', boto.accio);
            this.#el.modalBotons.appendChild(element);
        }

        this.#el.modal.classList.remove('ocult');
        document.body.classList.add('amb-modal');

        // El focus va a l'últim botó (l'acció principal) per poder jugar amb el teclat
        this.#el.modalBotons.lastElementChild?.focus();
    }

    #tancarModal() {
        this.#el.modal.classList.add('ocult');
        document.body.classList.remove('amb-modal');
    }

    #crearResum(dades) {
        const dl = document.createElement('dl');
        dl.className = 'modal-resum';

        for (const [etiqueta, valor] of dades) {
            const div = document.createElement('div');
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
            dt.textContent = etiqueta;
            dd.textContent = valor;
            div.appendChild(dt);
            div.appendChild(dd);
            dl.appendChild(div);
        }

        return dl;
    }

    /* =========================================================
       MÈTRIQUES I SORTIDA DEL JOC
       ========================================================= */

    /** Guarda les dades de l'intent de nivell (mètriques comunes del projecte) */
    #registrarMetrica(completat, punts) {
        this.#metriques.push({
            session_id: this.#sessionId,
            date_time: this.#iniciSessio.toISOString(),
            game: this.#codi,
            level_reached: this.#nivellActual,
            level_time: this.#segons,
            errors_made: this.#errors,
            help_clicks: this.#pistesUsades,
            score: punts,
            completed: completat,
        });
    }

    /**
     * Encara no hi ha cap ruta al servidor per guardar-les:
     * de moment es mostren a la consola (F12).
     */
    #enviarMetriques() {
        const sessionLength = Math.round((Date.now() - this.#iniciSessio.getTime()) / 1000);
        console.log(`Sessió ${this.#sessionId} · session_length: ${sessionLength} s`);
        console.table(this.#metriques);
    }

    /** Envia el formulari que desbloqueja el següent expedient */
    #enviarSuperat() {
        this.#enviarMetriques();
        this.#el.formSuperat.submit();
    }

    #tornarAlMapa() {
        this.#enviarMetriques();
        location.href = document.body.dataset.urlMapa;
    }

    /* =========================================================
       AJUDES INTERNES
       ========================================================= */

    #dadesNivell() {
        return this.#nivells[this.#nivellActual - 1];
    }

    #reptesDelNivell() {
        return this.#dadesNivell().reptes ?? 1;
    }

    #pistesMaximes() {
        const dificultat = MotorJoc.DIFICULTAT[this.#nivellActual];
        return dificultat ? dificultat.pistes : Infinity;
    }

    /** Límit de temps del nivell: el del joc si en defineix un, si no el comú */
    #tempsLimit() {
        const nivell = this.#dadesNivell();
        if (nivell.tempsLimit !== undefined) {
            return nivell.tempsLimit;
        }

        const dificultat = MotorJoc.DIFICULTAT[this.#nivellActual];
        return dificultat ? dificultat.temps : null;
    }

    #indicador(numero) {
        return document.querySelector(`.indicador-nivell[data-nivell="${numero}"]`);
    }

    #nomNivell() {
        const indicador = this.#indicador(this.#nivellActual);
        return indicador ? indicador.querySelector('.indicador-nom').textContent.toUpperCase() : '';
    }
}
