// utils/Storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVEL_KEY = '@memoryGame:level';
const SCORE_KEY = '@memoryGame:highScore';

/**
 * Salva o nível máximo alcançado pelo jogador.
 */
export const saveLevel = async (level) => {
  try {
    await AsyncStorage.setItem(LEVEL_KEY, String(level));
  } catch (e) {
    console.error('Erro ao salvar o nível.', e);
  }
};

/**
 * Carrega o nível atual. Retorna 1 se nenhum nível for encontrado.
 */
export const loadLevel = async () => {
  try {
    const level = await AsyncStorage.getItem(LEVEL_KEY);
    return level != null ? parseInt(level, 10) : 1; // [cite: 21]
  } catch (e) {
    console.error('Erro ao carregar o nível.', e);
    return 1;
  }
};

/**
 * Salva o novo recorde (menor número de tentativas).
 */
export const saveHighScore = async (attempts) => {
  try {
    const currentScore = await loadHighScore();
    // Salva apenas se o novo score for menor que o atual
    if (attempts < currentScore) {
      await AsyncStorage.setItem(SCORE_KEY, String(attempts)); // [cite: 22]
    }
  } catch (e) {
    console.error('Erro ao salvar o recorde.', e);
  }
};

/**
 * Carrega o recorde. Retorna um número alto se nenhum for encontrado.
 */
export const loadHighScore = async () => {
  try {
    const score = await AsyncStorage.getItem(SCORE_KEY);
    return score != null ? parseInt(score, 10) : 9999;
  } catch (e) {
    console.error('Erro ao carregar o recorde.', e);
    return 9999;
  }
};