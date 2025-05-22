import type {
  Poll,
  CreatePollResponse,
  CastVoteResponse,
  AnonymousLoginResponse,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function anonymousLogin(): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/anon`, { method: 'POST' });
  if (!res.ok) throw new Error('Auth failed');
  const data: AnonymousLoginResponse = await res.json();
  return data.token;
}

export async function createPoll(
  token: string,
  question: string,
  options: string[],
  expiresAt: string
): Promise<CreatePollResponse> {
  const res = await fetch(`${API_BASE}/poll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ question, options, expiresAt }),
  });
  if (!res.ok) throw new Error('Create poll failed');
  return res.json();
}

export async function getPoll(pollId: string): Promise<{ poll: Poll }> {
  const res = await fetch(`${API_BASE}/poll/${pollId}`);
  if (!res.ok) throw new Error('Poll not found');
  return res.json();
}

export async function castVote(token: string, pollId: string, optionId: string): Promise<CastVoteResponse> {
  const res = await fetch(`${API_BASE}/poll/${pollId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ optionId }),
  });
  if (!res.ok) throw new Error('Vote failed');
  return res.json();
}
