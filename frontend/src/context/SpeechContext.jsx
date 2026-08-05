import { createContext, useState, useEffect } from 'react';

export const SpeechContext = createContext(null);

export const SpeechProvider = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <SpeechContext.Provider
      value={{
        isSpeaking,
        isListening,
        transcript,
        speak,
        stopSpeaking,
        setIsListening,
        setTranscript,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};
