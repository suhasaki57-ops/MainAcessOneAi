export const Table = ({ headers = [], children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
