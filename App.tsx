import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './Navigation/DrawerNavigator';
import {DarkModeProvider} from './DarkModeContext';
import 'react-native-gesture-handler';

function App() {
  return (
    <DarkModeProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </DarkModeProvider>
  );
}

export default App;
