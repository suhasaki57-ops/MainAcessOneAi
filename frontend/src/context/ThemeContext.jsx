import { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('ascess_theme_mode');
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('ascess_theme_mode', themeMode);

    root.classList.remove('dark', 'light');

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = (e) => {
        root.classList.remove('dark', 'light');
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
      };

      applySystemTheme(mediaQuery);
      mediaQuery.addEventListener('change', applySystemTheme);
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    } else if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeContext;
