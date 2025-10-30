// utils/GameLogic.js

// Lista de emojis para os pares [cite: 13]
const EMOJI_LIST = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'];

/**
 * Embaralha um array usando o algoritmo Fisher-Yates.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Gera o tabuleiro do jogo com base no nível.
 */
export const generateGameBoard = (level) => {
  // Nível 1: 2x2 (2 pares) [cite: 9, 18]
  // Nível 2: 4x4 (8 pares) [cite: 9, 20]
  // Nível 3: 6x6 (18 pares) [cite: 9]
  
  // Fórmula para calcular o número de pares necessários
  // Nível 1: (1+1)*2 = 4 -> 4x4 = 16 / 2 = 8 pares? Não, o PDF está confuso.
  // Vamos seguir o exemplo: Nível 1 = 2x2. Nível 2 = 4x4. Nível 3 = 6x6.
  
  let numPairs = 0;
  let columns = 0;
  
  if (level === 1) {
    numPairs = 2; // 2x2
    columns = 2;
  } else if (level === 2) {
    numPairs = 8; // 4x4
    columns = 4;
  } else {
    // Para níveis 3+ (6x6, etc.)
    const size = level * 2; // Nível 3 -> 6x6
    numPairs = (size * size) / 2;
    columns = size;
  }

  // Pega a quantidade necessária de emojis
  const neededEmojis = EMOJI_LIST.slice(0, numPairs);
  
  // Duplica para formar os pares
  const cardPairs = [...neededEmojis, ...neededEmojis];

  // Cria os objetos de carta e embaralha
  const shuffledCards = shuffleArray(cardPairs).map((emoji, index) => ({
    id: index,
    emoji: emoji,
    isFlipped: false,
    isMatched: false,
  }));

  return { cards: shuffledCards, columns: columns };
};