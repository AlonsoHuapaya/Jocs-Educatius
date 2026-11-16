<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $joc['nom'] }} | Arxiu Històric</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/inici.css') }}">
</head>

<body class="pagina-centrada">

{{-- Vista provisional. Substituïu-la creant resources/views/jocs/{{ $codi }}.blade.php --}}
<main class="continua joc-provisional">
    <div class="eyebrow">Expedient {{ $joc['numero'] }} · {{ $joc['periode'] }}</div>
    <h2>{{ $joc['nom'] }}: {{ $joc['titol'] }}</h2>
    <p>Aquest joc encara està en construcció.</p>

    {{-- Quan el joc s'acabi, s'ha d'enviar aquest formulari per desbloquejar el següent --}}
    <form method="POST" action="{{ route('joc.superat', $codi) }}">
        @csrf
        <button type="submit" class="btn">Marca com a superat (prova)</button>
    </form>
    <a class="btn btn--secundari" href="{{ route('inici') }}">Torna al mapa</a>
</main>

</body>
</html>
