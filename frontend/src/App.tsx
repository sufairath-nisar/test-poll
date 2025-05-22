// import { useState } from 'react';
// import { Login } from './components/Login';
// import { CreatePoll } from './components/CreatePoll';
// import { PollDisplay } from './components/PollDisplay';

// function App() {
//   const [token, setToken] = useState('');
//   const [pollId, setPollId] = useState('');

//   if (!token) {
//     return <Login onLogin={setToken} />;
//   }

//   if (!pollId) {
//     return <CreatePoll token={token} onPollCreated={setPollId} />;
//   }

//   return <PollDisplay token={token} pollId={pollId} onBack={() => setPollId('')} />;
// }

// export default App;


import { useState, useEffect } from 'react';
import { CreatePoll } from './components/createPoll/CreatePoll';
import { PollDisplay } from './components/PollDisplay';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE in app:', API_BASE);

function App() {
  const [token, setToken] = useState<string>('');
  const [pollId, setPollId] = useState<string>('');

  // Read pollId from URL query on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('pollId');
    if (idFromUrl) {
      setPollId(idFromUrl);
    }
  }, []);

  // Always fetch a fresh anonymous token on load
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

  // Clear pollId from URL when going back to CreatePoll
  // const handleBack = () => {
  //   setPollId('');
  //   const url = new URL(window.location.href);
  //   url.searchParams.delete('pollId');
  //   window.history.replaceState(null, '', url.toString());
  // };

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

  // return <PollDisplay token={token} pollId={pollId} onBack={handleBack} />;
    return <PollDisplay token={token} pollId={pollId}  />;

}

export default App;
