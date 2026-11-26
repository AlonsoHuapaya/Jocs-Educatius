/* =========================================================
   JOC D'ALEMANYA · Comprovacions a la base de dades del servidor
   ---------------------------------------------------------
   No cal fer cap INSERT:
   - JOC i NIVELL ja tenen les dades al servidor (jocsDaw_02).
   - Les partides les desa el mateix joc (PartidaController@store)
     cada vegada que s'acaba un nivell: guanyada o perduda.
   Aquest script només LLEGEIX dades: no modifica res.
   ========================================================= */

USE jocsDaw_02;
GO

/* 1. El joc i els seus nivells
   PartidaController busca el joc pel nom de config/jocs.php ('Alemanya')
   i el nivell per ordreDesbloqueig. Ha de tornar 3 files:
     1. La República de Weimar
     2. L'ascens del nazisme
     3. La Segona Guerra Mundial
   Si no torna cap fila, el nom del joc a la taula JOC no és exactament 'Alemanya'. */

SELECT j.id AS id_joc, j.nom AS joc, n.id AS id_nivell, n.ordreDesbloqueig, n.nom AS nivell
FROM JOC j
LEFT JOIN NIVELL n ON n.id_joc = j.id
WHERE j.nom = N'Alemanya'
ORDER BY n.ordreDesbloqueig;

/* 2. Columnes de PARTIDA
   Hi ha d'haver 'guanyada' i no hi ha d'haver 'puntuacioPonderada'. */

SELECT COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PARTIDA'
ORDER BY ORDINAL_POSITION;

/* 3. Partides desades d'aquest joc (les més noves primer) */

SELECT p.id, u.nom AS usuari, n.nom AS nivell, p.data, p.durada, p.numErrors, p.puntuacio,
       CASE p.guanyada WHEN 1 THEN 'Guanyada' ELSE 'Perduda' END AS resultat
FROM PARTIDA p
JOIN USUARI u ON u.id = p.id_Usuari
JOIN JOC j ON j.id = p.id_Joc
JOIN NIVELL n ON n.id = p.id_Nivell
WHERE j.nom = N'Alemanya'
ORDER BY p.id DESC;
