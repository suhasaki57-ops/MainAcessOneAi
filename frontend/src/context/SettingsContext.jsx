import { createContext, useState, useContext, useEffect } from 'react';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ascess_1_settings');
    return saved
      ? JSON.parse(saved)
      : {
          mode: 'system', // 'light' | 'dark' | 'system'
          fontSize: 'medium', // 'small' | 'medium' | 'large' | 'xlarge'
          readingSpeed: 1.0,
          highContrast: false,
          dyslexiaFont: false,
          reduceMotion: false,
          keyboardNav: true,
        };
  });

  useEffect(() => {
    localStorage.setItem('ascess_1_settings', JSON.stringify(settings));

    const root = document.documentElement;

    // Font size scaling
    if (settings.fontSize === 'small') root.style.fontSize = '14px';
    else if (settings.fontSize === 'large') root.style.fontSize = '18px';
    else if (settings.fontSize === 'xlarge') root.style.fontSize = '20px';
    else root.style.fontSize = '16px';

    // High Contrast class
    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    // Reduce Motion class
    if (settings.reduceMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');

    // Dyslexia mode class
    if (settings.dyslexiaFont) root.classList.add('dyslexia-mode');
    else root.classList.remove('dyslexia-mode');
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export default SettingsContext;
