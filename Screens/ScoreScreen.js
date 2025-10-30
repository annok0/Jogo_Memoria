// screens/ScoreScreen.js
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadHighScore } from '../utils/Storage';

const ScoreScreen = ({ navigation }) => {
  const [highScore, setHighScore] = useState(9999);
  const isFocused = useIsFocused();

  const fetchScore = useCallback(async () => {
    const score = await loadHighScore();
    setHighScore(score);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      fetchScore();
    }
  }, [isFocused, fetchScore]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recordes</Text>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Menor Nº de Tentativas</Text>
        <Text style={styles.scoreValue}>
          {highScore === 9999 ? 'Nenhum' : highScore}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar ao Menu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  scoreBox: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 40,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
    button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScoreScreen;