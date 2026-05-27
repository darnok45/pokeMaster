import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { getPokemonList151, getPokemonGameData } from '@/services/pokemon.service';
import { PokemonGameData } from '@/types/pokemon';
import { SearchBar } from '@/components/SearchBar';
import { GuessRow } from '@/components/GuessRow';
import { theme } from '@/constants/theme';
// Importamos el servicio del historial para registrar las partidas terminadas
import { saveMatch } from '@/services/history.service';

export default function GameScreen() {
  const [allPokemons, setAllPokemons] = useState<{ id: string; name: string }[]>([]);
  const [targetPokemon, setTargetPokemon] = useState<PokemonGameData | null>(null);
  const [guesses, setGuesses] = useState<PokemonGameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar juego y seleccionar el Pokémon oculto
  const initGame = async () => {
    try {
      setLoading(true);
      setError(null);
      setGuesses([]);
      
      const list = await getPokemonList151();
      setAllPokemons(list);

      // Elegimos un ID aleatorio entre los 151 disponibles
      const randomIdx = Math.floor(Math.random() * list.length);
      const randomPokemon = list[randomIdx];
      
      const details = await getPokemonGameData(randomPokemon.id);
      setTargetPokemon(details);
    } catch (err) {
      setError('Error al iniciar el juego. Revisá tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  // ESTADOS DERIVADOS (Evitamos el antipatrón de estados duplicados) [Clase 5]
  const won = guesses.some(g => g.id === targetPokemon?.id);
  const lost = guesses.length >= 6 && !won;
  const gameOver = won || lost;

  // EFECTO: Registra la partida en el historial de forma automática al terminar [Clase 6]
  useEffect(() => {
    if (gameOver && targetPokemon) {
      saveMatch({
        targetPokemonName: targetPokemon.name,
        targetPokemonImageUrl: targetPokemon.imageUrl,
        won: won,
        attempts: guesses.length
      });
    }
  }, [gameOver]); // Se dispara únicamente cuando el estado derivado detecta fin de juego

  const handleGuessSubmit = async (pokemonName: string) => {
    if (gameOver) return;
    
    try {
      const guessData = await getPokemonGameData(pokemonName);
      
      // Validamos que no se haya arriesgado ya ese mismo pokemon
      if (guesses.some(g => g.id === guessData.id)) return;

      setGuesses(prev => [guessData, ...prev]); // Insertamos al principio para verlo arriba
    } catch (err) {
      // Manejo silencioso de errores de tipeo o fallos de red individuales
    }
  };

  // 1. RETORNO TEMPRANO: Pantalla de carga aislada [Clase 5]
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Buscando un Pokémon oculto...</Text>
      </View>
    );
  }

  // 2. RETORNO TEMPRANO: Pantalla de error con botón de reintento
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={initGame}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  // 3. RETORNO PRINCIPAL: Se ejecuta cuando ya cargaron los datos básicos del juego
  return (
    <View style={styles.container}>
      {/* Encabezado con estilos fijos mapeados abajo */}
      <View style={styles.header}>
        <Text style={styles.instructions}>
          Adiviná el Pokémon oculto de la 1° Generación
        </Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>Intentos {guesses.length} / 6</Text>
        </View>
      </View>

      <SearchBar 
        allPokemons={allPokemons} 
        onSelectPokemon={handleGuessSubmit} 
        disabled={gameOver}
      />

      <FlatList
        data={guesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GuessRow guess={item} target={targetPokemon!} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Banner flotante de fin de juego */}
      {gameOver && (
        <View style={styles.footer}>
           <View style={[styles.resultCard, won ? styles.winBorder : styles.loseBorder]}>
              <Text style={styles.resultEmoji}>{won ? '🏆' : '💀'}</Text>
              <Text style={styles.resultTitle}>
                {won ? '¡VICTORIA!' : `ERA ${targetPokemon?.name.toUpperCase()}`}
              </Text>
              <Pressable style={styles.button} onPress={initGame}>
                <Text style={styles.buttonText}>NUEVA PARTIDA</Text>
              </Pressable>
           </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  loadingText: {
    color: theme.colors.muted,
    marginTop: theme.spacing.sm,
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.incorrect,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  instructions: {
    color: theme.colors.muted,
    fontSize: 12,
    flex: 1,
  },
  badgeCount: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 150, 
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  resultCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
  },
  winBorder: { borderColor: theme.colors.correct },
  loseBorder: { borderColor: theme.colors.incorrect },
  resultEmoji: { fontSize: 40, marginBottom: 10 },
  resultTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: '100%',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});