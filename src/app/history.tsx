import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { getMatchesHistory, getGameStats } from '@/services/history.service';
import { MatchRecord, GameStats } from '@/types/history';
import { theme } from '@/constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [history, setHistory] = useState<MatchRecord[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);

  // useFocusEffect asegura que los datos se refresquen cada vez que el usuario entra a la pantalla [Clase 6]
  useFocusEffect(
    useCallback(() => {
      setHistory(getMatchesHistory());
      setStats(getGameStats());
    }, [])
  );

  // Early Return si nunca jugó una partida [Clase 5]
  if (!stats || history.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome5 name="gamepad" size={50} color={theme.colors.muted} />
        <Text style={styles.emptyText}>Todavía no tenés partidas registradas.</Text>
        <Text style={styles.emptySubtext}>¡Jugá tu primer Poké-Wordle para ver tus estadísticas!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 📊 PANEL DE ESTADÍSTICAS GENERALES */}
      <View style={styles.statsDashboard}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.played}</Text>
          <Text style={styles.statLabel}>Jugadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.winPercentage}%</Text>
          <Text style={styles.statLabel}>Victorias</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Racha Act.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tus últimas partidas</Text>

      {/* 📋 LISTADO DE JUEGOS */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.historyCard, item.won ? styles.winBorder : styles.loseBorder]}>
            <View style={styles.leftInfo}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.targetPokemonImageUrl }} style={styles.pokemonImg} />
              </View>
              <View style={styles.metaData}>
                <Text style={styles.pokemonName}>{item.targetPokemonName}</Text>
                <Text style={styles.dateText}>Fecha: {item.date}</Text>
              </View>
            </View>

            <View style={styles.rightStatus}>
              <View style={[styles.badge, item.won ? styles.badgeWin : styles.badgeLose]}>
                <Text style={styles.badgeText}>
                  {item.won ? `Ganaste en ${item.attempts} intentos 🎯` : 'Fallido ❌'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    color: theme.colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  statsDashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  statNumber: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  historyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 5,
  },
  winBorder: { borderLeftColor: theme.colors.correct },
  loseBorder: { borderLeftColor: theme.colors.incorrect },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageWrapper: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 4,
  },
  pokemonImg: {
    width: 40,
    height: 40,
  },
  metaData: {
    justifyContent: 'center',
  },
  pokemonName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  rightStatus: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeWin: { backgroundColor: 'rgba(40, 199, 111, 0.15)' },
  badgeLose: { backgroundColor: 'rgba(234, 84, 85, 0.15)' },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});