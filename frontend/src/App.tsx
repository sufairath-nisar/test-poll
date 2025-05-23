import { useState, useEffect } from 'react';
import { CreatePoll } from './components/createPoll/CreatePoll';
import { PollDisplay } from './components/PollDisplay';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE in app:', API_BASE);

function App() {
  const [token, setToken] = useState<string>('');
  const [pollId, setPollId] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false); 
  const [formKey, setFormKey] = useState<number>(0); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('pollId');
    if (idFromUrl) {
      setPollId(idFromUrl);
      setIsCreating(false); 
    } else {
      setIsCreating(true); 
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

  if (isCreating) {
    return (
      <CreatePoll
        key={formKey}
        token={token}
        onPollCreated={(id) => {
          setPollId(id);
          setIsCreating(false);
          const url = new URL(window.location.href);
          url.searchParams.set('pollId', id);
          window.history.replaceState(null, '', url.toString());
        }}
      />
    );
  }

  return (
    <PollDisplay
      token={token}
      pollId={pollId}
      onBack={() => {
        setPollId('');
        setIsCreating(true);
        setFormKey(prev => prev + 1); 
        const url = new URL(window.location.href);
        url.searchParams.delete('pollId');
        window.history.replaceState(null, '', url.toString());
      }}
    />
  );
}

export default App;
