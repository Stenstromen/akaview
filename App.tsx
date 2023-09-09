/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import * as Keychain from 'react-native-keychain';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {authorize} from 'react-native-app-auth';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const config = {
  issuer: 'https://login.linode.com',
  clientId: '8e5b65ee3caeb6be260c',
  redirectUrl: 'akaview-oauth://oauth-callback',
  serviceConfiguration: {
    authorizationEndpoint: 'https://login.linode.com/oauth/authorize',
    tokenEndpoint: 'https://login.linode.com/oauth/token',
    // possibly other endpoints like revocationEndpoint if you need them
  },
  scopes: ['domains:read_write', 'linodes:read_write', 'volumes:read_write'],
};

function App(): JSX.Element {
  const [bearerToken, setBearerToken] = useState('');
  console.log('App started');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //const SCOPES = 'domains:read_write linodes:read_write volumes:read_write';

  const authorizez = async () => {
    try {
      const result = await authorize(config);
      // result will contain your accessToken, refreshToken, tokenType, etc.
      console.log(result.accessToken);
      setBearerToken(result.accessToken);

      // If you want, store the token in react-native-keychain or any other secure storage
      // await storeTokenInKeychain(result.accessToken);
    } catch (error) {
      console.log('Error during authorization:', error);
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Login with Linode" onPress={authorizez} />
          <Section title="Bearer Token">
            <Text>{bearerToken}</Text>
          </Section>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
