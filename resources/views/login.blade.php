@extends('plantillas.main')

@section('title')
    Iniciar sessió | Arxiu Històric
@endsection

@section('content')
    
@endsection

{{-- 
<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Iniciar sessió | Arxiu Històric</title>

    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

</head>

<body>

<div class="container">

    /* Panell històric */

    <section class="history-panel">

        <div class="logo">
            ARXIU <span>HISTÒRIC</span>
        </div>

        <div class="history-content">

            <div class="eyebrow">
                Història · Memòria · Investigació
            </div>

            <h1>
                Cada Joc<br>
                amaga una<br>
                <span>història.</span>
            </h1>

            <p>
                Torna a explorar els moments que van transformar
                el segle XX. Descobreix documents, personatges
                i esdeveniments que van marcar la història
                contemporània.
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

    /* Formulari de login */

    <section class="login-panel">

        <div class="login-box">

            <div class="eyebrow">
                Accés a l'arxiu
            </div>

            <h2>Benvingut de nou</h2>

            <p class="subtitle">
                Inicia sessió per continuar explorant
                el nostre arxiu històric.
            </p>

            /* Errors de validació */

            @if ($errors->any())
                <div class="missatge-error">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            /* Missatge de sessió */

            @if (session('status'))
                <div class="missatge-estat">
                    {{ session('status') }}
                </div>
            @endif

            <form action="{{ route('login.dades') }}" method="POST">

                @csrf

                <div class="form-group">

                    <label for="email">
                        Correu electrònic
                    </label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value="{{ old('email') }}"
                        placeholder="nom@exemple.cat"
                        required
                        autofocus
                        autocomplete="username"
                    >

                </div>

                <div class="form-group">

                    <label for="password">
                        Contrasenya
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••••"
                        required
                        autocomplete="current-password"
                    >

                    @if (Route::has('password.request'))

                        <div class="forgot-password">
                            <a F>
                                Has oblidat la contrasenya?
                            </a>
                        </div>

                    @endif

                </div>

                <div class="form-group">

                    <label>
                        <input
                            type="checkbox"
                            name="remember"
                            class="checkbox-remember"
                        >

                        Recorda'm

                    </label>

                </div>

                <button  type="submit" class="btn-login">
                    Iniciar sessió →
                </button>

            </form>

            <div class="register-link">
                Encara no tens un compte?

                <a href="{{ route('vista_registre') }}">
                    Registra't
                </a>
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
