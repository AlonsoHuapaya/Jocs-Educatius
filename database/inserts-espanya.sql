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
   CONSULTA PER COMPROVAR-HO
   ========================================================= */

SELECT j.id AS id_joc, j.nom AS joc, n.id AS id_nivell, n.ordreDesbloqueig, n.nom AS nivell
FROM JOC j
JOIN NIVELL n ON n.id_joc = j.id
WHERE j.nom = N'Espanya'
ORDER BY n.ordreDesbloqueig;
