import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { getMatchesHistory, getGameStats } from '@/services/history.service';
import { MatchRecord, GameStats } from '@/types/history';
import { theme } from '@/constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';

// 🟩 Obtenemos las dimensiones físicas exactas del dispositivo móvil [Guia Paso a Paso]
const { width, height } = Dimensions.get('window');

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
        {/* 🟩 Fondo completo para el estado vacío */}
        <Image 
          source={require('@/assets/images/fondoPrado.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover" 
        />
        <FontAwesome5 name="gamepad" size={50} color={theme.colors.muted} />
        <Text style={styles.emptyText}>Todavía no tenés partidas registradas.</Text>
        <Text style={styles.emptySubtext}>¡Jugá tu primer Poké-Wordle para ver tus estadísticas!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🟩 IMAGEN DE FONDO ABSOLUTA MÓVIL (Cubre el 100% de borde a borde sin opacar) */}
      <Image 
        source={require('@/assets/images/fondoPrado.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />

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

// 🎨 ESTILOS COMPLETOS COORDINADOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    // 🟩 Agregamos espacio arriba para que el contenido baje y no se tape por el Header transparente
    paddingTop: 110, 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  
  // 🟩 REGLA DEL FONDO DE PANTALLA TOTAL:
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,   // Matemáticamente el ancho de tu pantalla
    height: height, // Matemáticamente el alto de tu pantalla
    zIndex: -1,     // Se clava al fondo ocultándose por detrás de los componentes
    opacity: 1.0,   // Color nítido total. Si el texto se te complica leer, bajalo a 0.85
  },

  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  statsDashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.85)', // Un fondo oscuro semi-translúcido para contrastar con la imagen
    padding: theme.spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: theme.colors.muted,
    fontSize: 11,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)', // Sólido transparente para que se lea perfecto sobre el fondo
    padding: theme.spacing.sm,
    borderRadius: 16,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 5,
  },
  winBorder: { borderLeftColor: theme.colors.correct },
  loseBorder: { borderLeftColor: theme.colors.incorrect },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 4,
  },
  pokemonImg: {
    width: 50,
    height: 50,
  },
  metaData: {
    marginLeft: theme.spacing.sm,
  },
  pokemonName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  rightStatus: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeWin: { backgroundColor: 'rgba(46, 117, 89, 0.2)' },
  badgeLose: { backgroundColor: 'rgba(214, 40, 40, 0.15)' },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});