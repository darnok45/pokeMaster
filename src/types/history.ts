export type MatchRecord = {
  id: string;
  date: string;
  targetPokemonName: string;
  targetPokemonImageUrl: string;
  won: boolean;
  attempts: number;
};

export type GameStats = {
  played: number;
  won: number;
  winPercentage: number;
  currentStreak: number;
};