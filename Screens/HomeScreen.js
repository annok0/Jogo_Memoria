// screens/HomeScreen.js
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { loadLevel } from '../utils/Storage';

const HomeScreen = ({ navigation }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const isFocused = useIsFocused();

  // Carrega o nível salvo sempre que a tela entra em foco [cite: 21]
  const fetchLevel = useCallback(async () => {
    const level = await loadLevel();
    setCurrentLevel(level);
  }, []);

  // Hook do React Navigation para recarregar dados
  React.useEffect(() => {
    if (isFocused) {
      fetchLevel();
    }
  }, [isFocused, fetchLevel]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jogo da Memória</Text>
      <Text style={styles.subtitle}>Evolutivo</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Game', { level: currentLevel })}
      >
        <Text style={styles.buttonText}>
          {currentLevel > 1 ? `Continuar Nível ${currentLevel}` : 'Iniciar Jogo'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary]} 
        onPress={() => navigation.navigate('Score')}
      >
        <Text style={styles.buttonText}>Recordes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonSecondary: {
    backgroundColor: '#50c878',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;