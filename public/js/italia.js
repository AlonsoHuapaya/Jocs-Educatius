/* Arxiu Històric · Itàlia (1918 – 1945)
   N1 ordenar fets · N2 classificar mesures en carpetes · N3 unir causes i conseqüències.
   L'HTML és a les <template> de jocs/italia.blade.php i l'aspecte a joc.css. */

/* ---------- Utilitats ---------- */

/** Clona el primer element d'una <template> de la vista */
const clonar = (id) => document.getElementById(id).content.firstElementChild.cloneNode(true);

/**
 * Omple els textos d'un element clonat
 * @param {HTMLElement} element
 * @param {Object<string, string>} textos { selector: text }
 */
function omplir(element, textos) {
    Object.entries(textos).forEach(([selector, text]) => {
        element.querySelector(selector).textContent = text;
    });
    return element;
}

/**
 * Resposta equivocada: la peça tremola, es perd un intent i la Núria ho explica
 * @param {MotorJoc} motor
 * @param {HTMLElement} peca Element que ha de tremolar
 * @param {string} classe Classe d'error de la peça
 * @param {string} missatge
 */
function fallar(motor, peca, classe, missatge) {
    peca.classList.remove(classe);
    void peca.offsetWidth; // reinicia l'animació si ja hi era
    peca.classList.add(classe);
    peca.addEventListener('animationend', () => peca.classList.remove(classe), { once: true });
    motor.diuNuria(missatge);
    motor.error();
}

/* ---------- Tauler: col·locar fitxes arrossegant-les o amb dos clics ----------
   El fan servir els nivells 1 i 2. Delegació: un sol listener per a tot el tauler,
   sigui quina sigui la fitxa o la casella on es clica. */

class Tauler {
    #safata;
    #quanColoca;
    #seleccionada = null;

    /**
     * @param {HTMLElement} arrel Element que conté la safata i les caselles
     * @param {(fitxa: HTMLElement, casella: HTMLElement) => void} quanColoca
     */
    constructor(arrel, quanColoca) {
        this.#safata = arrel.querySelector('.linia-safata');
        this.#quanColoca = quanColoca;

        arrel.addEventListener('click', (e) => this.#clic(e.target));
        arrel.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.tabIndex === 0) {
                e.preventDefault();
                this.#clic(e.target);
            }
        });
        MotorJoc.ferCasella(this.#safata, (fitxa) => this.tornarASafata(fitxa));
    }

    afegirFitxa(fitxa) {
        fitxa.tabIndex = 0;
        MotorJoc.ferArrossegable(fitxa);
        this.#safata.appendChild(fitxa);
    }

    afegirCasella(casella) {
        casella.tabIndex = 0;
        MotorJoc.ferCasella(casella, (fitxa) => this.#colocar(fitxa, casella));
    }

    tornarASafata(fitxa) {
        this.#safata.appendChild(fitxa);
        this.#seleccionar(null);
    }

    /** La fitxa ja està resolta: no es pot tornar a moure */
    fixar(fitxa) {
        fitxa.draggable = false;
        fitxa.tabIndex = -1;
    }

    #colocar(fitxa, casella) {
        this.#seleccionar(null);
        this.#quanColoca(fitxa, casella);
    }

    #clic(objectiu) {
        const fitxa = objectiu.closest('.fitxa');
        const casella = objectiu.closest('[data-casella]');

        if (fitxa?.draggable && fitxa !== this.#seleccionada) {
            this.#seleccionar(fitxa);
        } else if (fitxa === this.#seleccionada && fitxa !== null) {
            this.#seleccionar(null);
        } else if (casella && this.#seleccionada) {
            this.#colocar(this.#seleccionada, casella);
        } else if (objectiu.closest('.linia-safata') && this.#seleccionada) {
            this.tornarASafata(this.#seleccionada);
        }
    }

    #seleccionar(fitxa) {
        this.#seleccionada?.classList.remove('fitxa--seleccionada');
        fitxa?.classList.add('fitxa--seleccionada');
        this.#seleccionada = fitxa;
    }
}

/* ---------- Dades ---------- */

const ORDINALS = ['1r', '2n', '3r', '4t', '5è'];

