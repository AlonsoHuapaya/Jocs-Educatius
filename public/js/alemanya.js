/* Arxiu Històric · Alemanya (1919 – 1945)
   Registre d'entrada (formulari) → N1 línia cronològica · N2 targetes · N3 telegrames.
   L'HTML és a les <template> de jocs/alemanya.blade.php i l'aspecte a joc.css.
   El rècord i el nivell on s'havia quedat el jugador els porta el motor (joc-comu.js). */

/* ---------- Utilitats ---------- */

const clonar = (id) => document.getElementById(id).content.firstElementChild.cloneNode(true);

function posarText(element, textos) {
    for (const [selector, text] of Object.entries(textos)) {
        element.querySelector(selector).textContent = text;
    }
    return element;
}

/** Error del jugador: perd un intent i la Núria ho explica */
function equivocat(missatge) {
    motor.error();
    motor.diuNuria(missatge);
}

/* ---------- Memòria local del nom d'agent ----------
   Només desa el nom d'agent del registre d'entrada (el rècord i el nivell els desa el motor).
   localStorage (i no sessionStorage ni cookies): el nom ha de durar entre visites
   i no cal enviar-lo al servidor. La clau porta l'usuari (data-usuari), com fa el motor,
   perquè dos usuaris del mateix navegador no es barregin. */

class MemoriaLocal {
    constructor(prefix) {
        this.prefix = prefix;
    }

    llegir(clau, perDefecte = null) {
        try {
            return JSON.parse(localStorage.getItem(`${this.prefix}.${clau}`)) ?? perDefecte;
        } catch {
            return perDefecte;
        }
    }

    desar(clau, valor) {
        try {
            localStorage.setItem(`${this.prefix}.${clau}`, JSON.stringify(valor));
        } catch {
            // Navegació privada: el joc funciona igual, però sense desar
        }
    }
}

/* ---------- Línia cronològica ----------
   Component per col·locar fitxes en caselles arrossegant-les o fent clic
   primer a la fitxa i després a la casella (també amb el teclat). Fa servir delegació: un sol
   listener a l'arrel per a tots els clics i tecles. */

class LiniaCronologica {
    #triada = null;

