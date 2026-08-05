export const Loader = ({ label = 'Loading ascess-1-ai...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
};

export default Loader;
