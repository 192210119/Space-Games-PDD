import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 50;

export default function SpaceBackground() {
  const stars = React.useRef([...Array(STAR_COUNT)].map(() => ({
    animation: new Animated.Value(Math.random()),
    left: Math.random() * width,
    top: Math.random() * height,
    size: Math.random() * 2 + 1,
  }))).current;

  useEffect(() => {
    const animations = stars.map(star => {
      return Animated.sequence([
        Animated.timing(star.animation, {
          toValue: 1,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(star.animation, {
          toValue: 0,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.loop(
      Animated.stagger(100, animations)
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000033', '#000066']}
        style={styles.gradient}
      />
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.animation,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
});
