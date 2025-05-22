// src/api/types.ts

// Poll Option type
export interface PollOption {
  id: string;
  text: string;
}

// Poll tally: option ID mapped to votes count
export type PollTally = Record<string, number>;

// Poll object returned from getPoll
export interface Poll {
  id: string;
  question: string;
  expiresAt: string;
  options: PollOption[];
  tally: PollTally;
}

// Response when creating a poll
export interface CreatePollResponse {
  id: string;
}

// Response when casting vote (you may customize as needed)
export interface CastVoteResponse {
  message: string;
}

// Response for anonymous login
export interface AnonymousLoginResponse {
  token: string;
}
