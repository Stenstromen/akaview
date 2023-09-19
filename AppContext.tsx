import React, {createContext, useContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';

import {getTokenDetailsFromKeychain} from './Oauth';
import {TokenType} from './Types';

type AppContextType = {
  isDarkMode: boolean;
  bearerToken: TokenType;
  setBearerToken: React.Dispatch<React.SetStateAction<TokenType>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<Props> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark',
  );

  const [bearerToken, setBearerToken] = useState<TokenType>({
    token: '',
    refreshToken: '',
    expiresIn: 0,
  });

  useEffect(() => {
    const listener = Appearance.addChangeListener(({colorScheme}) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    // Your token-related logic here...

    const loadTokenFromKeychain = async () => {
      const token = await getTokenDetailsFromKeychain();
      if (token) {
        setBearerToken(token);
      }
    };

    loadTokenFromKeychain();

    return () => listener.remove();
  }, []);

  return (
    <AppContext.Provider value={{isDarkMode, bearerToken, setBearerToken}}>
      {children}
    </AppContext.Provider>
  );
};