// Nivell 1: en ordre cronològic (el joc els barreja)
const FETS_ASCENS = [
    { id: 'guerra', any: 1918, titol: 'Acaba la Gran Guerra: Itàlia guanya, però queda arruïnada i decebuda' },
    { id: 'fasci', any: 1919, titol: 'Mussolini funda els Fasci di Combattimento a Milà' },
    { id: 'fabriques', any: 1920, titol: 'Bienni roig: els obrers ocupen les fàbriques del nord' },
    { id: 'partit', any: 1921, titol: 'Els Fasci es converteixen en el Partit Nacional Feixista' },
    { id: 'marxa', any: 1922, titol: 'Marxa sobre Roma: el rei nomena Mussolini cap del govern' },
];

// Nivell 2
const CARPETES = [
    { id: 'control', nom: 'Control polític', descripcio: 'Com elimina l\'oposició' },
    { id: 'propaganda', nom: 'Propaganda', descripcio: 'Com convenç la població' },
    { id: 'societat', nom: 'Societat i economia', descripcio: 'Com organitza la vida diària' },
];

const MESURES = [
    { id: 'lleis', carpeta: 'control', etiqueta: '1926', titol: 'Lleis feixistíssimes: el PNF passa a ser el partit únic' },
    { id: 'tribunal', carpeta: 'control', etiqueta: '1926', titol: 'Un tribunal especial jutja i empresona els opositors' },
    { id: 'ovra', carpeta: 'control', etiqueta: '1927', titol: 'L\'OVRA, la policia política secreta, vigila la població' },
    { id: 'duce', carpeta: 'propaganda', etiqueta: 'ANYS 30', titol: 'Culte al Duce: «Mussolini sempre té raó»' },
    { id: 'luce', carpeta: 'propaganda', etiqueta: '1926', titol: 'Els noticiaris del règim són obligatoris a tots els cinemes' },
    { id: 'gra', carpeta: 'societat', etiqueta: '1925', titol: 'Batalla del gra: tot el blat s\'ha de produir a Itàlia' },
    { id: 'balilla', carpeta: 'societat', etiqueta: '1926', titol: 'L\'Opera Balilla enquadra els nens i els joves' },
    { id: 'latera', carpeta: 'societat', etiqueta: '1929', titol: 'Pactes del Laterà: acord amb l\'Església catòlica' },
];

// Nivell 3: el número de cada parella és l'ordre en què van passar
const PARELLES = [
    { id: 'etiopia', any: 1935, causa: 'Itàlia envaeix Etiòpia', consequencia: 'La Societat de Nacions la sanciona i Mussolini s\'acosta a Hitler' },
    { id: 'acer', any: 1939, causa: 'Mussolini signa el Pacte d\'Acer amb Hitler', consequencia: 'El 1940 Itàlia entra a la guerra al costat d\'Alemanya' },
    { id: 'sicilia', any: 1943, causa: 'Els aliats desembarquen a Sicília', consequencia: 'El Gran Consell feixista destitueix Mussolini' },
    { id: 'rescat', any: 1943, causa: 'Paracaigudistes alemanys alliberen Mussolini', consequencia: 'Mussolini crea la República de Salò al nord d\'Itàlia' },
    { id: 'final', any: 1945, causa: 'Els aliats i els partisans alliberen el nord', consequencia: 'Mussolini és capturat mentre fugia i és executat' },
];

/* ---------- Nivells ---------- */

