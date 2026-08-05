import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

export const AccessibilityScoreCard = ({ score = 94.5, contrast = 1, aria = 0, readability = 2 }) => {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-200">Accessibility Score</h3>
        <Badge variant={score > 90 ? 'success' : 'warning'}>
          {score > 90 ? 'WCAG AAA Ready' : 'WCAG AA Partial'}
        </Badge>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-cyan-400">{score}</span>
        <span className="text-sm text-slate-500">/ 100</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
        <div className="p-2 rounded-lg bg-slate-900/60">
          <div className="text-xs text-slate-400">Contrast</div>
          <div className="text-sm font-semibold text-amber-400 mt-0.5">{contrast} Issue</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60">
          <div className="text-xs text-slate-400">ARIA Tags</div>
          <div className="text-sm font-semibold text-emerald-400 mt-0.5">{aria} Issues</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60">
          <div className="text-xs text-slate-400">Readability</div>
          <div className="text-sm font-semibold text-cyan-400 mt-0.5">{readability} Suggestions</div>
        </div>
      </div>
    </Card>
  );
};

export default AccessibilityScoreCard;
