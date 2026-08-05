import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Waveform from '../components/ui/Waveform';
import { useSpeech } from '../hooks/useSpeech';
import { FiVolume2, FiPlay, FiPause, FiSquare, FiMic, FiSliders } from 'react-icons/fi';

export const VoicePage = () => {
  const [text, setText] = useState(
    'ascess-1-ai is engineered with Web Speech API text-to-speech synthesis and voice navigation hooks. Accessible web apps ensure equal opportunity for individuals with disabilities.'
  );
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const { isSpeaking, speak, stopSpeaking } = useSpeech();

  const handleStart = () => {
    speak(text);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Voice Assistant & Reader</h1>
          <p className="text-sm text-slate-400 mt-1">High quality text-to-speech engine and audio playback controls.</p>
        </div>

        {/* Audio Visualizer & Waveform Card */}
        <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 gap-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
            <FiVolume2 />
          </div>

          <Waveform isPlaying={isSpeaking} />

          <div className="flex items-center gap-3 mt-2">
            {!isSpeaking ? (
              <Button onClick={handleStart} className="flex items-center gap-2 px-6 py-2.5">
                <FiPlay /> Start Reading
              </Button>
            ) : (
              <Button onClick={stopSpeaking} variant="danger" className="flex items-center gap-2 px-6 py-2.5">
                <FiSquare /> Stop Playback
              </Button>
            )}
          </div>
        </Card>

        {/* Speed & Pitch Controls */}
        <Card className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><FiSliders /> Reading Rate / Speed</span>
              <span className="text-cyan-400 font-mono">{rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><FiSliders /> Voice Pitch</span>
              <span className="text-cyan-400 font-mono">{pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </Card>

        {/* Reader Text Area */}
        <Card className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-300">Target Text for Speech Reader</label>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 leading-relaxed"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VoicePage;