const NIVELLS = [
    {
        titol: 'La marxa sobre Roma',
        instruccio: 'Ordena els fets del primer a l\'últim: arrossega cada fet a la seva posició (o fes clic al fet i després a la casella) i prem «Comprova».',
        nuria: '1918: Itàlia ha guanyat la guerra, però el país està arruïnat i dividit. Com hi arriba Mussolini, al poder?',
        pistes: [
            'Tot comença quan s\'acaba la Primera Guerra Mundial.',
            'Mussolini va fundar els Fasci abans que els obrers ocupessin les fàbriques.',
            'La Marxa sobre Roma és l\'últim pas: després, Mussolini ja governa.',
        ],
        reptes: FETS_ASCENS.length,

        preparar(zona) {
            const arrel = clonar('plantilla-ordre');
            const linia = arrel.querySelector('.linia-ordre');

            this.tauler = new Tauler(arrel, (fitxa, casella) => {
                if (casella.classList.contains('casella--correcta')) {
                    return;
                }
                const anterior = casella.querySelector('.fitxa');
                if (anterior && anterior !== fitxa) {
                    this.tauler.tornarASafata(anterior);
                }
                casella.replaceChildren(fitxa);
                casella.classList.remove('casella--incorrecta');
            });

            FETS_ASCENS.forEach(({ id }, posicio) => {
                const punt = clonar('plantilla-posicio');
                const casella = punt.querySelector('.casella');
                punt.querySelector('.linia-temps-any').textContent = ORDINALS[posicio];
                casella.dataset.resposta = id;
                casella.setAttribute('aria-label', `Posició ${ORDINALS[posicio]}`);
                this.tauler.afegirCasella(casella);
                linia.appendChild(punt);
            });

            MotorJoc.barrejar(FETS_ASCENS).forEach(({ id, titol }) => {
                const fitxa = omplir(clonar('plantilla-fitxa'), { '.fitxa-etiqueta': 'FET', '.fitxa-titol': titol });
                fitxa.id = `fet-${id}`;
                fitxa.dataset.id = id;
                this.tauler.afegirFitxa(fitxa);
            });

            zona.appendChild(arrel);
        },

        comprovar(zona, motor) {
            const pendents = [...zona.querySelectorAll('.casella:not(.casella--correcta)')];
            if (!pendents.every((casella) => casella.querySelector('.fitxa'))) {
                motor.diuNuria('Primer posa un fet a cada posició de la línia.');
                return;
            }

            const resultats = pendents.map((casella) => {
                const fitxa = casella.querySelector('.fitxa');
                const correcte = fitxa.dataset.id === casella.dataset.resposta;
                casella.classList.add(correcte ? 'casella--correcta' : 'casella--incorrecta');

                if (correcte) {
                    // El fet ben col·locat mostra el seu any a la fitxa i a la línia
                    const { any } = FETS_ASCENS.find(({ id }) => id === fitxa.dataset.id);
                    fitxa.querySelector('.fitxa-etiqueta').textContent = any;
                    casella.previousElementSibling.textContent = any;
                    this.tauler.fixar(fitxa);
                } else {
                    this.tauler.tornarASafata(fitxa);
                }
                return correcte;
            });

            const encerts = resultats.filter(Boolean).length;
            const totsResolts = zona.querySelectorAll('.casella--correcta').length === FETS_ASCENS.length;

            if (totsResolts) {
                motor.diuNuria('Amb la Marxa sobre Roma, Mussolini arriba al poder sense guanyar cap elecció.');
            }
            for (let i = 0; i < encerts; i++) {
                motor.encert();
                motor.repteSuperat();
            }
            if (encerts < resultats.length) {
                motor.diuNuria(`${encerts} de ${resultats.length} ben ordenats. T'he tornat els altres a la safata.`);
                motor.error();
            }
        },
    },

    {
        titol: 'El règim de Mussolini',
        instruccio: 'Arxiva cada mesura a la seva carpeta: arrossega-la (o fes clic a la mesura i després a la carpeta).',
        nuria: 'Mussolini ja governa, però encara hi ha oposició. Com construeix el seu règim? Arxiva cada mesura on toca.',
        pistes: [
            'El control polític elimina l\'oposició: partits, policia i tribunals.',
            'La propaganda vol convèncer: el cinema, les consignes i el culte al líder.',
            'El Laterà va ser un acord amb el Papa, i la Balilla organitzava els joves fora de l\'escola.',
        ],
        reptes: MESURES.length,

        preparar(zona, motor) {
            const arrel = clonar('plantilla-classificacio');
            const carpetes = arrel.querySelector('.carpetes');
            let arxivades = 0;

            const tauler = new Tauler(arrel, (fitxa, carpeta) => {
                const mesura = MESURES.find(({ id }) => id === fitxa.dataset.id);

                if (mesura.carpeta !== carpeta.dataset.carpeta) {
                    tauler.tornarASafata(fitxa);
                    fallar(motor, carpeta, 'carpeta--error', `Aquesta mesura no va a «${carpeta.dataset.nom}». Torna-ho a provar.`);
                    return;
                }

                // Encert: la fitxa es converteix en una tira dins de la carpeta
                const tira = clonar('plantilla-tira');
                tira.textContent = mesura.titol;
                tira.title = mesura.titol;
                carpeta.querySelector('.carpeta-contingut').appendChild(tira);
                fitxa.remove();
                arxivades++;

                motor.encert();
                motor.diuNuria(`Correcte: ${carpeta.dataset.nom}.`);
                if (arxivades === MESURES.length) {
                    motor.diuNuria('Control, propaganda i organització de la vida diària: així es construeix un règim totalitari.');
                }
                motor.repteSuperat();
            });

            CARPETES.forEach(({ id, nom, descripcio }) => {
                const carpeta = omplir(clonar('plantilla-carpeta'), { '.carpeta-nom': nom, '.carpeta-descripcio': descripcio });
                carpeta.dataset.carpeta = id;
                carpeta.dataset.nom = nom;
                carpeta.setAttribute('aria-label', `Carpeta ${nom}`);
                tauler.afegirCasella(carpeta);
                carpetes.appendChild(carpeta);
            });

            MotorJoc.barrejar(MESURES).forEach(({ id, etiqueta, titol }) => {
                const fitxa = omplir(clonar('plantilla-fitxa'), { '.fitxa-etiqueta': etiqueta, '.fitxa-titol': titol });
                fitxa.id = `mesura-${id}`;
                fitxa.dataset.id = id;
                tauler.afegirFitxa(fitxa);
            });

            zona.appendChild(arrel);
        },
    },

    {
        titol: 'La guerra i la caiguda',
        instruccio: 'Uneix cada causa amb la seva conseqüència: fes clic a la causa i després a la conseqüència (o arrossega-la a sobre).',
        nuria: 'L\'aliança amb Hitler porta Itàlia a la guerra. Uneix cada causa amb la seva conseqüència abans que s\'acabi el temps.',
        pistes: [
            'Primer ve l\'expansió a l\'Àfrica, després l\'aliança amb Hitler i, el 1943, tot s\'enfonsa.',
        ],
        reptes: PARELLES.length,

        preparar(zona, motor) {
            const arrel = clonar('plantilla-parelles');
            const causes = arrel.querySelector('[data-tipus="causa"]');
            const consequencies = arrel.querySelector('[data-tipus="consequencia"]');
            let seleccionada = null;
            let unides = 0;

            const seleccionar = (causa) => {
                seleccionada?.classList.remove('parella--seleccionada');
                causa?.classList.add('parella--seleccionada');
                seleccionada = causa;
            };

            const unir = (causa, consequencia) => {
                seleccionar(null);
                if (consequencia.disabled) {
                    return;
                }
                if (causa.dataset.id !== consequencia.dataset.id) {
                    fallar(motor, consequencia, 'parella--error', 'Aquesta no n\'és la conseqüència. Pensa què va passar just després.');
                    return;
                }

                // Les dues peces queden unides amb el mateix número
                const numero = String(PARELLES.findIndex(({ id }) => id === causa.dataset.id) + 1);
                [causa, consequencia].forEach((parella) => {
                    parella.classList.add('parella--unida');
                    parella.querySelector('.parella-numero').textContent = numero;
                    parella.disabled = true;
                    parella.draggable = false;
                });
                unides++;

                motor.encert();
                motor.diuNuria(`Correcte! ${consequencia.querySelector('.parella-text').textContent}.`);
                if (unides === PARELLES.length) {
                    motor.diuNuria('La Marxa sobre Roma va inspirar Hitler: el 1923 va intentar el seu propi cop a Munic. Obrim l\'expedient d\'Alemanya.');
                }
                motor.repteSuperat();
            };

            MotorJoc.barrejar(PARELLES).forEach(({ id, any, causa }) => {
                const boto = omplir(clonar('plantilla-parella'), { '.fitxa-etiqueta': any, '.parella-text': causa });
                boto.id = `causa-${id}`;
                boto.dataset.id = id;
                MotorJoc.ferArrossegable(boto);
                causes.appendChild(boto);
            });

            MotorJoc.barrejar(PARELLES).forEach(({ id, consequencia }) => {
                const boto = omplir(clonar('plantilla-parella'), { '.fitxa-etiqueta': 'CONSEQÜÈNCIA', '.parella-text': consequencia });
                boto.dataset.id = id;
                MotorJoc.ferCasella(boto, (causa) => unir(causa, boto));
                consequencies.appendChild(boto);
            });

            // Delegació: un sol listener per a totes les causes i conseqüències
            arrel.addEventListener('click', (e) => {
                const parella = e.target.closest('.parella');
                if (!parella || parella.disabled) {
                    return;
                }
                if (parella.parentElement === causes) {
                    seleccionar(parella === seleccionada ? null : parella);
                } else if (seleccionada) {
                    unir(seleccionada, parella);
                } else {
                    motor.diuNuria('Primer tria una causa de la columna de l\'esquerra.');
                }
            });

            zona.appendChild(arrel);
        },
    },
];

const motor = new MotorJoc({ nivells: NIVELLS });
