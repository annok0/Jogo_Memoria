// components/Card.js
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Card = ({ item, onPress, isFlipped }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Interpola o valor animado para girar o eixo Y
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Dispara a animação quando 'isFlipped' muda
  useEffect(() => {
    if (isFlipped) {
      Animated.timing(animatedValue, {
        toValue: 180,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animação para "desvirar"
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isFlipped]);

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer} disabled={isFlipped}>
      {/* Frente da Carta (Emoji) */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </Animated.View>

      {/* Verso da Carta (?) */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.emoji}>?</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 80,
    height: 80,
    margin: 5,
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    backfaceVisibility: 'hidden', // Oculta o lado de trás do elemento
  },
  cardFront: {
    backgroundColor: '#e0e0e0',
  },
  cardBack: {
    backgroundColor: '#4a90e2',
  },
  emoji: {
    fontSize: 40,
  },
});

export default Card;