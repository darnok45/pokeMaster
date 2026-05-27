import { MatchRecord, GameStats } from '@/types/history';

// Almacenamiento centralizado (en memoria para evitar dependencias externas pesadas)
let matchesHistory: MatchRecord[] = [];

export function getMatchesHistory(): MatchRecord[] {
  return [...matchesHistory];
}

export function saveMatch(match: Omit<MatchRecord, 'id' | 'date'>): void {
  const newMatch: MatchRecord = {
    ...match,
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
  };
  // Insertamos al principio para ver los últimos juegos primero
  matchesHistory = [newMatch, ...matchesHistory];
}

export function getGameStats(): GameStats {
  const played = matchesHistory.length;
  const won = matchesHistory.filter(m => m.won).length;
  const winPercentage = played > 0 ? Math.round((won / played) * 100) : 0;

  // Cálculo de racha actual de victorias seguidas
  let currentStreak = 0;
  for (const match of matchesHistory) {
    if (match.won) {
      currentStreak++;
    } else {
      break; // Se cortó la racha
    }
  }

  return { played, won, winPercentage, currentStreak };
}