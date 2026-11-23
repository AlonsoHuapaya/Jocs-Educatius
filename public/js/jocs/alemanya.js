const motor = new MotorJoc({
  nivells: [
    {
      titol: "La República de Weimar",
      instruccio: "Fes clic als fets en ordre cronològic.",
      nuria: "Comença just després de la Primera Guerra Mundial.",
      pistes: [
        "La Constitució es va aprovar el 1919.",
        "La crisi econòmica mundial va arribar el 1929.",
      ],
      reptes: 4,
      preparar(zona, motor) {
        const fets = [
          { text: "S'aprova la Constitució de Weimar", any: 1919 },
          { text: "Hiperinflació: el marc no val res", any: 1923 },
          { text: "Crac del 29 i atur massiu", any: 1929 },
          { text: "Hitler és nomenat canceller", any: 1933 },
        ];
        let seguent = 0; // es reinicia cada vegada que es prepara el nivell
        zona.innerHTML = "";

        [...fets].sort(() => Math.random() - 0.5).forEach((fet) => {
          const boto = document.createElement("button");
          boto.className = "btn-joc btn-joc--secundari";
          boto.textContent = fet.text;
          boto.addEventListener("click", () => {
            if (fet.any === fets[seguent].any) {
              boto.disabled = true;
              boto.textContent = `${fet.any} · ${fet.text}`;
              seguent++;
              motor.encert();
              motor.afegirDocument(String(fet.any));
              motor.repteSuperat();
            } else {
              motor.error();
              motor.diuNuria("Aquest fet va passar més tard. Torna-ho a provar!");
            }
          });
          zona.appendChild(boto);
        });
      },
    },
    // nivell 2: L'ascens del nazisme
    // nivell 3: La Segona Guerra Mundial
  ],
});