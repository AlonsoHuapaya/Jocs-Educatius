
<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Registre | Arxiu Històric</title>

    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            background: #171714;
            color: #e8e2d5;
            font-family: 'Inter', sans-serif;
            display: flex;
        }

        .container {
            display: flex;
            width: 100%;
            min-height: 100vh;
        }

        /* Panell històric */
        .history-panel {
            width: 55%;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            background:
                linear-gradient(
                    rgba(15, 15, 13, 0.65),
                    rgba(15, 15, 13, 0.9)
                ),
                url('https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200')
                center/cover;

            border-right: 1px solid #494537;
        }

        .logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        .logo span {
            color: #b49a68;
        }

        .history-content {
            max-width: 580px;
        }

        .eyebrow {
            color: #b49a68;
            font-size: 11px;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 25px;
        }

        .history-content h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(45px, 5vw, 76px);
            line-height: 0.95;
            font-weight: 500;
            margin-bottom: 30px;
        }

        .history-content h1 span {
            color: #b49a68;
            font-style: italic;
        }

        .history-content p {
            color: #bdb9ae;
            line-height: 1.8;
            font-size: 14px;
            max-width: 440px;
        }

        .timeline {
            display: flex;
            gap: 30px;
            border-top: 1px solid #5b5545;
            padding-top: 25px;
        }

        .timeline-item small {
            display: block;
            color: #b49a68;
            font-size: 12px;
            margin-bottom: 8px;
        }

        .timeline-item span {
            font-family: 'Cormorant Garamond', serif;
            font-size: 17px;
        }

        /* Formulari */
        .register-panel {
            width: 45%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 50px 30px;
            background: #1d1d19;
        }

        .register-box {
            width: 100%;
            max-width: 400px;
        }

        .register-box .eyebrow {
            margin-bottom: 12px;
        }

        .register-box h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 42px;
            font-weight: 500;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 13px;
            color: #96948b;
            margin-bottom: 35px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: #c8c1b2;
        }

        input {
            width: 100%;
            padding: 15px;
            background: #262620;
            border: 1px solid #454438;
            color: #eee8da;
            outline: none;
            font-family: 'Inter', sans-serif;
            transition: 0.3s;
        }

        input:focus {
            border-color: #b49a68;
            background: #2b2b24;
        }

        input::placeholder {
            color: #77766d;
        }

        .btn-register {
            width: 100%;
            padding: 16px;
            margin-top: 10px;
            background: #a38b5d;
            color: #171714;
            border: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
        }

        .btn-register:hover {
            background: #c4ad7e;
            transform: translateY(-2px);
        }

        .login-link {
            margin-top: 25px;
            text-align: center;
            font-size: 12px;
            color: #96948b;
        }

        .login-link a {
            color: #b49a68;
            text-decoration: none;
        }

        .login-link a:hover {
            text-decoration: underline;
        }

        .footer {
            margin-top: 35px;
            text-align: center;
            color: #66655c;
            font-size: 10px;
            letter-spacing: 1px;
        }

        @media (max-width: 900px) {
            .history-panel {
                display: none;
            }

            .register-panel {
                width: 100%;
                min-height: 100vh;
            }
        }
    </style>
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
                Registra't per accedir a documents,
                cronologies i material històric.
            </p>

            @if ($errors->any())
                <div style="color: #d99b8d; margin-bottom: 20px;">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form action="{{ route('registre.store') }}" method="POST">

                @csrf

                <div class="form-group">
                    <label for="name">Nom complet</label>

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
