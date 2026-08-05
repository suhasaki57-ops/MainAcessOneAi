export const PasswordStrengthMeter = ({ password = '' }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' };
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&#^()_-]/.test(pwd)) score++;

    switch (score) {
      case 1:
      case 2:
        return { score: 25, label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
      case 3:
        return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
      case 4:
        return { score: 75, label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' };
      case 5:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
      default:
        return { score: 0, label: 'Weak', color: 'bg-slate-700', text: 'text-slate-500' };
    }
  };

  const strength = getStrength(password);

  return (
    <div className="w-full flex flex-col gap-1.5 mt-1">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-400">Password Strength:</span>
        <span className={strength.text}>{strength.label}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
