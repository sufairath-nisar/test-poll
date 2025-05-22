// import React, { useState } from 'react';

// interface CreatePollProps {
//   token: string;
//   onPollCreated: (pollId: string) => void;
// }

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// export function CreatePoll({ token, onPollCreated }: CreatePollProps) {
//   const [question, setQuestion] = useState('');
//   const [options, setOptions] = useState(['', '']);
//   const [expiresAt, setExpiresAt] = useState('');

//   function updateOption(idx: number, value: string) {
//     const newOpts = [...options];
//     newOpts[idx] = value;
//     setOptions(newOpts);
//   }

//   function addOption() {
//     setOptions([...options, '']);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_BASE}/polls`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           question,
//           options: options.filter((opt) => opt.trim() !== ''),
//           expiresAt,
//         }),
//       });
//       const data = await res.json();
//       onPollCreated(data.id);
//     } catch {
//       alert('Failed to create poll');
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Create Poll</h2>
//       <input
//         placeholder="Question"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         required
//       />
//       <br />
//       {options.map((opt, idx) => (
//         <input
//           key={idx}
//           placeholder={`Option ${idx + 1}`}
//           value={opt}
//           onChange={(e) => updateOption(idx, e.target.value)}
//           required
//         />
//       ))}
//       <br />
//       <button type="button" onClick={addOption}>
//         Add Option
//       </button>
//       <br />
//       <label>Expires At: </label>
//       <input
//         type="datetime-local"
//         value={expiresAt}
//         onChange={(e) => setExpiresAt(e.target.value)}
//         required
//       />
//       <br />
//       <button type="submit">Create Poll</button>
//     </form>
//   );
// }



import { useState } from 'react';
import type { FormEvent } from 'react';

interface CreatePollProps {
  token: string;
  onPollCreated: (pollId: string) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function CreatePoll({ token, onPollCreated }: CreatePollProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState('');

  function updateOption(idx: number, value: string) {
    const newOpts = [...options];
    newOpts[idx] = value;
    setOptions(newOpts);
  }

  function addOption() {
    setOptions([...options, '']);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question,
          options: options.filter((opt) => opt.trim() !== ''),
          expiresAt,
        }),
      });
      const data = await res.json();
      onPollCreated(data.id);
    } catch {
      alert('Failed to create poll');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Poll</h2>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      <br />
      {options.map((opt, idx) => (
        <input
          key={idx}
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => updateOption(idx, e.target.value)}
          required
        />
      ))}
      <br />
      <button type="button" onClick={addOption}>
        Add Option
      </button>
      <br />
      <label>Expires At: </label>
      <input
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        required
      />
      <br />
      <button type="submit">Create Poll</button>
    </form>
  );
}
