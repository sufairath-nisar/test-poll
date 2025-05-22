import { useState } from 'react';
import type { FormEvent } from 'react';
// import './CreatePoll.css';  // <-- import the stylesheet

interface CreatePollProps {
  token: string;
  onPollCreated: (pollId: string) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;
function getLocalDateTime(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}


export function CreatePoll({ token, onPollCreated }: CreatePollProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState('');
  const [questionError, setQuestionError] = useState(false);
const [optionsError, setOptionsError] = useState<boolean[]>([]);
const [expiresAtError, setExpiresAtError] = useState(false);



  function updateOption(idx: number, value: string) {
    const newOpts = [...options];
    newOpts[idx] = value;
    setOptions(newOpts);
  }

  function addOption() {
    setOptions([...options, '']);
  }

  // async function handleSubmit(e: FormEvent) {
  //   e.preventDefault();
  //     let hasError = false;

  // // Basic validation
  // const trimmedQuestion = question.trim();
  // const trimmedOptions = options.map(opt => opt.trim());

  // if (trimmedQuestion === '') {
  //   setQuestionError(true);
  //   hasError = true;
  // } else {
  //   setQuestionError(false);
  // }

  // const optionErrors = trimmedOptions.map(opt => opt === '');
  // setOptionsError(optionErrors);
  // if (optionErrors.includes(true)) {
  //   hasError = true;
  // }

  // if (!expiresAt) {
  //   setExpiresAtError(true);
  //   hasError = true;
  // } else {
  //   setExpiresAtError(false);
  // }

  // if (hasError) return;
  //   try {
  //     const res = await fetch(`${API_BASE}/polls`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         question,
  //         options: options.filter(opt => opt.trim() !== ''),
  //         expiresAt,
  //       }),
  //     });
  //     const data = await res.json();
  //     onPollCreated(data.id);
  //   } catch {
  //     alert('Failed to create poll');
  //   }
  // }

  async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  let hasError = false;

  const trimmedQuestion = question.trim();
  const trimmedOptions = options.map(opt => opt.trim());

  if (trimmedQuestion === '') {
    setQuestionError(true);
    hasError = true;
  } else {
    setQuestionError(false);
  }

  const optionErrors = trimmedOptions.map(opt => opt === '');
  setOptionsError(optionErrors);
  if (optionErrors.includes(true)) {
    hasError = true;
  }

  if (!expiresAt || isNaN(new Date(expiresAt).getTime())) {
    setExpiresAtError(true);
    hasError = true;
  } else {
    setExpiresAtError(false);
  }

  if (hasError) return;

  try {
    const res = await fetch(`${API_BASE}/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        question,
        options: trimmedOptions.filter(opt => opt !== ''),
        expiresAt: new Date(expiresAt).toISOString(), 
      }),
    });

    const data = await res.json();
    onPollCreated(data.id);
  } catch {
    alert('Failed to create poll');
  }
}


  return (
    <form  className="max-w-xl mx-auto mt-8 mb-8 p-8 bg-white rounded-xl shadow-lg" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Create a New Poll</h2>

      <label className="block text-gray-700 font-medium mb-1">Question</label>
      <input
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
        placeholder="Enter your question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        
      />
      {questionError && <p className="text-red-600 text-sm">Please enter a question</p>}


      {/* <div className="mb-4">
        {options.map((opt, idx) => (
          <div key={idx} className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Option {idx + 1}</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => updateOption(idx, e.target.value)}
              required
            />
          </div>
        ))}
      </div>

    <button type="button" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded mb-4" onClick={addOption}>
  + Add Option
</button> */}

<div className="mb-4 mt-3">
  {options.map((opt, idx) => (
    <div key={idx} className="mb-3">
      <label className="block text-gray-700 font-medium mb-1">Option {idx + 1}</label>
      <input
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          optionsError && optionsError[idx] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={`Option ${idx + 1}`}
        value={opt}
        onChange={e => updateOption(idx, e.target.value)}
        
      />
      {/* Show error if this option is invalid */}
      {optionsError && optionsError[idx] && (
        <p className="text-red-600 text-sm mt-1">Please enter an option</p>
      )}
    </div>
  ))}
</div>

<button
  type="button"
  className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded mb-4"
  onClick={addOption}
>
  + Add Option
</button>


      <label className="block text-gray-700 font-medium mb-1">Expires At</label>
      <input
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
        type="datetime-local"
        value={expiresAt}
        onChange={e => setExpiresAt(e.target.value)}
        // min={new Date().toISOString().slice(0, 16)} // disables past dates and times
        min={getLocalDateTime()}
        
      />
      {expiresAtError && <p className="text-red-600 text-sm">Please select an expiration date</p>}


      {/* <input
  type="datetime-local"
  value={expiresAt}
  onChange={(e) => setExpiresAt(e.target.value)}
  min={new Date().toISOString().slice(0, 16)} // disables past dates and times
  className="border px-3 py-2 rounded"
/> */}


      <div className="flex justify-center mt-6">

       
 <button
  type="submit"
  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 w-80 rounded-md shadow-md transition duration-200 "
  // disabled={!question || options.some(opt => opt.trim() === '') || !expiresAt}
>
  Create Poll
</button>
</div>

    </form>
  );
}
