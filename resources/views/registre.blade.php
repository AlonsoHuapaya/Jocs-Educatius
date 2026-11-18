@extends('plantillas.main')

@section('title')
    Registre | Arxiu Històric
@endsection

@section('content')
    
@endsection


{{-- 
<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Registre | Arxiu Històric</title>

    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

</head>

<body>

<div class="container">

    <section class="history-panel">

        <div class="logo">
            ARXIU <span>HISTÒRIC</span>
        </div>

        <div class="history-content">

            <div class="eyebrow">
                Història · Memòria · Investigació
            </div>

            <h1>
                El passat<br>
                mai no deixa<br>
                de <span>parlar.</span>
            </h1>

            <p>
                Explora els esdeveniments que van marcar el segle XX.
                Analitza els règims totalitaris, els seus protagonistes,
                les seves conseqüències i les lliçons que van deixar
                per a les generacions futures.
            </p>

        </div>

        <div class="timeline">

            <div class="timeline-item">
                <small>1922</small>
                <span>Itàlia feixista</span>
            </div>

            <div class="timeline-item">
                <small>1936</small>
                <span>Guerra Civil Espanyola</span>
            </div>

            <div class="timeline-item">
                <small>1939</small>
                <span>Segona Guerra Mundial</span>
            </div>

        </div>

    </section>

    <section class="register-panel">

        <div class="register-box">

            <div class="eyebrow">
                Accés a l'arxiu
            </div>

            <h2>Crear un compte</h2>

            <p class="subtitle">
                Registra't per accedir a jocs,
                cronologies i material històric.
            </p>

            @if ($errors->any())
                <div class="missatge-error">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form action="{{ route('registre.store') }}" method="POST">

                @csrf

                <div class="form-group">
                    <label for="name">
                        Nom complet
                    </label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        value="{{ old('name') }}"
                        placeholder="El teu nom"
                        required
                        autocomplete="name"
                    >
                </div>

                <div class="form-group">
                    <label for="email">Correu electrònic</label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value="{{ old('email') }}"
                        placeholder="nom@exemple.cat"
                        required
                        autocomplete="email"
                    >
                </div>

                <div class="form-group">
                    <label for="password">Contrasenya</label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••••"
                        required
                        autocomplete="new-password"
                    >
                </div>

                <div class="form-group">
                    <label for="password_confirmation">
                        Confirmació de la contrasenya
                    </label>

                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Repeteix la contrasenya"
                        required
                        autocomplete="new-password"
                    >
                </div>

                <button type="submit" class="btn-register">
                    Crear compte →
                </button>

            </form>

            <div class="login-link">
                Ja tens un compte?
                <a href="{{ route('login') }}">Inicia sessió</a>
            </div>

            <div class="footer">
                ARXIU HISTÒRIC · ESTUDI DEL PASSAT
            </div>

        </div>

    </section>

</div>

</body>
</html>
--}}
