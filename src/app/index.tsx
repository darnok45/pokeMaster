import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/constants/theme';
import { Stack, router } from 'expo-router';

export default function WelcomeCard() {
  return (
    <View style={styles.mainContainer}>
        <View style={styles.container}>
            <Text style={styles.title}>
                Bienvenido a
            </Text>

            <Text style={styles.brand}>
                <Text style={styles.poke}>Poke</Text>
                <Text style={styles.master}>Master</Text>
            </Text>

            <Text style={styles.description}>
                ¿Tienes lo que se necesita para atraparlos a todos?
            </Text>

            <Text style={styles.subText}>
                Prueba tu capacidad de adivinanza en este juego.
            </Text>

            <Text style={styles.callToAction}>
                ¡Haz click aquí abajo para comenzar!
            </Text>

            {/* 🎮 BOTÓN PLAY */}
      <TouchableOpacity onPress={() => router.push('/game')} activeOpacity={0.8} style={styles.playButton}>
        
        <Image
          source={{
            uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
          }}
          style={styles.pokeball}
          resizeMode="contain"
        />

        <Text style={styles.playButtonText}>
          ¡A jugar!
        </Text>
      </TouchableOpacity>
        </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:theme.colors.background,
        minHeight:'100%',
    },

    container: {
        width: '100%',
        maxHeight: '100%',

        backgroundColor: theme.colors.primary,

        borderRadius: 50,

        paddingVertical: theme.spacing.lg * 2,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,

        marginTop: 20,
        marginLeft:5,
        marginRight:5,

        justifyContent: 'flex-start',
        alignItems: 'center',

        gap: 40,
    },

    title: {
        marginTop: 20,

        color: theme.colors.text,

        fontSize: 34,
        fontWeight: '800',

        textAlign: 'center',
        lineHeight: 42,
    },

    brand: {
        fontSize: 42,
        fontWeight: '900',

        marginTop: -20,
    },

    poke: {
        color: theme.colors.incorrect,
    },

    master: {
        color: theme.colors.text,
    },

    description: {
        maxWidth: 300,

        color: theme.colors.text,

        fontSize: 24,
        fontWeight: '700',

        textAlign: 'center',
        lineHeight: 36,
    },

    subText: {
        maxWidth: 320,

        color: theme.colors.text,

        fontSize: 22,
        fontWeight: '700',

        textAlign: 'center',
        lineHeight: 34,
    },

    callToAction: {
        color: theme.colors.text,

        fontSize: 24,
        fontWeight: '800',

        textAlign: 'center',
        lineHeight: 34,
    },
        
    playButton: {
        width: '100%',

        backgroundColor: '#5e1368',

        borderRadius: 40,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 24,

        gap: 10,
    },

    pokeball: {
        width: 110,
        height: 110,
    },

    playButtonText: {
        color: '#000',

        fontSize: 35,
        fontWeight: '900',
    }
});