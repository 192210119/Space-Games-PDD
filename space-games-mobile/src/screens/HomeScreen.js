import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Rocket from '../components/Rocket';
import SpaceBackground from '../components/SpaceBackground';

export default function HomeScreen({ navigation }) {
  const rocketAnim = React.useRef(new Animated.Value(0)).current;

  const startTakeoff = () => {
    Animated.sequence([
      Animated.timing(rocketAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.navigate('Journey');
    });
  };

  return (
    <View style={styles.container}>
      <SpaceBackground />
      <View style={styles.content}>
        <Animated.View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            {'WELCOME'.split('').map((letter, index) => (
              <Text
                key={index}
                style={[styles.letter]}
              >
                {letter}
              </Text>
            ))}
          </Text>
          <Text style={styles.gameTitle}>TOWNSHIP ON MARS</Text>
          <TouchableOpacity onPress={startTakeoff} style={styles.button}>
            <Text style={styles.buttonText}>LET'S GO</Text>
          </TouchableOpacity>
        </Animated.View>
        <Rocket animation={rocketAnim} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000033',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'System',
    fontSize: 48,
    color: '#fff',
    marginBottom: 20,
  },
  letter: {
    marginHorizontal: 2,
  },
  gameTitle: {
    fontFamily: 'System',
    fontSize: 36,
    color: '#ff4d4d',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: 'bold',
  },
});
