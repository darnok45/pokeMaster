import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  allPokemons: { id: string; name: string }[];
  onSelectPokemon: (name: string) => void;
  disabled: boolean;
};

export function SearchBar({ allPokemons, onSelectPokemon, disabled }: Props) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);

  const handleChangeText = (val: string) => {
    setText(val);
    if (val.trim().length > 1) {
      // Estado derivado instantáneo para sugerencias
      const filtered = allPokemons.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 4); // Limitamos a 4 sugerencias en pantalla
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (name: string) => {
    onSelectPokemon(name);
    setText('');
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        placeholder={disabled ? "¡Juego Terminado!" : "Escribí el nombre de un Pokémon..."}
        placeholderTextColor={theme.colors.muted}
        value={text}
        onChangeText={handleChangeText}
        editable={!disabled}
      />
      
      {suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          {suggestions.map((item) => (
            <Pressable 
              key={item.id} 
              style={styles.suggestionItem} 
              onPress={() => handleSelect(item.name)}
            >
              <Text style={styles.suggestionText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#1e293b50',
    color: theme.colors.muted,
  },
  suggestionsBox: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  suggestionItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});