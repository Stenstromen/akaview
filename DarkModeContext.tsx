import React, {createContext, useContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';

type DarkModeContextType = {
  isDarkMode: boolean;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const DarkModeProvider: React.FC<Props> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark',
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({colorScheme}) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => listener.remove();
  }, []);

  return (
    <DarkModeContext.Provider value={{isDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};
