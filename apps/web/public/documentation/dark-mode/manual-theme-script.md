```html title="src/index.html" showLineNumbers copyButton {9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>MyApp</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <script>
      (function () {
        const html = document.documentElement;

        try {
          const theme = localStorage.theme;
          const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

          const isSystem = theme === 'system' || !('theme' in localStorage);
          const isDark = theme === 'dark' || (isSystem && prefersDark);
          html.classList.add('scheme-light-dark');
          html.classList.toggle('dark', isDark);
          html.setAttribute('data-theme', theme ?? 'system');
        } catch (_) {}
      })();
    </script>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```
