USE JocsEducatius;
GO

/* =========================================================
   JOC D'ESPANYA · De la República al franquisme
   - JOC.nom ha de ser exactament 'Espanya' (el mateix que a config/jocs.php):
     PartidaController busca el joc pel nom.
   - NIVELL.ordreDesbloqueig és el número del nivell (1, 2, 3):
     PartidaController busca el nivell per aquest camp.
   Per això no cal fixar els id a mà.
   ========================================================= */

INSERT INTO JOC (nom) VALUES (N'Espanya');

DECLARE @idEspanya INT = SCOPE_IDENTITY();

INSERT INTO NIVELL (nom, ordreDesbloqueig, id_joc) VALUES
(N'La Segona República',  1, @idEspanya),
(N'La Guerra Civil',      2, @idEspanya),
(N'El franquisme',        3, @idEspanya);
GO

/* =========================================================
   DADES DE PROVA (opcional)
   Usuari: espanya@test.com / espanya123
   progresJoc = 3 → té obert el joc d'Espanya (a config/jocs.php és el número 3)
   ========================================================= */

INSERT INTO USUARI (correu, nom, contrasenya, progresJoc) VALUES
('espanya@test.com', 'Prova Espanya',
 '$2y$12$tdgx/GcOyJ9tk.ZB9dRlceQ3FrsPePdYbkyIsJpxIKytzPhblduYK', 3);
GO

/* =========================================================
   PARTIDES DE PROVA (opcional, cal haver executat els blocs d'abans)
   Una fila per intent de nivell, igual que les desa PartidaController:
   - durada en segons, numErrors, puntuacio (0-1000)
   - puntuacioPonderada = puntuacio × número de nivell
   - id_Joc i id_Nivell es busquen pel nom i per ordreDesbloqueig
   ========================================================= */

DECLARE @idJoc INT = (SELECT id FROM JOC WHERE nom = N'Espanya');
DECLARE @idUsuari INT = (SELECT id FROM USUARI WHERE correu = 'espanya@test.com');

INSERT INTO PARTIDA (data, durada, numErrors, puntuacio, puntuacioPonderada, id_Usuari, id_Joc, id_Nivell)
SELECT v.data, v.durada, v.numErrors, v.puntuacio, v.puntuacio * v.nivell,
       @idUsuari, @idJoc, n.id
FROM (VALUES
    ('2026-11-20T09:00:00', 265, 1,  90, 1),
    ('2026-11-21T19:15:00', 450, 5,  50, 2),
    ('2026-11-23T10:30:00', 390, 2,  85, 2),
    ('2026-11-24T17:05:00', 700, 8,  25, 3),
    ('2026-11-24T17:20:00', 560, 2,  80, 3)
) AS v (data, durada, numErrors, puntuacio, nivell)
JOIN NIVELL n ON n.id_joc = @idJoc AND n.ordreDesbloqueig = v.nivell;
GO

/* =========================================================
   CONSULTA PER COMPROVAR-HO
   Després de jugar, cada nivell acabat o perdut hi ha d'aparèixer.
   ========================================================= */

SELECT p.id, u.nom AS usuari, j.nom AS joc, n.nom AS nivell,
       p.data, p.durada, p.numErrors, p.puntuacio, p.puntuacioPonderada
FROM PARTIDA p
JOIN USUARI u ON u.id = p.id_Usuari
JOIN JOC j ON j.id = p.id_Joc
JOIN NIVELL n ON n.id = p.id_Nivell
WHERE j.nom = N'Espanya'
ORDER BY p.id DESC;
