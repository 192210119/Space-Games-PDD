import React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Rocket({ animation, isLanding = false }) {
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: isLanding ? [-height, 0] : [0, -height],
  });

  const scale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: isLanding ? [0.5, 0.8, 1] : [1, 0.8, 0.5],
  });

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: isLanding ? ['180deg', '0deg'] : ['0deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.rocket,
        {
          transform: [
            { translateY },
            { scale },
            { rotate },
          ],
        },
      ]}>
      <Animated.Image
        source={require('../../assets/rocket.png')}
        style={styles.rocketImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rocket: {
    width: 120,
    height: 180,
    position: 'absolute',
    alignSelf: 'center',
    bottom: height * 0.2,
  },
  rocketImage: {
    width: '100%',
    height: '100%',
  },
});
