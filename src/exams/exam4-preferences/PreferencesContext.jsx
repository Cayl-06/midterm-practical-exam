import { createContext, useContext, useState } from 'react';

export const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const updateFontSize = (nextSize) => {
    const allowedSizes = [14, 16, 18];
    if (allowedSizes.includes(Number(nextSize))) {
      setFontSize(Number(nextSize));
    }
  };

  const contextValue = {
    theme,
    fontSize,
    toggleTheme,
    setTheme,
    setFontSize: updateFontSize
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (context === null || context === undefined) {
    throw new Error(
      'usePreferences() must be used within a <PreferencesProvider>. Wrap your component tree in <PreferencesProvider> before calling this Hook.'
    );
  }

  return context;
};
