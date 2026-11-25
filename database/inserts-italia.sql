USE JocsEducatius;
GO

/* =========================================================
   JOC D'ITÀLIA · El primer feixisme
   - JOC.nom ha de ser exactament 'Itàlia' (el mateix que a config/jocs.php):
     PartidaController busca el joc pel nom.
   - NIVELL.ordreDesbloqueig és el número del nivell (1, 2, 3):
     PartidaController busca el nivell per aquest camp.
   Per això no cal fixar els id a mà.
   ========================================================= */

INSERT INTO JOC (nom) VALUES (N'Itàlia');

DECLARE @idItalia INT = SCOPE_IDENTITY();

INSERT INTO NIVELL (nom, ordreDesbloqueig, id_joc) VALUES
(N'La marxa sobre Roma',      1, @idItalia),
(N'El règim de Mussolini',    2, @idItalia),
(N'La guerra i la caiguda',   3, @idItalia);
GO

/* =========================================================
   DADES DE PROVA (opcional)
   Usuari: italia@test.com / italia123
   progresJoc = 1 → té obert el joc d'Itàlia (a config/jocs.php és el número 1)
   ========================================================= */

INSERT INTO USUARI (correu, nom, contrasenya, progresJoc) VALUES
('italia@test.com', 'Prova Italia',
 '$2y$12$Fzen.6kLxrqkYA9acAxJku6DZuSeoCfDYUUeRwjzlvWmgcTHZx2Eu', 1);
GO

/* =========================================================
   PARTIDES DE PROVA (opcional, cal haver executat els blocs d'abans)
   Una fila per intent de nivell, igual que les desa PartidaController:
   - durada en segons, numErrors, puntuacio (0-1000)
   - puntuacioPonderada = puntuacio × número de nivell
   - id_Joc i id_Nivell es busquen pel nom i per ordreDesbloqueig
   ========================================================= */

DECLARE @idJoc INT = (SELECT id FROM JOC WHERE nom = N'Itàlia');
DECLARE @idUsuari INT = (SELECT id FROM USUARI WHERE correu = 'italia@test.com');

INSERT INTO PARTIDA (data, durada, numErrors, puntuacio, puntuacioPonderada, id_Usuari, id_Joc, id_Nivell)
SELECT v.data, v.durada, v.numErrors, v.puntuacio, v.puntuacio * v.nivell,
       @idUsuari, @idJoc, n.id
FROM (VALUES
    ('2026-11-18T10:05:00', 310, 4,  60, 1),
    ('2026-11-18T10:12:00', 250, 1,  90, 1),
    ('2026-11-19T17:30:00', 420, 6,  40, 2),
    ('2026-11-20T09:45:00', 380, 2,  80, 2),
    ('2026-11-21T18:10:00', 520, 3,  75, 3)
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
WHERE j.nom = N'Itàlia'
ORDER BY p.id DESC;
