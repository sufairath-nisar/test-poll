import { useState } from 'react';
import type { FormEvent } from 'react';
import './CreatePoll.css';  // <-- import the stylesheet

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question,
          options: options.filter(opt => opt.trim() !== ''),
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
    <form className="create-poll-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create a New Poll</h2>

      <label className="form-label">Question</label>
      <input
        className="form-input"
        placeholder="Enter your question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        required
      />

      <div className="options-group">
        {options.map((opt, idx) => (
          <div key={idx} className="option-item">
            <label className="form-label">Option {idx + 1}</label>
            <input
              className="form-input"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => updateOption(idx, e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <button type="button" className="btn-secondary" onClick={addOption}>
        + Add Option
      </button>

      <label className="form-label">Expires At</label>
      <input
        className="form-input"
        type="datetime-local"
        value={expiresAt}
        onChange={e => setExpiresAt(e.target.value)}
        required
      />

      <button type="submit" className="btn-primary">
        Create Poll
      </button>
    </form>
  );
}
