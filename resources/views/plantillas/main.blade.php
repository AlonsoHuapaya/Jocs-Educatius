<!DOCTYPE html>
<html lang="ca">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-yEPZ7jP9S0QKiUQ0m3jjsO4ProIW7wvR9gXkI7JOGa2XVsw53Yke2bsdkBbjmmiX" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/js/bootstrap.bundle.min.js" integrity="sha384-WyOxWvTyr1QaMPfiPJSv76iReVthorl5uWlFtZPyK0IEB0hGzo9y5Bp9mYanr8Bu" crossorigin="anonymous"></script>

        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="{{ asset('css/styles.css') }}">

        <title>@yield('title')</title>
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
                        @yield('history-title')
                    </h1>

                    <p>
                        @yield('history-text')
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

            @yield('content')

        </div>

    </body>
</html>