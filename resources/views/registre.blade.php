
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro | Archivo Histórico</title>

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

        /* Panel histórico */
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

        /* Formulario */
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
            ARCHIVO <span>HISTÓRICO</span>
        </div>

        <div class="history-content">
            <div class="eyebrow">
                Historia · Memoria · Investigación
            </div>

            <h1>
                El pasado<br>
                nunca deja<br>
                de <span>hablar.</span>
            </h1>

            <p>
                Explora los acontecimientos que marcaron el siglo XX.
                Analiza los regímenes totalitarios, sus protagonistas,
                sus consecuencias y las lecciones que dejaron para
                las generaciones futuras.
            </p>
        </div>

        <div class="timeline">
            <div class="timeline-item">
                <small>1922</small>
                <span>Italia fascista</span>
            </div>

            <div class="timeline-item">
                <small>1936</small>
                <span>Guerra Civil Española</span>
            </div>

            <div class="timeline-item">
                <small>1939</small>
                <span>Segunda Guerra Mundial</span>
            </div>
        </div>

    </section>

    <section class="register-panel">

        <div class="register-box">

            <div class="eyebrow">Acceso al archivo</div>

            <h2>Crear cuenta</h2>

            <p class="subtitle">
                Regístrate para acceder a documentos,
                cronologías y material histórico.
            </p>

            @if ($errors->any())
                <div style="color: #d99b8d; margin-bottom: 20px;">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="{{ route('register') }}">
                @csrf

                <div class="form-group">
                    <label for="name">Nombre completo</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value="{{ old('name') }}"
                        placeholder="Tu nombre"
                        required
                        autocomplete="name"
                    >
                </div>

                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value="{{ old('email') }}"
                        placeholder="nombre@ejemplo.com"
                        required
                        autocomplete="email"
                    >
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
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
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Repite tu contraseña"
                        required
                        autocomplete="new-password"
                    >
                </div>

                <button type="submit" class="btn-register">
                    Crear cuenta →
                </button>

            </form>

            <div class="login-link">
                ¿Ya tienes una cuenta?
                <a href="{{ route('login') }}">Iniciar sesión</a>
            </div>

            <div class="footer">
                ARCHIVO HISTÓRICO · ESTUDIO DEL PASADO
            </div>

        </div>

    </section>

</div>

</body>
</html>
