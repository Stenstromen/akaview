import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useApp} from '../AppContext';
import MainScreen from './Screens/MainScreen';
import Linodes from './Screens/Linodes';
import NetworkScreen from './Screens/NetworkScreen';
import TicketsScreen from './Screens/TicketsScreen';
import SettingsScreen from './Screens/SettingsScreen';

const Drawer = createDrawerNavigator();

function DrawerNavigator(): JSX.Element {
  const {isDarkMode, bearerToken} = useApp();

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
        swipeEdgeWidth: bearerToken.token ? 40 : 0,
      }}
      initialRouteName="Main">
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: 'AkaView',
          headerLeft: bearerToken.token ? undefined : () => null,
        }}
      />
      <Drawer.Screen
        name="Linodes"
        component={Linodes}
        options={{title: 'Linodes'}}
      />
      <Drawer.Screen
        name="Network"
        component={NetworkScreen}
        options={{title: 'Network'}}
      />
      <Drawer.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{title: 'Tickets'}}
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
