function barrejar(llista) {
  return [...llista].sort(() => Math.random() - 0.5);
}

function crearBoto(text, classe) {
  const boto = document.createElement("button");
  boto.type = "button";
  boto.className = `btn-joc ${classe}`;
  boto.textContent = text;
  return boto;
}

const motor = new MotorJoc({
  nivells: [
    // NIVELL 1: arrossegar els fets a la línia cronològica
    {
      titol: "La República de Weimar",
      instruccio: "Arrossega cada fet al seu any de la línia cronològica i prem «Comprova».",
      nuria: "Comença just després de la Primera Guerra Mundial.",
      pistes: [
        "La Constitució es va aprovar el 1919.",
        "La crisi econòmica mundial va arribar el 1929.",
      ],
      reptes: 4,
      preparar(zona) {
        const fets = [
          { id: "constitucio", text: "S'aprova la Constitució de Weimar", any: 1919 },
          { id: "hiperinflacio", text: "Hiperinflació: el marc no val res", any: 1923 },
          { id: "crac", text: "Crac del 29 i atur massiu", any: 1929 },
          { id: "canceller", text: "Hitler és nomenat canceller", any: 1933 },
        ];
        zona.innerHTML = "";

        // Safata amb els fets barrejats
        const safata = document.createElement("div");
        safata.className = "linia-safata";
        safata.id = "safata-fets";
        barrejar(fets).forEach((fet) => {
          const fitxa = document.createElement("div");
          fitxa.className = "fitxa";
          fitxa.id = `fet-${fet.id}`;
          fitxa.dataset.any = fet.any;
          fitxa.innerHTML = '<span class="fitxa-etiqueta">FET</span>';
          const text = document.createElement("span");
          text.className = "fitxa-titol";
          text.textContent = fet.text;
          fitxa.appendChild(text);
          MotorJoc.ferArrossegable(fitxa);
          safata.appendChild(fitxa);
        });
        // Es poden tornar fitxes a la safata
        MotorJoc.ferCasella(safata, (fitxa) => safata.appendChild(fitxa));

        // Línia cronològica: un punt per any, amb la seva casella
        const linia = document.createElement("div");
        linia.className = "linia-temps";
        fets.forEach((fet) => {
          const punt = document.createElement("div");
          punt.className = "linia-temps-punt";

          const any = document.createElement("span");
          any.className = "linia-temps-any";
          any.textContent = fet.any;

          const casella = document.createElement("div");
          casella.className = "casella";
          casella.dataset.any = fet.any;
          casella.textContent = "?";
          MotorJoc.ferCasella(casella, (fitxa, desti) => {
            if (desti.classList.contains("casella--correcta")) {
              return; // aquest any ja està resolt
            }
            const anterior = desti.querySelector(".fitxa");
            if (anterior) {
              safata.appendChild(anterior); // l'anterior torna a la safata
            }
            desti.textContent = "";
            desti.classList.remove("casella--incorrecta");
            desti.appendChild(fitxa);
          });

          punt.appendChild(any);
          punt.appendChild(casella);
          linia.appendChild(punt);
        });

        zona.appendChild(linia);
        zona.appendChild(safata);
      },
      comprovar(zona, motor) {
        const pendents = [...zona.querySelectorAll(".linia-temps .casella:not(.casella--correcta)")];

        if (pendents.some((casella) => !casella.querySelector(".fitxa"))) {
          motor.diuNuria("Primer col·loca un fet a cada any de la línia.");
          return;
        }

        const safata = zona.querySelector("#safata-fets");
        let hiHaErrors = false;

        pendents.forEach((casella) => {
          const fitxa = casella.querySelector(".fitxa");
          if (fitxa.dataset.any === casella.dataset.any) {
            casella.classList.add("casella--correcta");
            fitxa.draggable = false;
            motor.encert();
            motor.afegirDocument(casella.dataset.any);
            motor.repteSuperat();
          } else {
            hiHaErrors = true;
            casella.classList.add("casella--incorrecta");
            casella.textContent = "?";
            safata.appendChild(fitxa);
          }
        });

        if (hiHaErrors) {
          motor.error(); // un sol error per comprovació
          motor.diuNuria("Alguns fets no són al seu any. T'he tornat els incorrectes a la safata.");
        }
      },
    },

    // NIVELL 2: llegir el document i triar la targeta del concepte
    {
      titol: "L'ascens del nazisme",
      instruccio: "Llegeix el document de l'arxiu i tria la targeta del concepte que descriu.",
      nuria: "En pocs anys, Hitler va convertir una democràcia en una dictadura.",
      pistes: [
        "Les SA vestien uniforme marró.",
        "El Reichstag era el Parlament alemany.",
        "Nuremberg és la ciutat de les lleis racials.",
      ],
      reptes: 4,
      preparar(zona, motor) {
        const conceptes = [
          {
            nom: "SA",
            any: "1921",
            definicio: "Milícia paramilitar del partit nazi. Els seus membres, els «camises marrons», atacaven els rivals polítics al carrer.",
            imatge: `<svg viewBox="0 0 120 90" aria-hidden="true">
              <path d="M40 18 L52 12 Q60 20 68 12 L80 18 L98 32 L88 46 L80 40 L80 82 L40 82 L40 40 L32 46 L22 32 Z" fill="#8a6a43"/>
              <path d="M28 28 L33 24 L41 38 L36 42 Z" style="fill:var(--accent)"/>
              <path d="M52 12 L60 26 L68 12" fill="none" stroke="#5c4630" stroke-width="3"/>
              <circle cx="60" cy="40" r="2.5" fill="#e8dcc0"/><circle cx="60" cy="54" r="2.5" fill="#e8dcc0"/><circle cx="60" cy="68" r="2.5" fill="#e8dcc0"/>
              <rect x="40" y="62" width="40" height="5" fill="#3a2e22"/>
            </svg>`,
          },
          {
            nom: "Incendi del Reichstag",
            any: "1933",
            definicio: "Foc al Parlament alemany que Hitler va fer servir d'excusa per suspendre les llibertats i perseguir els comunistes.",
            imatge: `<svg viewBox="0 0 120 90" aria-hidden="true">
              <path d="M60 2 Q51 13 55 21 Q48 17 47 26 Q58 33 70 26 Q72 16 65 15 Q67 8 60 2 Z" style="fill:var(--accent)"/>
              <path d="M30 30 Q26 36 30 40 L36 40 Q38 34 33 33 Z" style="fill:var(--accent)"/>
              <path d="M88 30 Q84 36 88 40 L94 40 Q96 34 91 33 Z" style="fill:var(--accent)"/>
              <path d="M46 30 Q60 12 74 30 Z" fill="#e8dcc0"/>
              <path d="M22 42 L60 30 L98 42 Z" fill="#e8dcc0"/>
              <rect x="22" y="42" width="76" height="5" fill="#e8dcc0"/>
              <g fill="#c9bfa6"><rect x="27" y="49" width="6" height="25"/><rect x="41" y="49" width="6" height="25"/><rect x="55" y="49" width="6" height="25"/><rect x="69" y="49" width="6" height="25"/><rect x="83" y="49" width="6" height="25"/></g>
              <rect x="18" y="74" width="84" height="7" fill="#e8dcc0"/>
            </svg>`,
          },
          {
            nom: "Gestapo",
            any: "1933",
            definicio: "Policia secreta de l'Estat nazi. Vigilava la població, perseguia els opositors i els enviava a camps de concentració.",
            imatge: `<svg viewBox="0 0 120 90" aria-hidden="true">
              <ellipse cx="44" cy="58" rx="32" ry="7" fill="#3a3833"/>
              <path d="M23 58 Q24 28 44 28 Q64 28 65 58 Z" fill="#4a4740"/>
              <path d="M36 30 Q44 38 52 30" fill="none" stroke="#2c2a26" stroke-width="3"/>
              <rect x="24" y="48" width="40" height="6" style="fill:var(--accent)"/>
              <circle cx="86" cy="40" r="14" fill="none" stroke="#e8dcc0" stroke-width="5"/>
              <circle cx="86" cy="40" r="4" style="fill:var(--accent)"/>
              <path d="M96 50 L108 64" stroke="#e8dcc0" stroke-width="8" stroke-linecap="round"/>
            </svg>`,
          },
          {
            nom: "Lleis de Nuremberg",
            any: "1935",
            definicio: "Lleis racials que van treure la ciutadania alemanya als jueus i els van prohibir casar-se amb no jueus.",
            imatge: `<svg viewBox="0 0 120 90" aria-hidden="true">
              <rect x="24" y="10" width="48" height="66" fill="#e8dcc0"/>
              <g fill="#8c8473"><rect x="31" y="19" width="34" height="3"/><rect x="31" y="27" width="34" height="3"/><rect x="31" y="35" width="26" height="3"/><rect x="31" y="43" width="34" height="3"/></g>
              <circle cx="58" cy="62" r="9" fill="none" style="stroke:var(--accent)" stroke-width="3"/>
              <path d="M53 62 L63 62 M58 57 L58 67" style="stroke:var(--accent)" stroke-width="2"/>
              <g transform="rotate(-35 94 46)">
                <rect x="81" y="34" width="27" height="12" rx="2" style="fill:var(--accent)"/>
                <rect x="92" y="46" width="5" height="28" fill="#c9bfa6"/>
              </g>
            </svg>`,
          },
        ];
        const preguntes = barrejar(conceptes);
        let actual = 0;
        zona.innerHTML = "";

        // Document de l'arxiu amb la definició
        const documentArxiu = document.createElement("div");
        documentArxiu.className = "targeta-definicio";
        const etiqueta = document.createElement("p");
        etiqueta.className = "targeta-definicio-etiqueta";
        const definicio = document.createElement("p");
        definicio.className = "targeta-definicio-text";
        definicio.setAttribute("aria-live", "polite");
        documentArxiu.appendChild(etiqueta);
        documentArxiu.appendChild(definicio);

        function mostrarDocument() {
          etiqueta.textContent = `DOCUMENT ${actual + 1} DE ${preguntes.length} · QUÈ ÉS?`;
          definicio.textContent = preguntes[actual].definicio;
        }

        // Targetes dels conceptes
        const targetes = document.createElement("div");
        targetes.className = "targetes";

        barrejar(conceptes).forEach((concepte) => {
          const targeta = document.createElement("button");
          targeta.type = "button";
          targeta.className = "targeta";
          targeta.innerHTML = `
            <span class="targeta-imatge">${concepte.imatge}</span>
            <span class="targeta-cos">
              <span class="fitxa-etiqueta">${concepte.any}</span>
              <span class="fitxa-titol">${concepte.nom}</span>
            </span>`;

          targeta.addEventListener("click", () => {
            if (concepte.nom === preguntes[actual].nom) {
              targeta.disabled = true;
              targeta.classList.add("targeta--correcta");
              actual++;
              motor.encert();
              motor.diuNuria(`Correcte! ${concepte.nom}, ${concepte.any}.`);
              motor.repteSuperat();
              if (actual < preguntes.length) {
                mostrarDocument();
              }
            } else {
              targeta.classList.remove("targeta--error");
              void targeta.offsetWidth; // reinicia l'animació si es torna a fallar
              targeta.classList.add("targeta--error");
              motor.error();
              motor.diuNuria("No és aquest concepte. Torna a llegir el document.");
            }
          });

          targetes.appendChild(targeta);
        });

        mostrarDocument();
        zona.appendChild(documentArxiu);
        zona.appendChild(targetes);
      },
    },

    // NIVELL 3: arxivar cada telegrama a la safata VERTADER o FALS
    {
      titol: "La Segona Guerra Mundial",
      instruccio: "Arrossega cada telegrama a la safata VERTADER o FALS (o toca la safata) abans que s'acabi el temps.",
      nuria: "Han arribat telegrames del front. Alguns diuen mentides: arxiva'ls bé. Necessites 5 encerts.",
      pistes: ["França va caure molt ràpid, el juny de 1940."],
      reptes: 5,
      preparar(zona, motor) {
        const afirmacions = barrejar([
          { text: "La guerra va començar el 1939 amb la invasió alemanya de Polònia.", vertader: true },
          { text: "Alemanya i la Unió Soviètica van signar un pacte de no-agressió el 1939.", vertader: true },
          { text: "França va resistir la invasió alemanya fins al 1944.", vertader: false },
          { text: "L'Operació Barbarroja va ser la invasió alemanya de la Unió Soviètica.", vertader: true },
          { text: "Els Estats Units van entrar a la guerra després de l'atac a Pearl Harbor.", vertader: true },
          { text: "La batalla de Stalingrad va ser una gran victòria alemanya.", vertader: false },
          { text: "El desembarcament de Normandia va tenir lloc el juny de 1944.", vertader: true },
          { text: "Hitler va ser jutjat i condemnat als judicis de Nuremberg.", vertader: false },
        ]);
        let actual = 0;
        let encerts = 0;
        let errors = 0;
        zona.innerHTML = "";

        // Punts de resultat: un per telegrama
        const resultats = document.createElement("ol");
        resultats.className = "punts-resultat";
        resultats.setAttribute("aria-label", "Telegrames arxivats");
        afirmacions.forEach(() => resultats.appendChild(document.createElement("li")));

        // Lloc on apareix el telegrama
        const origen = document.createElement("div");
        origen.className = "telegrama-origen";

        // Les dues safates
        const safates = document.createElement("div");
        safates.className = "safates-vf";

        function crearSafata(resposta) {
          const safata = document.createElement("button");
          safata.type = "button";
          safata.className = `safata-vf safata-vf--${resposta ? "vertader" : "fals"}`;
          safata.innerHTML = `
            <span class="safata-vf-icona" aria-hidden="true">
              ${resposta
                ? '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3"/></svg>'
                : '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="3"/></svg>'}
            </span>
            <span class="safata-vf-nom">${resposta ? "VERTADER" : "FALS"}</span>
            <span class="safata-vf-llista"></span>`;
          safata.addEventListener("click", () => deixar(resposta, safata));
          MotorJoc.ferCasella(safata, (fitxa, desti) => deixar(resposta, desti));
          safates.appendChild(safata);
        }

        function mostrarTelegrama() {
          origen.innerHTML = "";
          const telegrama = document.createElement("div");
          telegrama.className = "telegrama";
          telegrama.id = `telegrama-${actual}`;
          telegrama.innerHTML = `
            <span class="telegrama-cap">
              <span>TELEGRAMA · FRONT</span>
              <span>Nº ${String(actual + 1).padStart(2, "0")} / ${String(afirmacions.length).padStart(2, "0")}</span>
            </span>`;
          const text = document.createElement("span");
          text.className = "telegrama-text";
          text.textContent = afirmacions[actual].text;
          telegrama.appendChild(text);
          MotorJoc.ferArrossegable(telegrama);
          origen.appendChild(telegrama);
        }

        function deixar(resposta, safata) {
          // Nivell ja acabat (superat o sense intents): no s'arxiva res més
          if (actual >= afirmacions.length || encerts >= 5 || errors >= MotorJoc.INTENTS) {
            return;
          }
          const afirmacio = afirmacions[actual];
          const correcte = resposta === afirmacio.vertader;

          // Tira petita del telegrama dins la safata
          const tira = document.createElement("span");
          tira.className = `tira ${correcte ? "tira--correcta" : "tira--incorrecta"}`;
          tira.textContent = afirmacio.text;
          safata.querySelector(".safata-vf-llista").appendChild(tira);

          resultats.children[actual].className = correcte ? "punt--correcte" : "punt--incorrecte";
          safata.classList.add(correcte ? "safata-vf--encert" : "safata-vf--error");
          setTimeout(() => safata.classList.remove("safata-vf--encert", "safata-vf--error"), 500);

          actual++;
          if (actual < afirmacions.length) {
            mostrarTelegrama();
          } else {
            origen.innerHTML = "";
          }

          if (correcte) {
            encerts++;
            motor.encert();
            motor.diuNuria("Correcte! Telegrama arxivat.");
            motor.repteSuperat();
          } else {
            errors++;
            motor.diuNuria(`Compte! Aquell telegrama era ${afirmacio.vertader ? "vertader" : "fals"}.`);
            motor.error();
          }
        }

        crearSafata(true);
        crearSafata(false);
        mostrarTelegrama();

        zona.appendChild(resultats);
        zona.appendChild(origen);
        zona.appendChild(safates);
      },
    },
  ],
});