import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useDarkMode} from '../DarkModeContext';
import MainScreen from './Screens/MainScreen';
import SettingsScreen from './Screens/SettingsScreen';

const Drawer = createDrawerNavigator();

function DrawerNavigator(): JSX.Element {
  const {isDarkMode} = useDarkMode();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#333' : '#fff',
        },
        headerTintColor: isDarkMode ? '#fff' : '#000',
        drawerStyle: {
          backgroundColor: isDarkMode ? '#333' : '#fff',
        },
        drawerLabelStyle: {
          color: isDarkMode ? '#fff' : '#000',
        },
        drawerActiveTintColor: isDarkMode ? '#47ba81' : '#1b804e',
      }}
      initialRouteName="Main">
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{title: 'Main Screen'}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
