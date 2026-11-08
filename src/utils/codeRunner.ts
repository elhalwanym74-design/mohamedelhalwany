// Code runner and iframe sandboxing utilities

export interface GenerateDocOptions {
  html: string;
  css: string;
  js: string;
  includeTailwind?: boolean;
}

export function generatePreviewHtml({ html, css, js, includeTailwind = true }: GenerateDocOptions): string {
  // Safe sanitized string interpolation
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>معاينة كود كرافت</title>
  ${includeTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    /* Global Base Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      width: 100%;
      height: 100%;
      min-height: 100%;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      -webkit-overflow-scrolling: touch;
    }
    /* User Custom CSS */
    ${css}
  </style>
</head>
<body>
  <!-- User Custom HTML -->
  ${html}

  <script>
    // Console Interceptor to relay logs to parent app
    (function() {
      const originalLog = console.log;
      const originalInfo = console.info;
      const originalWarn = console.warn;
      const originalError = console.error;

      function sendLog(type, args) {
        try {
          const stringified = Array.from(args).map(arg => {
            if (typeof arg === 'object' && arg !== null) {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');

          window.parent.postMessage({
            type: 'CODECRAFT_CONSOLE',
            logType: type,
            text: stringified,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour12: false })
          }, '*');
        } catch (err) {
          // Ignore messaging errors
        }
      }

      console.log = function(...args) {
        sendLog('log', args);
        originalLog.apply(console, args);
      };
      console.info = function(...args) {
        sendLog('info', args);
        originalInfo.apply(console, args);
      };
      console.warn = function(...args) {
        sendLog('warn', args);
        originalWarn.apply(console, args);
      };
      console.error = function(...args) {
        sendLog('error', args);
        originalError.apply(console, args);
      };

      window.onerror = function(message, source, lineno, colno, error) {
        sendLog('error', ['خطأ في التنفيذ:', message, 'السطر:', lineno]);
        return false;
      };

      // Challenge Runner listener
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'RUN_CHALLENGE_TEST') {
          try {
            const testFn = new Function(event.data.testCode);
            const result = testFn();
            window.parent.postMessage({
              type: 'CHALLENGE_TEST_RESULT',
              result: result
            }, '*');
          } catch (e) {
            window.parent.postMessage({
              type: 'CHALLENGE_TEST_RESULT',
              result: { pass: false, msg: 'خطأ أثناء فحص الكود: ' + e.message }
            }, '*');
          }
        }
      });
    })();
  </script>

  <script>
    try {
      // User Custom JavaScript
      ${js}
    } catch (e) {
      console.error("خطأ تشغيل سكريبت:", e.message);
    }
  </script>
</body>
</html>`;
}

// Download code as a standalone single .html file
export function downloadHtmlFile(html: string, css: string, js: string, fileName: string = 'codecraft-app.html') {
  const fullHtml = generatePreviewHtml({ html, css, js });
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Format basic code indentation
export function simpleFormatCode(code: string): string {
  // Clean empty excessive blank lines and trailing spaces
  return code
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}
