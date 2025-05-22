
import { useState, useEffect } from 'react';
import { CreatePoll } from './components/createPoll/CreatePoll';
import { PollDisplay } from './components/PollDisplay';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE in app:', API_BASE);

function App() {
  const [token, setToken] = useState<string>('');
  const [pollId, setPollId] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('pollId');
    if (idFromUrl) {
      setPollId(idFromUrl);
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/auth/anon`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          setToken(data.token);
        } else {
          alert('No token returned from anon auth');
        }
      })
      .catch(err => {
        console.error('Failed to get anonymous token', err);
        alert('Failed to get anonymous token');
      });
  }, []);

  if (!token) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading token…</div>;
  }

  if (!pollId) {
    return (
      <CreatePoll
        token={token}
        onPollCreated={(id) => {
          setPollId(id);
          const url = new URL(window.location.href);
          url.searchParams.set('pollId', id);
          window.history.replaceState(null, '', url.toString());
        }}
      />
    );
  }

  return <PollDisplay token={token} pollId={pollId}  />;
}

export default App;
