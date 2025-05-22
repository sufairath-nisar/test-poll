// import React, { useEffect, useState, useRef } from 'react';

// interface PollOption {
//   id: string;
//   text: string;
// }

// interface Poll {
//   id: string;
//   question: string;
//   expiresAt: string;
//   options: PollOption[];
//   tally: Record<string, number>;
// }

// interface PollDisplayProps {
//   token: string;
//   pollId: string;
//   onBack: () => void;
// }

// const API_BASE = import.meta.env.VITE_API_BASE_URL;
// const WS_BASE = import.meta.env.VITE_WS_BASE_URL

// export function PollDisplay({ token, pollId, onBack }: PollDisplayProps) {
//   const [poll, setPoll] = useState<Poll | null>(null);
//   const wsRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // Fetch poll data
//     fetch(`${API_BASE}/polls/${pollId}`)
//       .then((res) => res.json())
//       .then((data) => setPoll(data.poll))
//       .catch(() => alert('Failed to load poll'));
//   }, [pollId]);

//   useEffect(() => {
//     if (!pollId) return;

// wsRef.current = new WebSocket(`${WS_BASE}/ws/poll/${pollId}`);

//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'tally' && poll) {
//         setPoll((prev) => (prev ? { ...prev, tally: data.tally } : prev));
//       }
//     };

//     wsRef.current.onerror = () => alert('WebSocket error');
//     wsRef.current.onclose = () => console.log('WebSocket closed');

//     return () => {
//       wsRef.current?.close();
//     };
//   }, [pollId, poll]);

//   async function vote(optionId: string) {
//     try {
//       await fetch(`${API_BASE}/polls/${pollId}/vote`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ optionId }),
//       });
//     } catch {
//       alert('Failed to vote');
//     }
//   }

//   if (!poll) return <p>Loading poll...</p>;

//   const isExpired = new Date() > new Date(poll.expiresAt);

//   return (
//     <div>
//       <h2>{poll.question}</h2>
//       <ul>
//         {poll.options.map((opt) => (
//           <li key={opt.id}>
//             <button onClick={() => vote(opt.id)} disabled={isExpired}>
//               Vote
//             </button>{' '}
//             {opt.text} — Votes: {poll.tally?.[opt.id] || 0}
//           </li>
//         ))}
//       </ul>
//       <p>Expires at: {new Date(poll.expiresAt).toLocaleString()}</p>
//       {isExpired && <p>Poll is closed</p>}
//       <button onClick={onBack}>Create New Poll</button>
//     </div>
//   );
// }

///////////////////////////////////////////////////////

import { useEffect, useState, useRef } from 'react';

interface PollOption {
  id: string;
  text: string;
}

interface Poll {
  id: string;
  question: string;
  expiresAt: string;
  options: PollOption[];
  tally: Record<string, number>;
}

interface PollDisplayProps {
  token: string;
  pollId: string;
  onBack: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const WS_BASE = import.meta.env.VITE_WS_BASE_URL;

export function PollDisplay({ token, pollId, onBack }: PollDisplayProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch poll data
  useEffect(() => {
    fetch(`${API_BASE}/polls/${pollId}`)
      .then((res) => res.json())
      .then((data) => setPoll(data.poll))
      .catch(() => alert('Failed to load poll'));
  }, [pollId]);

  // WebSocket setup
 useEffect(() => {
  if (!pollId) return;
  console.log('Connecting to WebSocket ,WS_BASE:', WS_BASE);
  const socket = new WebSocket(`${WS_BASE}/ws`);
  wsRef.current = socket;

  socket.onopen = () => {
    console.log('WebSocket connected');
     console.log(`[CLIENT] WS open — subscribing to poll ${pollId}`);
    socket.send(JSON.stringify({ type: 'subscribe', pollId }));
  };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     if (data.type === 'tally') {
//       setPoll((prev) => (prev ? { ...prev, tally: data.tally } : prev));
//     }
//   };


socket.onmessage = (event) => {
     console.log('[CLIENT] Raw WS message:', event.data);
    const data = JSON.parse(event.data);
     console.log('[CLIENT] Parsed WS payload:', data);
    console.log('WS received:', data);
    // Only apply updates for this poll
    if (data.type === 'tally' && data.pollId === pollId) {
         console.log('[CLIENT] Applying tally update');
      setPoll(prev => prev ? { ...prev, tally: data.tally } : prev);
    }
  };


  socket.onerror = (e) => {
    console.error('WebSocket error:', e);
  };

 socket.onclose = (event) => {
  console.log(`WebSocket closed, code: ${event.code}, reason: ${event.reason}`);
};


  return () => {
    socket.close();
  };
}, [pollId]);  // <-- removed `poll` from dependencies

  async function vote(optionId: string) {
    try {
      await fetch(`${API_BASE}/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ optionId }),
      });
    } catch {
      alert('Failed to vote');
    }
  }

  if (!poll) return <p>Loading poll...</p>;

  const isExpired = new Date() > new Date(poll.expiresAt);

  return (
    <div>
      <h2>{poll.question}</h2>
      <ul>
        {poll.options.map((opt) => (
          <li key={opt.id}>
            <button onClick={() => vote(opt.id)} disabled={isExpired}>
              Vote
            </button>{' '}
            {opt.text} — Votes: {poll.tally?.[opt.id] || 0}
          </li>
        ))}
      </ul>
      <p>Expires at: {new Date(poll.expiresAt).toLocaleString()}</p>
      {isExpired && <p>Poll is closed</p>}
      <button onClick={onBack}>Create New Poll</button>
    </div>
  );
}
