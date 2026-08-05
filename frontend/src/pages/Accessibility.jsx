import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import InputField from '../components/forms/InputField';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AccessibilityScoreCard from '../components/accessibility/AccessibilityScoreCard';
import AccessibilityToolbar from '../components/accessibility/AccessibilityToolbar';

export const Accessibility = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = (e) => {
    e.preventDefault();
    if (!url) return;
    setIsScanning(true);
    setTimeout(() => {
      setResult({
        url,
        score: 95.2,
        contrast: 0,
        aria: 1,
        readability: 1,
      });
      setIsScanning(false);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Accessibility Scanner</h1>
          <p className="text-sm text-slate-400 mt-1">Audit websites or documents against WCAG 2.1 compliance.</p>
        </div>

        <AccessibilityToolbar activeText="Accessibility Scanner module ready. Enter a URL to audit." />

        <Card>
          <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <InputField
                label="Target Web URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <Button type="submit" disabled={isScanning}>
              {isScanning ? 'Scanning...' : 'Run Audit'}
            </Button>
          </form>
        </Card>

        {result && (
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <AccessibilityScoreCard
              score={result.score}
              contrast={result.contrast}
              aria={result.aria}
              readability={result.readability}
            />
            <Card>
              <h3 className="font-bold text-white mb-2">Audit Report Details</h3>
              <p className="text-sm text-slate-400">Scanned URL: <span className="text-cyan-400">{result.url}</span></p>
              <ul className="mt-4 text-xs text-slate-300 flex flex-col gap-2">
                <li className="p-2 rounded bg-slate-900 border border-slate-800">✅ All image alt attributes verified.</li>
                <li className="p-2 rounded bg-slate-900 border border-slate-800">⚠️ 1 missing aria-label on modal trigger button.</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Accessibility;
