// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GameScreen from './Screens/GameScreen';
import HomeScreen from './Screens/HomeScreen';
import ScoreScreen from './Screens/ScoreScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Esconde o cabeçalho padrão
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Score" component={ScoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}