    constructor(arrel) {
        this.arrel = arrel;
        this.safata = arrel.querySelector('.linia-safata');
        arrel.addEventListener('click', (e) => this.#clicar(e.target));
        arrel.addEventListener('keydown', (e) => {
            if (['Enter', ' '].includes(e.key) && e.target.matches('[tabindex]')) {
                e.preventDefault();
                this.#clicar(e.target);
            }
        });
        MotorJoc.ferCasella(this.safata, (fitxa) => this.retornar(fitxa));
    }

    afegirAny(any) {
        const punt = clonar('plantilla-punt');
        const casella = punt.querySelector('.casella');
        punt.querySelector('.linia-temps-any').textContent = any;
        casella.dataset.any = any;
        casella.tabIndex = 0;
        MotorJoc.ferCasella(casella, (fitxa) => this.deixar(fitxa, casella));
        this.arrel.querySelector('.linia-temps').appendChild(punt);
    }

    afegirFet({ any, text }) {
        const fitxa = posarText(clonar('plantilla-fitxa'), { '.fitxa-titol': text });
        fitxa.id = `fet-${any}`;
        fitxa.dataset.any = any;
        fitxa.tabIndex = 0;
        MotorJoc.ferArrossegable(fitxa);
        this.safata.appendChild(fitxa);
    }

    deixar(fitxa, casella) {
        if (casella.classList.contains('casella--correcta')) {
            return;
        }
        const anterior = casella.querySelector('.fitxa');
        if (anterior && anterior !== fitxa) {
            this.retornar(anterior);
        }
        casella.replaceChildren(fitxa);
        casella.classList.remove('casella--incorrecta');
        this.#triar(null);
    }

    retornar(fitxa) {
        const casella = fitxa.closest('.casella');
        this.safata.appendChild(fitxa);
        if (casella) {
            casella.textContent = '?';
        }
        this.#triar(null);
    }

    /** Corregeix les caselles pendents. Torna null si en queda alguna de buida. */
    corregir() {
        const pendents = [...this.arrel.querySelectorAll('.casella:not(.casella--correcta)')];
        if (pendents.some((casella) => !casella.querySelector('.fitxa'))) {
            return null;
        }
        return pendents.map((casella) => {
            const fitxa = casella.querySelector('.fitxa');
            const correcte = fitxa.dataset.any === casella.dataset.any;
            casella.classList.add(correcte ? 'casella--correcta' : 'casella--incorrecta');
            if (correcte) {
                fitxa.draggable = false;
                fitxa.tabIndex = -1;
            } else {
                this.retornar(fitxa);
            }
            return { any: casella.dataset.any, correcte };
        });
    }

    #clicar(objectiu) {
        const fitxa = objectiu.closest('.fitxa');
        const casella = objectiu.closest('.casella');

        if (fitxa && !fitxa.closest('.casella--correcta')) {
            this.#triar(this.#triada === fitxa ? null : fitxa);
        } else if (casella && this.#triada) {
            this.deixar(this.#triada, casella);
        } else if (objectiu.closest('.linia-safata') && this.#triada) {
            this.retornar(this.#triada);
        }
    }

    #triar(fitxa) {
        this.#triada?.classList.remove('fitxa--seleccionada');
        fitxa?.classList.add('fitxa--seleccionada');
        this.#triada = fitxa;
        this.arrel.classList.toggle('amb-seleccio', fitxa !== null);
    }
}

/* ---------- Dades ---------- */

const FETS_WEIMAR = [
    { any: 1919, text: 'S\'aprova la Constitució de Weimar' },
    { any: 1923, text: 'Hiperinflació: el marc no val res' },
    { any: 1929, text: 'Crac del 29 i atur massiu' },
    { any: 1933, text: 'Hitler és nomenat canceller' },
];

const CONCEPTES_NAZISME = [
    { nom: 'SA', any: 1921, il: 'il-sa', definicio: 'Milícia paramilitar del partit nazi. Els seus membres, els «camises marrons», atacaven els rivals polítics al carrer.' },
    { nom: 'Incendi del Reichstag', any: 1933, il: 'il-reichstag', definicio: 'Foc al Parlament alemany que Hitler va fer servir d\'excusa per suspendre les llibertats i perseguir els comunistes.' },
    { nom: 'Gestapo', any: 1933, il: 'il-gestapo', definicio: 'Policia secreta de l\'Estat nazi. Vigilava la població, perseguia els opositors i els enviava a camps de concentració.' },
    { nom: 'Lleis de Nuremberg', any: 1935, il: 'il-nuremberg', definicio: 'Lleis racials que van treure la ciutadania alemanya als jueus i els van prohibir casar-se amb no jueus.' },
];

const TELEGRAMES = [
    { text: 'La guerra va començar el 1939 amb la invasió alemanya de Polònia.', vertader: true },
    { text: 'Alemanya i la Unió Soviètica van signar un pacte de no-agressió el 1939.', vertader: true },
    { text: 'França va resistir la invasió alemanya fins al 1944.', vertader: false },
    { text: 'L\'Operació Barbarroja va ser la invasió alemanya de la Unió Soviètica.', vertader: true },
    { text: 'Els Estats Units van entrar a la guerra després de l\'atac a Pearl Harbor.', vertader: true },
    { text: 'La batalla de Stalingrad va ser una gran victòria alemanya.', vertader: false },
    { text: 'El desembarcament de Normandia va tenir lloc el juny de 1944.', vertader: true },
    { text: 'Hitler va ser jutjat i condemnat als judicis de Nuremberg.', vertader: false },
];

/** Nom d'agent: comença per lletra i té de 3 a 20 lletres, espais, guions, apòstrofs o punts volats */
const FORMAT_AGENT = /^\p{L}[\p{L} '·-]{2,19}$/u;

/* ---------- Nom d'agent ---------- */

const memoria = new MemoriaLocal(`arxiu-historic.${document.body.dataset.usuari || 'convidat'}.alemanya`);
let motor; // es crea quan l'agent s'ha registrat

/* ---------- Nivells ---------- */

const NIVELLS = [
    {
        titol: 'La República de Weimar',
        instruccio: 'Posa cada fet al seu any: arrossega\'l, o fes clic al fet i després a l\'any. Quan acabis, prem «Comprova».',
        nuria: 'Comença just després de la Primera Guerra Mundial.',
        pistes: ['La Constitució es va aprovar el 1919.', 'La crisi econòmica mundial va arribar el 1929.'],
        reptes: FETS_WEIMAR.length,

        preparar(zona, motor) {
            motor.diuNuria(`Benvingut/da a l'arxiu, agent ${memoria.llegir('agent')}. Comença just després de la Primera Guerra Mundial.`);
            // Component nou a cada partida: el listener delegat no es duplica en reiniciar
            this.linia = new LiniaCronologica(clonar('plantilla-linia'));
            FETS_WEIMAR.forEach(({ any }) => this.linia.afegirAny(any));
            MotorJoc.barrejar(FETS_WEIMAR).forEach((fet) => this.linia.afegirFet(fet));
            zona.appendChild(this.linia.arrel);
        },

        comprovar(zona, motor) {
            const resultats = this.linia.corregir();
            if (!resultats) {
                motor.diuNuria('Primer col·loca un fet a cada any de la línia.');
                return;
            }
            const encerts = resultats.filter(({ correcte }) => correcte);
            encerts.forEach(() => {
                motor.encert();
                motor.repteSuperat();
            });

            if (encerts.length < resultats.length) {
                equivocat(`${encerts.length} de ${resultats.length} ben col·locats. T'he tornat els altres a la safata.`);
            }
        },
    },

    {
        titol: 'L\'ascens del nazisme',
        instruccio: 'Llegeix el document de l\'arxiu i tria la targeta del concepte que descriu.',
        nuria: 'En pocs anys, Hitler va convertir una democràcia en una dictadura.',
        pistes: ['Les SA vestien uniforme marró.', 'El Reichstag era el Parlament alemany.', 'Nuremberg és la ciutat de les lleis racials.'],
        reptes: CONCEPTES_NAZISME.length,

        preparar(zona, motor) {
            const preguntes = MotorJoc.barrejar(CONCEPTES_NAZISME);
            let actual = 0;

            const documentArxiu = clonar('plantilla-document');
            const mostrarDocument = () => posarText(documentArxiu, {
                '.targeta-definicio-etiqueta': `DOCUMENT ${actual + 1} DE ${preguntes.length} · QUÈ ÉS?`,
                '.targeta-definicio-text': preguntes[actual].definicio,
            });

            const targetes = document.createElement('div');
            targetes.className = 'targetes';
            targetes.append(...MotorJoc.barrejar(CONCEPTES_NAZISME).map(({ nom, any, il }) => {
                const targeta = posarText(clonar('plantilla-targeta'), { '.fitxa-etiqueta': any, '.fitxa-titol': nom });
                targeta.dataset.nom = nom;
                targeta.querySelector('.targeta-imatge').appendChild(clonar(il));
                return targeta;
            }));

            // Delegació: un sol listener per a les quatre targetes
            targetes.addEventListener('click', (e) => {
                const targeta = e.target.closest('.targeta');
                if (!targeta || actual >= preguntes.length) {
                    return;
                }
                if (targeta.dataset.nom !== preguntes[actual].nom) {
                    targeta.classList.remove('targeta--error');
                    void targeta.offsetWidth; // reinicia l'animació
                    targeta.classList.add('targeta--error');
                    equivocat('No és aquest concepte. Torna a llegir el document.');
                    return;
                }
                const { nom, any } = preguntes[actual++];
                targeta.disabled = true;
                targeta.classList.add('targeta--correcta');
                motor.encert();
                motor.diuNuria(`Correcte! ${nom}, ${any}.`);
                motor.repteSuperat();
                if (actual < preguntes.length) {
                    mostrarDocument();
                }
            });

            mostrarDocument();
            zona.append(documentArxiu, targetes);
        },
    },

    {
        titol: 'La Segona Guerra Mundial',
        instruccio: 'Arrossega cada telegrama a la safata VERTADER o FALS (o fes clic a la safata) abans que s\'acabi el temps.',
        nuria: 'Han arribat telegrames del front. Alguns diuen mentides: arxiva\'ls bé. Necessites 5 encerts.',
        pistes: ['França va caure molt ràpid, el juny de 1940.'],
        reptes: 5,

        preparar(zona, motor) {
            const telegrames = MotorJoc.barrejar(TELEGRAMES);
            const historial = []; // { correcte } de cada telegrama arxivat

            const punts = document.createElement('ol');
            punts.className = 'punts-resultat';
            punts.append(...telegrames.map(() => document.createElement('li')));

            const origen = document.createElement('div');
            origen.className = 'telegrama-origen';
            const safates = clonar('plantilla-safates');

            const encerts = () => historial.reduce((total, { correcte }) => total + (correcte ? 1 : 0), 0);
            const errors = () => historial.length - encerts();

            const mostrarTelegrama = () => {
                const num = historial.length;
                const telegrama = posarText(clonar('plantilla-telegrama'), {
                    '.telegrama-num': `Nº ${String(num + 1).padStart(2, '0')} / ${String(telegrames.length).padStart(2, '0')}`,
                    '.telegrama-text': telegrames[num].text,
                });
                telegrama.id = `telegrama-${num}`;
                MotorJoc.ferArrossegable(telegrama);
                origen.replaceChildren(telegrama);
            };

            // Nivell acabat (superat, sense intents o sense telegrames): no s'arxiva res més
            const acabat = () => encerts() >= this.reptes || errors() >= MotorJoc.INTENTS
                || historial.length >= telegrames.length;

            const arxivar = (safata) => {
                if (acabat()) {
                    return;
                }
                const telegrama = telegrames[historial.length];
                const correcte = (safata.dataset.resposta === 'true') === telegrama.vertader;

                const tira = document.createElement('span');
                tira.className = `tira ${correcte ? 'tira--correcta' : 'tira--incorrecta'}`;
                tira.textContent = telegrama.text;
                safata.querySelector('.safata-vf-llista').appendChild(tira);
                punts.children[historial.length].className = correcte ? 'punt--correcte' : 'punt--incorrecte';
                safata.classList.add(correcte ? 'safata-vf--encert' : 'safata-vf--error');
                setTimeout(() => safata.classList.remove('safata-vf--encert', 'safata-vf--error'), 500);

                historial.push({ correcte });
                if (acabat()) {
                    origen.replaceChildren();
                } else {
                    mostrarTelegrama();
                }

                if (!correcte) {
                    equivocat(`Compte! Aquell telegrama era ${telegrama.vertader ? 'vertader' : 'fals'}.`);
                    return;
                }
                motor.encert();
                motor.diuNuria('Correcte! Telegrama arxivat.');
                motor.repteSuperat();
                if (encerts() === this.reptes) {
                    motor.diuNuria(`Has arxivat bé ${encerts()} de ${historial.length} telegrames.`);
                }
            };

            // Delegació: un sol listener per a les dues safates; arrossegar també hi deixa el telegrama
            safates.addEventListener('click', (e) => {
                const safata = e.target.closest('.safata-vf');
                if (safata) {
                    arxivar(safata);
                }
            });
            safates.querySelectorAll('.safata-vf').forEach((safata) => MotorJoc.ferCasella(safata, () => arxivar(safata)));

            mostrarTelegrama();
            zona.append(punts, origen, safates);
        },
    },
];

/* ---------- Registre d'entrada i inici ---------- */

/** Durant el registre s'amaguen la botonera i el progrés, que encara no fan res */
function mostrarControls(visibles) {
    document.querySelectorAll('.botonera, .progres-nivell').forEach((element) => {
        element.classList.toggle('ocult', !visibles);
    });
}

function iniciar() {
    mostrarControls(true);
    motor = new MotorJoc({ nivells: NIVELLS });
}

/** Formulari previ: valida el nom d'agent i, si és correcte, arrenca el joc */
function demanarRegistre() {
    const formulari = clonar('plantilla-registre');
    const camp = formulari.querySelector('#agent-nom');
    const error = formulari.querySelector('.dossier-error');

    const avisar = (text = '') => {
        error.textContent = text;
        camp.classList.toggle('dossier-any--error', text !== '');
        camp.setAttribute('aria-invalid', String(text !== ''));
    };

    camp.addEventListener('input', () => avisar());

    formulari.addEventListener('submit', (e) => {
        e.preventDefault();
        const nom = camp.value.trim().replace(/\s+/g, ' ');

        if (nom === '') {
            return avisar('Escriu el teu nom d\'agent.');
        }
        if (nom.length < 3 || nom.length > 20) {
            return avisar('El nom ha de tenir entre 3 i 20 caràcters.');
        }
        if (!FORMAT_AGENT.test(nom)) {
            return avisar('Fes servir només lletres i espais, i comença per una lletra.');
        }
        memoria.desar('agent', nom);
        iniciar();
    });

    mostrarControls(false);
    posarText(document, {
        '#repte-eyebrow': 'REGISTRE D\'ENTRADA',
        '#repte-titol': 'Identifica\'t, agent',
        '#repte-instruccio': 'Escriu el teu nom d\'agent per obrir l\'expedient d\'Alemanya.',
        '#nuria-text': 'Hola! Soc la Núria, l\'arxivera. Abans d\'entrar a l\'arxiu, digue\'m el teu nom d\'agent.',
    });
    document.getElementById('zona-joc').replaceChildren(formulari);
    camp.focus();
}

if (memoria.llegir('agent')) {
    iniciar();
} else {
    demanarRegistre();
}
