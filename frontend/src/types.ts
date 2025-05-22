export interface PollOption {
  id: string;
  text: string;
}

export type PollTally = Record<string, number>;
export interface Poll {
  id: string;
  question: string;
  expiresAt: string;
  options: PollOption[];
  tally: PollTally;
}
export interface CreatePollResponse {
  id: string;
}
export interface CastVoteResponse {
  message: string;
}
export interface AnonymousLoginResponse {
  token: string;
}
