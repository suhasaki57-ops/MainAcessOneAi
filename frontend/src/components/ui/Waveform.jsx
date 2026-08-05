export const Waveform = ({ isPlaying = false }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-xs">
      {[40, 75, 30, 90, 50, 80, 20, 95, 60, 40, 85, 35].map((height, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full bg-cyan-400 transition-all duration-300 ${
            isPlaying ? 'animate-pulse' : 'opacity-40'
          }`}
          style={{
            height: isPlaying ? `${Math.max(15, (height * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
