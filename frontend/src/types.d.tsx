export interface PollOption {
  id: string;
  option: string;
  votes: number;
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  expiresAt: string;
  isExpired: boolean;
  totalVotes: number;
}

