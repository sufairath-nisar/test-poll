import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
});

export const getPoll = (id: string) => api.get(`/poll/${id}`);
export const createPoll = (data: { question: string; options: string[]; expiresAt: string }) => api.post("/poll", data);
export const castVote = (pollId: string, optionId: string, token: string) =>
  api.post(`/poll/${pollId}/vote`, { optionId }, { headers: { Authorization: `Bearer ${token}` } });

export const getAnonToken = () => api.post("/auth/anon");
