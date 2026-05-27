import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PokemonGameData } from '@/types/pokemon';
import { theme } from '@/constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = {
  guess: PokemonGameData;
  target: PokemonGameData;
};

export function GuessRow({ guess, target }: Props) {
  // Estados para controlar la revelación secuencial de cada columna
  const [showIdentity, setShowIdentity] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [showHeight, setShowHeight] = useState(false);
  const [showWeight, setShowWeight] = useState(false);

  useEffect(() => {
    // Cascada de tiempos (Efecto de revelado de izquierda a derecha)
    const timer1 = setTimeout(() => setShowIdentity(true), 150);
    const timer2 = setTimeout(() => setShowTypes(true), 500);
    const timer3 = setTimeout(() => setShowHeight(true), 850);
    const timer4 = setTimeout(() => setShowWeight(true), 1200);

    // Limpieza de timers al desmontar el componente (Buena práctica obligatoria)
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [guess.id]); // Se dispara cada vez que llega un nuevo intento

  // Lógica de colores (Igual a la versión anterior)
  const getTypesStyle = () => {
    const matchingTypes = guess.types.filter(t => target.types.includes(t));
    if (guess.types.length === target.types.length && matchingTypes.length === guess.types.length) {
      return styles.correct;
    }
    return matchingTypes.length > 0 ? styles.partial : styles.incorrect;
  };

  const getIconName = (guessVal: number, targetVal: number): string => {
    if (guessVal < targetVal) return 'chevron-up';
    if (guessVal > targetVal) return 'chevron-down';
    return 'check';
  };

  const getStatusColor = (guessVal: number, targetVal: number, tolerance: number) => {
    if (guessVal === targetVal) return styles.correct;
    return Math.abs(guessVal - targetVal) <= tolerance ? styles.partial : styles.incorrect;
  };

  return (
    <View style={styles.card}>
      {/* 1. Bloque de Identidad (Imagen y Nombre) */}
      <View style={[styles.mainInfo, !showIdentity && styles.hiddenBlock]}>
        {showIdentity && (
          <>
            <View style={styles.imageCircle}>
              <Image source={{ uri: guess.imageUrl }} style={styles.sprite} />
            </View>
            <Text style={styles.nameText} numberOfLines={1}>{guess.name}</Text>
          </>
        )}
      </View>

      {/* 2. Celdas Estadísticas Secuenciales */}
      <View style={styles.statsRow}>
        
        {/* Celda: Tipos */}
        <View style={[styles.statBox, showTypes ? getTypesStyle() : styles.hiddenBox]}>
          {showTypes && (
            <>
              <FontAwesome5 name="elementor" size={14} color="white" style={styles.icon} />
              <Text style={styles.statText}>{guess.types.join('\n')}</Text>
            </>
          )}
        </View>

        {/* Celda: Altura */}
        <View style={[styles.statBox, showHeight ? getStatusColor(guess.height, target.height, 5) : styles.hiddenBox]}>
          {showHeight && (
            <>
              <View style={styles.indicatorRow}>
                <Text style={styles.statText}>{guess.height / 10}m</Text>
                <FontAwesome5 name={getIconName(guess.height, target.height)} size={10} color="white" />
              </View>
              <Text style={styles.label}>Altura</Text>
            </>
          )}
        </View>

        {/* Celda: Peso */}
        <View style={[styles.statBox, showWeight ? getStatusColor(guess.weight, target.weight, 100) : styles.hiddenBox]}>
          {showWeight && (
            <>
              <View style={styles.indicatorRow}>
                <Text style={styles.statText}>{guess.weight / 10}kg</Text>
                <FontAwesome5 name={getIconName(guess.weight, target.weight)} size={10} color="white" />
              </View>
              <Text style={styles.label}>Peso</Text>
            </>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 4,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
    minHeight: 48, // Mantiene la estructura del layout fija mientras carga
  },
  hiddenBlock: {
    backgroundColor: '#1e293b50',
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  imageCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  sprite: {
    width: 35,
    height: 35,
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  hiddenBox: {
    backgroundColor: '#1e293b80', // Color gris oscuro neutro mientras está tapado
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  icon: {
    marginBottom: 2,
  },
  correct: { backgroundColor: theme.colors.correct },
  partial: { backgroundColor: theme.colors.partial },
  incorrect: { backgroundColor: theme.colors.incorrect },
});