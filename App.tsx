import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './Navigation/DrawerNavigator';
import {AppProvider} from './AppContext';
import 'react-native-gesture-handler';

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
