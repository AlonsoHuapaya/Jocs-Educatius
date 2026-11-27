/* =========================================================
   JOC D'ALEMANYA · Nivells a la base de dades del servidor
   ---------------------------------------------------------
   - El joc ja és a la taula JOC: id = 2, nom = 'Alemanya'
     (el mateix número que a config/jocs.php).
   - Aquest script afegeix els seus 3 nivells a NIVELL.
     PartidaController busca el nivell per ordreDesbloqueig (1, 2, 3).
   - Es pot executar més d'una vegada: si un nivell ja hi és, no el repeteix.
   - No hi ha dades de prova (ni usuaris ni partides).
   - progresJoc no es toca aquí: en superar el nivell 3, el motor envia
     #form-superat i JocController@superat crida Usuari::superarJoc(2),
     que passa el progresJoc de l'usuari a 3 (s'obre Espanya).
   - Les partides les desa el motor (POST /partides) amb id_Joc = 2.
   ========================================================= */

USE jocsDaw_02;
GO

DECLARE @idAlemanya INT = 2;

-- Seguretat: el joc 2 ha de ser Alemanya. Si no, no s'insereix res.
IF NOT EXISTS (SELECT 1 FROM JOC WHERE id = @idAlemanya AND nom = N'Alemanya')
BEGIN
    THROW 50000, 'El joc amb id 2 no és Alemanya: revisa la taula JOC abans de continuar.', 1;
END;

INSERT INTO NIVELL (nom, ordreDesbloqueig, id_joc)
SELECT v.nom, v.ordre, @idAlemanya
FROM (VALUES
    (N'La República de Weimar',   1),
    (N'L''ascens del nazisme',    2),
    (N'La Segona Guerra Mundial', 3)
) AS v (nom, ordre)
WHERE NOT EXISTS (
    SELECT 1 FROM NIVELL n
    WHERE n.id_joc = @idAlemanya AND n.ordreDesbloqueig = v.ordre
);
GO

/* Comprovació: ha de tornar 3 files (nivells 1, 2 i 3 del joc 2) */
SELECT j.id AS id_joc, j.nom AS joc, n.id AS id_nivell, n.ordreDesbloqueig, n.nom AS nivell
FROM JOC j
JOIN NIVELL n ON n.id_joc = j.id
WHERE j.id = 2
ORDER BY n.ordreDesbloqueig;
