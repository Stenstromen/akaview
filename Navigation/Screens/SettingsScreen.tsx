/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useApp} from '../../AppContext';

function SettingsScreen(): JSX.Element {
  const {isDarkMode} = useApp();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#333' : '#fff'},
      ]}>
      <Text style={{color: isDarkMode ? '#fff' : '#000'}}>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
