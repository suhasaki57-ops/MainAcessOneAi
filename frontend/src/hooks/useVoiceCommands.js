import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

export const useVoiceCommands = (transcript, onCommandExecuted) => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { setThemeMode } = useTheme();

  useEffect(() => {
    if (!transcript) return;
    const lower = transcript.toLowerCase();

    // Navigation Commands
    if (lower.includes('go to dashboard') || lower.includes('open dashboard')) {
      navigate('/dashboard');
      if (onCommandExecuted) onCommandExecuted('Navigated to Dashboard');
    } else if (lower.includes('open upload') || lower.includes('go to upload')) {
      navigate('/upload');
      if (onCommandExecuted) onCommandExecuted('Navigated to Upload');
    } else if (lower.includes('open ai') || lower.includes('open chat')) {
      navigate('/ai');
      if (onCommandExecuted) onCommandExecuted('Navigated to AI Assistant');
    } else if (lower.includes('open reports') || lower.includes('go to reports')) {
      navigate('/reports');
      if (onCommandExecuted) onCommandExecuted('Navigated to Reports');
    } else if (lower.includes('open settings') || lower.includes('go to settings')) {
      navigate('/settings');
      if (onCommandExecuted) onCommandExecuted('Navigated to Settings');
    }

    // Accessibility Mode Commands
    else if (lower.includes('enable dark mode') || lower.includes('dark mode')) {
      setThemeMode('dark');
      if (onCommandExecuted) onCommandExecuted('Enabled Dark Mode');
    } else if (lower.includes('enable light mode') || lower.includes('light mode')) {
      setThemeMode('light');
      if (onCommandExecuted) onCommandExecuted('Enabled Light Mode');
    } else if (lower.includes('enable dyslexia mode') || lower.includes('dyslexia mode')) {
      updateSettings({ dyslexiaFont: true });
      if (onCommandExecuted) onCommandExecuted('Enabled Dyslexia Mode');
    } else if (lower.includes('disable dyslexia mode')) {
      updateSettings({ dyslexiaFont: false });
      if (onCommandExecuted) onCommandExecuted('Disabled Dyslexia Mode');
    } else if (lower.includes('increase font size') || lower.includes('larger font')) {
      updateSettings({ fontSize: 'large' });
      if (onCommandExecuted) onCommandExecuted('Increased Font Size');
    } else if (lower.includes('reset font size') || lower.includes('normal font')) {
      updateSettings({ fontSize: 'medium' });
      if (onCommandExecuted) onCommandExecuted('Reset Font Size');
    }
  }, [transcript, navigate, updateSettings, setThemeMode, onCommandExecuted]);
};

export default useVoiceCommands;
