/* Arxiu Històric · Espanya (1931 – 1975)
   N1 situar fets al mapa · N2 triar targetes · N3 formulari amb l'any.
   L'HTML és a les <template> de jocs/espanya.blade.php i l'aspecte a joc.css. */

/* ---------- Utilitats ---------- */

const clonar = (id) => document.getElementById(id).content.firstElementChild.cloneNode(true);

function omplir(element, textos) {
    Object.entries(textos).forEach(([selector, text]) => {
        element.querySelector(selector).textContent = text;
    });
    return element;
}

/** Errors: perd un intent i la Núria explica què ha fallat */
function fallar(motor, missatge) {
    motor.error();
    motor.diuNuria(missatge);
}

/* ---------- Tauler de fitxes: arrossegar o fer clic a la fitxa i després al lloc ----------
   Delegació: un sol listener a l'arrel per a totes les fitxes i llocs. */

class TaulerFitxes {
    #seleccionada = null;

    constructor(arrel) {
        this.arrel = arrel;
        this.safata = arrel.querySelector('.linia-safata');
        arrel.addEventListener('click', (e) => this.#clic(e.target));
        arrel.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[tabindex]')) {
                e.preventDefault();
                this.#clic(e.target);
            }
        });
        MotorJoc.ferCasella(this.safata, (fitxa) => this.tornarASafata(fitxa));
    }

    afegirFitxa(fitxa) {
        fitxa.tabIndex = 0;
        MotorJoc.ferArrossegable(fitxa);
        this.safata.appendChild(fitxa);
    }

    afegirLloc(lloc) {
        lloc.tabIndex = 0;
        MotorJoc.ferCasella(lloc, (fitxa) => this.colocar(fitxa, lloc));
    }

    colocar(fitxa, lloc) {
        if (lloc.classList.contains('lloc--correcte')) {
            return;
        }
        const forat = lloc.querySelector('[data-forat]');
        const anterior = forat.querySelector('.fitxa');
        if (anterior && anterior !== fitxa) {
            this.tornarASafata(anterior);
        }
        forat.replaceChildren(fitxa);
        lloc.classList.remove('lloc--incorrecte');
        this.#seleccionar(null);
    }

    tornarASafata(fitxa) {
        const forat = fitxa.closest('[data-forat]');
        this.safata.appendChild(fitxa);
        if (forat) {
            forat.textContent = 'Deixa-hi un fet';
        }
        this.#seleccionar(null);
    }

    /** Corregeix els llocs pendents. Torna null si encara n'hi ha de buits. */
    comprovar() {
        const pendents = [...this.arrel.querySelectorAll('[data-resposta]:not(.lloc--correcte)')];
        if (!pendents.every((lloc) => lloc.querySelector('.fitxa'))) {
            return null;
        }
        return pendents.map((lloc) => {
            const fitxa = lloc.querySelector('.fitxa');
            const correcte = fitxa.dataset.id === lloc.dataset.resposta;
            lloc.classList.add(correcte ? 'lloc--correcte' : 'lloc--incorrecte');
            if (correcte) {
                fitxa.draggable = false;
                fitxa.tabIndex = -1;
            } else {
                this.tornarASafata(fitxa);
            }
            return { lloc, correcte };
        });
    }

    #clic(objectiu) {
        const fitxa = objectiu.closest('.fitxa');
        const lloc = objectiu.closest('[data-resposta]');

        if (fitxa && !fitxa.closest('.lloc--correcte')) {
            this.#seleccionar(this.#seleccionada === fitxa ? null : fitxa);
        } else if (lloc && this.#seleccionada) {
            this.colocar(this.#seleccionada, lloc);
        } else if (objectiu.closest('.linia-safata') && this.#seleccionada) {
            this.tornarASafata(this.#seleccionada);
        }
    }

    #seleccionar(fitxa) {
        this.#seleccionada?.classList.remove('fitxa--seleccionada');
        fitxa?.classList.add('fitxa--seleccionada');
        this.#seleccionada = fitxa;
        this.arrel.classList.toggle('amb-seleccio', fitxa !== null);
    }
}

/* ---------- Dades ---------- */

// costat: on va la informació respecte del punt (per defecte, a sota)
const FETS_REPUBLICA = [
    { id: 'madrid', ciutat: 'MADRID', any: 1931, titol: 'Es proclama la Segona República', costat: 'dreta' },
    { id: 'barcelona', ciutat: 'BARCELONA', any: 1931, titol: 'Macià proclama la República Catalana', costat: 'amunt' },
    { id: 'sevilla', ciutat: 'SEVILLA', any: 1932, titol: 'Cop d\'estat del general Sanjurjo', costat: 'amunt' },
    { id: 'oviedo', ciutat: 'OVIEDO', any: 1934, titol: 'Revolució dels miners d\'Astúries' },
];

