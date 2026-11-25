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
   CONSULTA PER COMPROVAR-HO
   ========================================================= */

SELECT j.id AS id_joc, j.nom AS joc, n.id AS id_nivell, n.ordreDesbloqueig, n.nom AS nivell
FROM JOC j
JOIN NIVELL n ON n.id_joc = j.id
WHERE j.nom = N'Itàlia'
ORDER BY n.ordreDesbloqueig;
