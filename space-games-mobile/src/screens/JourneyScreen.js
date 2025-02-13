import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import SpaceBackground from '../components/SpaceBackground';
import Rocket from '../components/Rocket';
import Mars from '../components/Mars';

const { width, height } = Dimensions.get('window');

export default function JourneyScreen() {
  const rocketAnim = React.useRef(new Animated.Value(0)).current;
  const marsAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when screen loads
    Animated.sequence([
      // First animate the rocket landing
      Animated.timing(rocketAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      // Then show Mars
      Animated.timing(marsAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <SpaceBackground />
      <Rocket animation={rocketAnim} isLanding={true} />
      <Mars animation={marsAnim} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000033',
  },
});