const CONCEPTES_GUERRA = [
    { nom: 'Brigades Internacionals', any: 1936, il: 'il-brigades', definicio: 'Voluntaris de més de cinquanta països que van venir a lluitar al costat de la República.' },
    { nom: 'Bombardeig de Guernica', any: 1937, il: 'il-guernica', definicio: 'Atac aeri de la Legió Còndor alemanya que va arrasar una vila basca. Picasso el va convertir en un quadre.' },
    { nom: 'Batalla de l\'Ebre', any: 1938, il: 'il-ebre', definicio: 'La batalla més llarga i sagnant de la guerra. La derrota va deixar la República gairebé sense exèrcit.' },
    { nom: 'Comitè de No-Intervenció', any: 1936, il: 'il-no-intervencio', definicio: 'Acord de les potències europees per no ajudar cap bàndol. Alemanya i Itàlia no el van complir.' },
];

const FETS_FRANQUISME = [
    { any: 1939, text: 'Acaba la Guerra Civil i comença la dictadura del general Franco.' },
    { any: 1953, text: 'Espanya signa els Pactes de Madrid amb els Estats Units.' },
    { any: 1955, text: 'Espanya és admesa a l\'Organització de les Nacions Unides (ONU).' },
    { any: 1959, text: 'El Pla d\'Estabilització obre l\'economia i comença el «desarrollisme».' },
    { any: 1975, text: 'Mor Franco i Joan Carles I és proclamat rei.' },
];

const FORMAT_ANY = /^\d{4}$/; // exactament quatre xifres
const [INICI, FI] = [1939, 1975];

/* ---------- Nivells ---------- */

