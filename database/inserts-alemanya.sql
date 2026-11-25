USE JocsEducatius;
GO

/* =========================================================
   JOC D'ALEMANYA · De Weimar al nazisme
   - JOC.nom ha de ser exactament 'Alemanya' (el mateix que a config/jocs.php):
     PartidaController busca el joc pel nom.
   - NIVELL.ordreDesbloqueig és el número del nivell (1, 2, 3):
     PartidaController busca el nivell per aquest camp.
   Per això no cal fixar els id a mà.
   ========================================================= */

INSERT INTO JOC (nom) VALUES ('Alemanya');

DECLARE @idAlemanya INT = SCOPE_IDENTITY();

INSERT INTO NIVELL (nom, ordreDesbloqueig, id_joc) VALUES
('La República de Weimar',   1, @idAlemanya),
('L''ascens del nazisme',    2, @idAlemanya),
('La Segona Guerra Mundial', 3, @idAlemanya);
GO

/* =========================================================
   DADES DE PROVA (opcional)
   Usuari: alemanya@test.com / alemanya123
   progresJoc = 2 → té obert el joc d'Alemanya (a config/jocs.php és el número 2)
   ========================================================= */

INSERT INTO USUARI (correu, nom, contrasenya, progresJoc) VALUES
('alemanya@test.com', 'Prova Alemanya',
 '$2y$12$2gftk1GzYM0BHYR3R2fUxOJklJnHfnrCZDYBb8RCO.WX9aTZuCk92', 2);
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
ORDER BY p.id DESC;
