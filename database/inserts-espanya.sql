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
(N'La Segona República', 1, @idEspanya),
(N'La Guerra Civil',     2, @idEspanya),
(N'El franquisme',       3, @idEspanya);
GO

/* =========================================================
   USUARI DE PROVA (opcional)
   espanya@test.com / espanya123
   progresJoc = 3 → té obert el joc d'Espanya (a config/jocs.php és el número 3)
   ========================================================= */

INSERT INTO USUARI (correu, nom, contrasenya, progresJoc) VALUES
('espanya@test.com', N'Prova Espanya',
 '$2y$12$tdgx/GcOyJ9tk.ZB9dRlceQ3FrsPePdYbkyIsJpxIKytzPhblduYK', 3);
GO

/* =========================================================
   PARTIDES DE PROVA (opcional)
   Una fila per partida, igual que les desa PartidaController.
   Una partida s'acaba quan:
   - es completa el nivell        → guanyada = 1, puntuacio = punts del motor (0-1000)
   - es gasten els 3 intents      → guanyada = 0, puntuacio = 0
   - s'acaba el temps (nivell 3)  → guanyada = 0, puntuacio = 0
   puntuacioPonderada = puntuacio × número de nivell
   ========================================================= */

DECLARE @idJoc INT = (SELECT id FROM JOC WHERE nom = N'Espanya');
DECLARE @idUsuari INT = (SELECT id FROM USUARI WHERE correu = 'espanya@test.com');

INSERT INTO PARTIDA (data, durada, numErrors, puntuacio, puntuacioPonderada, guanyada, id_Usuari, id_Joc, id_Nivell)
SELECT v.data, v.durada, v.numErrors, v.puntuacio, v.puntuacio * v.nivell, v.guanyada,
       @idUsuari, @idJoc, n.id
FROM (VALUES
    -- data                  durada errors punts nivell guanyada
    ('2026-11-23 10:05:12',    42,    1,  858,   1,    1),  -- N1 completat amb 1 error
    ('2026-11-23 10:07:40',    35,    3,    0,   2,    0),  -- N2 perdut: 3 errors
    ('2026-11-23 10:09:02',    61,    1,  839,   2,    1),  -- N2 completat
    ('2026-11-24 17:02:30',   180,    2,    0,   3,    0),  -- N3 perdut: s'ha acabat el temps
    ('2026-11-24 17:06:15',   148,    2,  652,   3,    1)   -- N3 completat
) AS v (data, durada, numErrors, puntuacio, nivell, guanyada)
JOIN NIVELL n ON n.id_joc = @idJoc AND n.ordreDesbloqueig = v.nivell;
GO

/* =========================================================
   CONSULTA PER COMPROVAR-HO
   Després de jugar, cada nivell guanyat o perdut hi ha d'aparèixer.
   ========================================================= */

SELECT p.id, u.nom AS usuari, j.nom AS joc, n.nom AS nivell, p.data, p.durada,
       p.numErrors, p.puntuacio, p.puntuacioPonderada,
       CASE p.guanyada WHEN 1 THEN 'Guanyada' ELSE 'Perduda' END AS resultat
FROM PARTIDA p
JOIN USUARI u ON u.id = p.id_Usuari
JOIN JOC j ON j.id = p.id_Joc
JOIN NIVELL n ON n.id = p.id_Nivell
WHERE j.nom = N'Espanya'
ORDER BY p.id DESC;
