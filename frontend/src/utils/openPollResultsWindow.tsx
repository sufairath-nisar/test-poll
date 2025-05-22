import type { Poll } from '../types';

export function openPollResultsWindow(poll: Poll): Window | null {
  const popup = window.open('', 'LivePollResults', 'width=600,height=700,resizable=yes,scrollbars=yes');

  if (!popup) {
    alert('Popup blocked. Please allow popups for this site.');
    return null;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Live Poll Results</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f9fafb; }
          h1 { font-size: 22px; color: #111827; margin-bottom: 20px; }
          .option { margin-bottom: 12px; }
          .bar {
            height: 18px;
            background: #4ade80;
            margin-top: 4px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>${poll.question}</h1>
        <div id="results"></div>

        <script>
          function renderResults(poll) {
            const totalVotes = Object.values(poll.tally).reduce((sum, n) => sum + n, 0);
            const resultsEl = document.getElementById('results');
            resultsEl.innerHTML = '';

            poll.options.forEach(opt => {
              const count = poll.tally[opt.id] || 0;
              const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
              const div = document.createElement('div');
              div.className = 'option';
              div.innerHTML = \`
                <div><strong>\${opt.text}</strong> — \${count} vote\${count !== 1 ? 's' : ''} (\${pct}%)</div>
                <div class="bar" style="width: \${pct}%"></div>
              \`;
              resultsEl.appendChild(div);
            });
          }

          window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'UPDATE_POLL') {
              renderResults(event.data.poll);
            }
          });

          // Initial render
          renderResults(${JSON.stringify(poll)});
        </script>
      </body>
    </html>
  `;

  popup.document.write(html);
  popup.document.close();
  return popup;
}
