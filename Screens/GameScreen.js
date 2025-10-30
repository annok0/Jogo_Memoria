// screens/GameScreen.js
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import { generateGameBoard } from '../utils/GameLogic';
import { saveHighScore, saveLevel } from '../utils/Storage';

const GameScreen = ({ route, navigation }) => {
  const { level: initialLevel } = route.params; // Nível vindo do HomeScreen

  const [level, setLevel] = useState(initialLevel);
  const [board, setBoard] = useState({ cards: [], columns: 2 });
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(60); // 60 segundos por nível (exemplo)
  const [showWinModal, setShowWinModal] = useState(false);

  const timerRef = useRef(null); // Ref para o intervalo do temporizador

  // Função para (re)iniciar o jogo
  const setupGame = (currentLevel) => {
    // Limpa o temporizador anterior
    if (timerRef.current) clearInterval(timerRef.current);
    
    const { cards, columns } = generateGameBoard(currentLevel);
    setBoard({ cards, columns });
    setLevel(currentLevel);
    
    // Reseta os estados
    setSelectedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setShowWinModal(false);
    
    // Define o tempo (ex: 30s para nível 1, 60s para nível 2)
    const newTime = currentLevel * 30 + 30; // Ajuste esta lógica
    setTimer(newTime);
  };

  // Efeito para o Temporizador Regressivo [cite: 12, 34]
  useEffect(() => {
    // Inicia o jogo ao carregar
    setupGame(level);

    // Função de limpeza para quando o componente desmontar
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // O setup inicial agora só roda uma vez

  // Efeito que controla o temporizador
  useEffect(() => {
    if (timer > 0 && !showWinModal) {
      timerRef.current = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0) {
      // Fim de jogo (tempo esgotado)
      clearInterval(timerRef.current);
      Alert.alert(
        "Tempo Esgotado!", 
        "Você não conseguiu encontrar todos os pares. Tente novamente!",
        [{ text: "Reiniciar Nível", onPress: () => setupGame(level) }] // 
      );
    }
    return () => clearInterval(timerRef.current);
  }, [timer, showWinModal]);


  // Efeito para checar os pares selecionados [cite: 31]
  useEffect(() => {
    if (selectedCards.length === 2) {
      setAttempts(attempts + 1);
      const [first, second] = selectedCards;

      if (first.emoji === second.emoji) {
        // Acertou o par
        setMatchedPairs([...matchedPairs, first.emoji]);
        setSelectedCards([]);
      } else {
        // Errou o par - vira de volta após 1s
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [selectedCards]);

  // Efeito para checar a condição de vitória
  useEffect(() => {
    if (board.cards.length > 0 && matchedPairs.length === board.cards.length / 2) {
      // Venceu!
      clearInterval(timerRef.current); // Para o timer
      setShowWinModal(true); // Mostra o modal de vitória [cite: 14]
      
      const nextLevel = level + 1;
      saveLevel(nextLevel); // Salva o *próximo* nível [cite: 11]
      saveHighScore(attempts); // Salva o recorde de tentativas [cite: 11]
    }
  }, [matchedPairs]);


  const handleCardPress = (card) => {
    // Ignora clique se a carta já está virada, se já é um par, ou se 2 já estão selecionadas
    if (selectedCards.length === 2 || selectedCards.find(c => c.id === card.id) || matchedPairs.includes(card.emoji)) {
      return;
    }
    setSelectedCards([...selectedCards, card]);
  };
  
  const handleNextLevel = () => {
      const nextLevel = level + 1;
      setupGame(nextLevel); // Configura o próximo nível
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Nível: {level}</Text>
        <Text style={styles.headerText}>Tempo: {timer}s</Text>
        <Text style={styles.headerText}>Tentativas: {attempts}</Text>
      </View>
      
      <FlatList
        data={board.cards}
        key={board.columns} // Importante para o FlatList re-renderizar ao mudar colunas
        numColumns={board.columns}
        contentContainerStyle={styles.board}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => handleCardPress(item)}
            isFlipped={selectedCards.some(c => c.id === item.id) || matchedPairs.includes(item.emoji)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
      />

      {/* Modal de Vitória [cite: 14] */}
      <Modal visible={showWinModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Parabéns!</Text>
            <Text style={styles.modalText}>Você completou o Nível {level}!</Text>
            {/* TODO: Adicionar animação de confete aqui  */}
            
            <TouchableOpacity style={styles.modalButton} onPress={handleNextLevel}>
              <Text style={styles.modalButtonText}>Próximo Nível</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary]} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.modalButtonText}>Voltar ao Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

// Estilos (simplificados para clareza)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  board: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonSecondary: {
    backgroundColor: '#777',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;