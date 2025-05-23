import { useEffect, useState, useRef } from 'react';
import { openOrUpdatePollWindow } from '../utils/pollWindowManager'; 

interface PollOption { id: string; text: string; }
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
const WS_BASE  = import.meta.env.VITE_WS_BASE_URL;

export function PollDisplay({ token, pollId, onBack }: PollDisplayProps) {
    
    const [poll, setPoll] = useState<Poll | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [hasVoted, setHasVoted] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const popupWindowRef = useRef<Window | null>(null);
    


    useEffect(() => {
        fetch(`${API_BASE}/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setPoll(data.poll))
        .catch(() => setMessage('⚠️ Failed to load poll'));
    }, [pollId, token]);

    useEffect(() => {
        if (!pollId) return;
        const socket = new WebSocket(`${WS_BASE}/ws`);
        wsRef.current = socket;

        socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'subscribe', pollId }));
        };
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'tally' && data.pollId === pollId) {
                setPoll(prev => {
                    if (!prev) return prev;

                    const updatedPoll = { ...prev, tally: data.tally };

                    if (popupWindowRef.current && !popupWindowRef.current.closed) {
                        popupWindowRef.current.postMessage({ type: 'UPDATE_POLL', poll: updatedPoll }, '*');
                    }

                    return updatedPoll;
                });
            }
        };

        return () => socket.close();
    }, [pollId]);

    async function vote() {
        if (!selectedOption || hasVoted) return;
        try {
            await fetch(`${API_BASE}/polls/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ optionId: selectedOption })
            });
            setMessage('Vote submitted successfully!');
            setMessageType('success');
            setHasVoted(true);
        } catch {
            setMessage('Failed to vote');
            setMessageType('error');
        }
    }

    if (!poll) return <p className="text-center mt-8">Loading poll…</p>;

    const totalVotes = Object.values(poll.tally).reduce((sum, n) => sum + n, 0);
    const isExpired = new Date() > new Date(poll.expiresAt);
    const highestVotes = Math.max(...Object.values(poll.tally || {}));

    return (
        <div className="max-w-xl mx-auto mt-8 font-sans">
        <div className="bg-white shadow-lg shadow-blue-100 rounded-xl p-6">

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-2xl text-blue-700 font-semibold mb-6 text-center">Live Feedback: Cast Your Vote!</h2>
                <h3 className="text-xl font-semibold mb-6">{poll.question}</h3>

                {/* Options */}
                {!showResults && !isExpired && (
                    <form className="space-y-4">
                    {poll.options.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="pollOption"
                            id={opt.id}
                            value={opt.id}
                            checked={selectedOption === opt.id}
                            onChange={() => setSelectedOption(opt.id)}
                            className="accent-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                        <label htmlFor={opt.id} className="text-gray-700 cursor-pointer">{opt.text}</label>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={vote}
                        disabled={!selectedOption || isExpired || hasVoted}
                        className={`mt-4 px-4 py-2 rounded text-white ${
                        !selectedOption || isExpired || hasVoted
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                        }`}
                    >
                            Vote
                    </button>
                    </form>
                )}

                {message && (
                    <p
                        className={`mt-4 text-sm font-semibold text-center rounded-md px-4 py-2 ${
                        messageType === 'success' ? 'bg-green-100 text-green-600' :
                        messageType === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {message}
                    </p>
                )}


                {/* Results */}
                {showResults && (
                    <div className="mt-6 space-y-4">
                        {poll.options.map(opt => {
                            const count = poll.tally[opt.id] || 0;
                            const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                            const isTop = count === highestVotes && totalVotes > 0;
                            return (
                            <div key={opt.id}>
                                <div className={`mb-1 text-sm ${isTop ? 'font-bold text-green-700' : 'text-gray-800'}`}>
                                {opt.text} — {count} vote{count !== 1 ? 's' : ''} ({pct}%)
                                </div>
                                <div className="w-full h-4 bg-gray-200 rounded">
                                <div
                                    className={`h-4 ${isTop ? 'bg-green-600' : 'bg-green-400'} rounded transition-all`}
                                    style={{ width: `${pct}%` }}
                                />
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}

                <p className="mt-6 text-sm text-red-700">
                    Expires at: {
                        new Date(poll.expiresAt).toLocaleString('en-AE', {
                    timeZone: 'Asia/Dubai',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true 
                    })

                    }
                </p>

                {isExpired && (
                    <p className="text-red-600 font-medium mt-1 text-red-700">Poll is closed</p>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        
                <button
                    onClick={() => {
                        if (poll) {
                        console.log('[Parent] opening popup', poll);
                        popupWindowRef.current = openOrUpdatePollWindow(poll);

                        }
                    }}
                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer"

                    >
                        Open Live Results
                </button>
        
                <button
                    onClick={() => setShowResults(sr => !sr)}
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer"
                >
                    {showResults
                    ? 'Hide Results'
                    : `Show Results (${totalVotes} vote${totalVotes !== 1 ? 's' : ''})`}
                </button>

                <button
                onClick={onBack}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer"
                >
                    Create New Poll
                </button>


            </div>
        </div>
        </div>
    );
}
