import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'POKÉ-WORDLE',
          // Agregamos el botón de estadísticas en el lado derecho superior
          headerRight: () => (
            <Pressable 
              onPress={() => router.push('/history')} 
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
            >
              <FontAwesome5 name="chart-bar" size={22} color={theme.colors.text} />
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable 
              onPress={() => router.push('/start')} 
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
            >
              <FontAwesome5 name="home" size={22} color={theme.colors.text} />
            </Pressable>
          )
        }} 
      />

      <Stack.Screen 
        name="history" 
        options={{ 
          title: 'HISTORIAL',
          presentation: 'card' // Animación nativa de empuje móvil
        }} 
      />

      <Stack.Screen 
        name="start" 
        options={{ 
          title: 'INICIO',
          presentation: 'card' // Animación nativa de empuje móvil
        }} 
      />
    </Stack>

        
  );
}