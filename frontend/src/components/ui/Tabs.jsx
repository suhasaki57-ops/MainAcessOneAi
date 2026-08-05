export const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
