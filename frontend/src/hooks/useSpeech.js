import { useContext } from 'react';
import { SpeechContext } from '../context/SpeechContext';

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};

export default useSpeech;