const NIVELLS = [
    {
        titol: 'La Segona República',
        instruccio: 'Situa cada fet a la seva ciutat: arrossega\'l, o fes clic al fet i després a la ciutat. Quan acabis, prem «Comprova».',
        nuria: 'Abril de 1931: el rei Alfons XIII marxa i neix la República. Però no tot passa a Madrid…',
        pistes: [
            'El govern provisional va proclamar la República a la Puerta del Sol.',
            'Francesc Macià era el líder d\'Esquerra Republicana de Catalunya.',
            'La revolució de 1934 la van protagonitzar els miners del nord.',
        ],
        reptes: FETS_REPUBLICA.length,

        preparar(zona) {
            // Tauler nou a cada partida: així el listener delegat no es duplica en reiniciar
            const arrel = clonar('plantilla-tauler');
            zona.appendChild(arrel);
            this.tauler = new TaulerFitxes(arrel);

            FETS_REPUBLICA.forEach(({ id, ciutat, costat }) => {
                const agulla = omplir(clonar('plantilla-agulla'), { '.agulla-nom': ciutat });
                Object.assign(agulla.dataset, { resposta: id, nom: ciutat });
                agulla.classList.add(`agulla--${id}`, ...(costat ? [`agulla--${costat}`] : []));
                arrel.querySelector('.mapa-joc').appendChild(agulla);
                this.tauler.afegirLloc(agulla);
            });

            MotorJoc.barrejar(FETS_REPUBLICA).forEach(({ id, any, titol }) => {
                const fitxa = omplir(clonar('plantilla-fitxa'), { '.fitxa-etiqueta': `${any} · FET`, '.fitxa-titol': titol });
                fitxa.id = `fet-${id}`;
                fitxa.dataset.id = id;
                this.tauler.afegirFitxa(fitxa);
            });
        },

        comprovar(zona, motor) {
            const resultats = this.tauler.comprovar();
            if (!resultats) {
                motor.diuNuria('Primer situa un fet a cada ciutat del mapa.');
                return;
            }
            const encerts = resultats.filter(({ correcte }) => correcte);
            encerts.forEach(({ lloc }) => {
                motor.encert();
                motor.repteSuperat();
            });

            if (encerts.length < resultats.length) {
                fallar(motor, `${encerts.length} de ${resultats.length} ben situats. T'he tornat els altres a la safata.`);
            }
        },
    },

    {
        titol: 'La Guerra Civil',
        instruccio: 'Llegeix el document de l\'arxiu i tria la targeta del concepte que descriu.',
        nuria: 'Juliol de 1936: un cop d\'estat militar contra la República comença la guerra.',
        pistes: [
            'Les Brigades estaven formades per voluntaris estrangers.',
            'Guernica és un poble del País Basc.',
            'L\'Ebre és un riu: la batalla va durar gairebé quatre mesos.',
        ],
        reptes: CONCEPTES_GUERRA.length,

        preparar(zona, motor) {
            const preguntes = MotorJoc.barrejar(CONCEPTES_GUERRA);
            let actual = 0;

            const documentArxiu = clonar('plantilla-document');
            const mostrarDocument = () => omplir(documentArxiu, {
                '.targeta-definicio-etiqueta': `DOCUMENT ${actual + 1} DE ${preguntes.length} · QUÈ ÉS?`,
                '.targeta-definicio-text': preguntes[actual].definicio,
            });

            const targetes = document.createElement('div');
            targetes.className = 'targetes';
            targetes.append(...MotorJoc.barrejar(CONCEPTES_GUERRA).map(({ nom, any, il }) => {
                const targeta = omplir(clonar('plantilla-targeta'), { '.fitxa-etiqueta': any, '.fitxa-titol': nom });
                targeta.dataset.nom = nom;
                targeta.querySelector('.targeta-imatge').appendChild(clonar(il));
                return targeta;
            }));

            // Delegació: un sol listener per a totes les targetes
            targetes.addEventListener('click', (e) => {
                const targeta = e.target.closest('.targeta');
                if (!targeta || actual >= preguntes.length) {
                    return;
                }
                if (targeta.dataset.nom !== preguntes[actual].nom) {
                    targeta.classList.remove('targeta--error');
                    void targeta.offsetWidth; // reinicia l'animació
                    targeta.classList.add('targeta--error');
                    fallar(motor, 'No és aquest concepte. Torna a llegir el document.');
                    return;
                }
                targeta.disabled = true;
                targeta.classList.add('targeta--correcta');
                actual++;
                motor.encert();
                motor.diuNuria(`Correcte! ${targeta.dataset.nom}.`);
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
        titol: 'El franquisme',
        instruccio: 'Escriu l\'any de cada fet i arxiva l\'expedient abans que s\'acabi el temps.',
        nuria: 'L\'arxiu del règim està desordenat. Posa l\'any a cada expedient: et diré si és abans o després.',
        pistes: ['Els Pactes amb els Estats Units i l\'entrada a l\'ONU van ser a mitjans dels anys cinquanta, amb dos anys de diferència.'],
        reptes: FETS_FRANQUISME.length,

        preparar(zona, motor) {
            const fets = MotorJoc.barrejar(FETS_FRANQUISME);
            let actual = 0;

            const resultats = document.createElement('ol');
            resultats.className = 'punts-resultat';
            resultats.append(...fets.map(() => document.createElement('li')));

            const dossier = clonar('plantilla-dossier');
            const camp = dossier.querySelector('.dossier-any');
            const boto = dossier.querySelector('button');

            const avisar = (text = '') => {
                dossier.querySelector('.dossier-error').textContent = text;
                camp.classList.toggle('dossier-any--error', text !== '');
                camp.setAttribute('aria-invalid', String(text !== ''));
            };

            const mostrarFet = (enfocar = true) => {
                omplir(dossier, {
                    '.dossier-numero': `Nº ${String(actual + 1).padStart(2, '0')} / ${String(fets.length).padStart(2, '0')}`,
                    '.dossier-text': fets[actual].text,
                });
                camp.value = '';
                camp.disabled = boto.disabled = false;
                dossier.classList.remove('dossier--arxivat');
                avisar();
                if (enfocar) {
                    camp.focus();
                }
            };

            camp.addEventListener('input', () => avisar());

            dossier.addEventListener('submit', (e) => {
                e.preventDefault();
                const valor = camp.value.trim();
                const any = Number(valor);
                const fet = fets[actual];

                // Format i rang: només avisen, no resten intents
                if (!FORMAT_ANY.test(valor)) {
                    return avisar('Escriu l\'any amb quatre xifres, per exemple 1960.');
                }
                if (any < INICI || any > FI) {
                    return avisar(`El franquisme va de ${INICI} a ${FI}.`);
                }
                if (any !== fet.any) {
                    avisar(any < fet.any ? 'Massa aviat: va passar més tard.' : 'Massa tard: va passar abans.');
                    return fallar(motor, 'Aquest any no és correcte.');
                }

                dossier.classList.add('dossier--arxivat');
                camp.disabled = boto.disabled = true;
                resultats.children[actual++].className = 'punt--correcte';
                motor.encert();
                motor.diuNuria(`Correcte: ${fet.any}. Expedient arxivat.`);
                motor.repteSuperat();
                if (actual < fets.length) {
                    setTimeout(mostrarFet, 900);
                }
            });

            zona.append(resultats, dossier);
            mostrarFet(false);
        },
    },
];

const motor = new MotorJoc({ nivells: NIVELLS });