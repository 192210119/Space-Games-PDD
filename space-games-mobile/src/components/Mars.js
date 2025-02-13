import React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Mars({ animation }) {
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.mars,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}>
      <Animated.Image
        source={require('../../assets/mars.png')}
        style={styles.marsImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mars: {
    width: width * 0.8,
    height: width * 0.8,
    position: 'absolute',
    right: -width * 0.2,
    top: height * 0.1,
  },
  marsImage: {
    width: '100%',
    height: '100%',
  },
});
