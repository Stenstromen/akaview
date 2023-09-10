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
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
  AppState,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import InAppBrowser from 'react-native-inappbrowser-reborn';

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

type AuthResult = {
  type: string;
  url?: string;
};

type BearerData = {
  access_token: string;
  token_type: string;
};

function App(): JSX.Element {
  const [bearerToken, setBearerToken] = useState<string>('');
  console.log('App started');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const SCOPES: string =
    'domains:read_write linodes:read_write volumes:read_write';

  async function saveTokenToKeychain(token: string): Promise<void> {
    console.log('Attempting to save token to keychain...');
    try {
      await Keychain.setGenericPassword('bearerToken', token, {
        // accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
      });
      console.log('Token saved to keychain successfully');
    } catch (error) {
      console.error('Failed to save token to keychain:', error);
    }
  }

  async function getTokenFromKeychain(): Promise<string | null> {
    console.log('Attempting to retrieve token from keychain...');
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log('Token retrieved from keychain:', credentials.password);
        return credentials.password;
      } else {
        console.log('No token found in keychain');
      }
    } catch (error) {
      console.error('Failed to get token from keychain:', error);
    }
    return null;
  }

  async function openInAppBrowser(): Promise<void> {
    console.log('InAppBrowser: Starting...');
    try {
      const AUTHORIZATION_URL: string = `https://login.linode.com/oauth/authorize?client_id=a19ae26298d859431efe&response_type=code&redirect_uri=https://akaview-oauth.stenstromen.workers.dev&scope=${encodeURIComponent(
        SCOPES,
      )}`;

      const result: AuthResult = await InAppBrowser.openAuth(
        AUTHORIZATION_URL,
        'https://akaview-oauth.stenstromen.workers.dev',
        {
          // Additional InAppBrowser options here if needed
        },
      );

      if (result.type === 'success' && result.url) {
        console.log('InAppBrowser: Success! URL:', result.url);

        // Handle the URL directly here
        handleUrl(result.url);

        // Extract the authorization code
        const code: string | null = extractAuthorizationCode(result.url);
        if (code) {
          await fetchBearerToken(code);
        }
      } else {
        console.error('InAppBrowser: Dismissal or error, result:', result);
      }
    } catch (error) {
      console.error('InAppBrowser error:', error);
    }
  }

  function extractAuthorizationCode(url: string): string | null {
    const match: RegExpMatchArray | null = url.match(/code=([\s\S]+)/);
    return match ? match[1] : null;
  }

  async function fetchBearerToken(code: string): Promise<void> {
    const response = await fetch(
      'https://akaview-oauth.stenstromen.workers.dev',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `code=${code}`,
      },
    );

    if (response.ok) {
      const data: BearerData = await response.json();
      const token = data.token_type + ' ' + data.access_token;
      setBearerToken(token);

      // Save token to keychain
      await saveTokenToKeychain(token);
      console.log(data);
    } else {
      throw new Error('Failed to fetch bearer token');
    }
  }

  const handleUrl = (url: string) => {
    console.log('handleUrl', url);

    // Extracting parameters manually
    const paramMatches: RegExpMatchArray | null = url.match(/\?(.*)/);
    let params: Record<string, string> = {};
    if (paramMatches && paramMatches[1]) {
      const paramsStr: string = paramMatches[1];
      paramsStr.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value || '');
      });
    }

    const accessToken: string | undefined = params.access_token;
    const tokenType: string | undefined = params.token_type;

    if (accessToken && tokenType) {
      // Do something with the token data (e.g., set state or store it)
      setBearerToken(tokenType + ' ' + accessToken);
      console.log(accessToken, tokenType);
      saveTokenToKeychain(tokenType + ' ' + accessToken);
    }
  };

  useEffect(() => {
    const loadTokenFromKeychain = async () => {
      const token = await getTokenFromKeychain();
      if (token) {
        setBearerToken(token);
      }
    };

    loadTokenFromKeychain();

    const handleDeepLink = async (): Promise<void> => {
      console.log('handleDeepLink: Checking...');
      const url: string | null = await Linking.getInitialURL();
      console.log('handleDeepLink: URL is', url);
      if (url) {
        handleUrl(url);
      }
    };

    const handleAppStateChange = (nextAppState: string) => {
      console.log('handleAppStateChange: AppState is', nextAppState);
      if (nextAppState === 'active') {
        handleDeepLink();
      }
    };

    if (AppState.currentState === 'active') {
      handleDeepLink();
    }

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Clean up the listener when the component is unmounted
    return () => {
      appStateSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Button title="Login with Linode" onPress={openInAppBrowser} />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    marginTop: 20,
    width: '90%',
    height: '70%',
  },
});

export default App;
