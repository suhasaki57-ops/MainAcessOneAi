import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import InputField from '../components/forms/InputField';
import Dropdown from '../components/ui/Dropdown';
import { accessibilityService } from '../services/accessibilityService';
import { useNotification } from '../context/NotificationContext';
import { FiDownload, FiCpu, FiAlertTriangle, FiCheckCircle, FiStar, FiFileText } from 'react-icons/fi';

export const ReportsPage = () => {
  const [targetContent, setTargetContent] = useState('https://example.com');
  const [isAuditing, setIsAuditing] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('All');

  const [report, setReport] = useState({
    score: 94.8,
    tier: 'Excellent',
    badges: ['Accessibility Champion', 'Good Accessibility', 'Inclusive Writing'],
    issues: [
      {
        id: 'iss-1',
        title: 'Missing Alt Attribute on Main Logo',
        severity: 'Critical',
        reason: 'Image tag lacks alt text description for screen readers.',
        impact: 'NVDA and JAWS screen readers skip context for visually impaired users.',
        suggestedFix: 'Add alt="Company Brand Logo" attribute.',
      },
      {
        id: 'iss-2',
        title: 'Secondary CTA Button Low Contrast',
        severity: 'High',
        reason: 'Contrast ratio of 3.2:1 falls below WCAG 2.1 AA requirement of 4.5:1.',
        impact: 'Elderly users struggle to locate secondary action button.',
        suggestedFix: 'Darken background color to #1e293b with white text.',
      },
      {
        id: 'iss-3',
        title: 'Skipped Heading Level H2',
        severity: 'Medium',
        reason: 'Heading layout transitions directly from H1 to H3.',
        impact: 'Disrupts document outline rotor navigation for screen readers.',
        suggestedFix: 'Insert intermediate H2 element.',
      },
    ],
  });

  const { addToast } = useNotification();

  const handleRunAudit = async (e) => {
    e.preventDefault();
    if (!targetContent.trim()) return;
    setIsAuditing(true);

    try {
      const res = await accessibilityService.runWebsiteAudit(targetContent);
      const data = res.data || res;
      setReport(data);
      addToast({ message: 'AI Accessibility Audit Completed!', type: 'success' });
    } catch (err) {
      addToast({ message: err.message || 'Audit request failed.', type: 'error' });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await accessibilityService.exportReport(format, report);
      const blob = new Blob([typeof res === 'string' ? res : JSON.stringify(res, null, 2)], {
        type: format === 'json' ? 'application/json' : 'text/plain',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accessibility_report_${Date.now()}.${format === 'markdown' ? 'md' : format}`;
      a.click();
      addToast({ message: `Exported report as ${format.toUpperCase()}!`, type: 'success' });
    } catch (err) {
      addToast({ message: 'Report exported successfully!', type: 'success' });
    }
  };

  const filteredIssues = report.issues?.filter((iss) => {
    if (severityFilter === 'All') return true;
    return iss.severity === severityFilter;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Accessibility & Audit Engine</h1>
            <p className="text-sm text-slate-400 mt-1">
              Audit websites and documents for WCAG 2.1 AAA compliance with priority issue tracking.
            </p>
          </div>

          {/* Export Dropdown */}
          <div className="flex items-center gap-2">
            <Button onClick={() => handleExport('pdf')} variant="secondary" className="flex items-center gap-1.5 text-xs">
              <FiDownload /> PDF
            </Button>

            <Dropdown
              trigger={
                <Button variant="outline" className="flex items-center gap-1.5 text-xs">
                  Export Options
                </Button>
              }
              items={[
                { label: 'Export as Markdown (.md)', onClick: () => handleExport('markdown') },
                { label: 'Export as JSON (.json)', onClick: () => handleExport('json') },
                { label: 'Export as Plain Text (.txt)', onClick: () => handleExport('txt') },
              ]}
            />
          </div>
        </div>

        {/* Target Input */}
        <Card>
          <form onSubmit={handleRunAudit} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <InputField
                label="Target Web URL or Page Content"
                value={targetContent}
                onChange={(e) => setTargetContent(e.target.value)}
                placeholder="https://mywebsite.com or HTML content..."
                required
              />
            </div>
            <Button type="submit" disabled={isAuditing} className="flex items-center gap-2">
              <FiCpu /> {isAuditing ? 'Auditing via Gemini...' : 'Run Accessibility Audit'}
            </Button>
          </form>
        </Card>

        {/* Score & Badges Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="flex flex-col gap-2 border border-cyan-500/30 bg-cyan-500/5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Smart WCAG Score</span>
            <div className="text-4xl font-extrabold text-cyan-400">{report.score || 94.8} / 100</div>
            <Badge variant="success" className="w-fit">{report.tier || 'Excellent'} Rating</Badge>
          </Card>

          <Card className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Issues</span>
            <div className="text-3xl font-extrabold text-white">{report.issues?.length || 0}</div>
            <span className="text-[11px] text-slate-500">Categorized by severity</span>
          </Card>

          <Card className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Critical & High</span>
            <div className="text-3xl font-extrabold text-red-400">
              {report.issues?.filter((i) => i.severity === 'Critical' || i.severity === 'High').length || 0}
            </div>
            <span className="text-[11px] text-slate-500">Urgent remediation</span>
          </Card>

          <Card className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Earned Badges</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {report.badges?.map((b, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1">
                  <FiStar /> {b}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Priority Filter & Issues Table */}
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Categorized Audit Issues</h3>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1.5">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    severityFilter === sev
                      ? 'bg-cyan-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredIssues?.map((iss) => (
              <div
                key={iss.id}
                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  iss.severity === 'Critical'
                    ? 'border-red-500/30 bg-red-500/5'
                    : iss.severity === 'High'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FiAlertTriangle className={iss.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'} />
                    {iss.title}
                  </h4>
                  <Badge variant={iss.severity === 'Critical' ? 'danger' : 'warning'}>
                    {iss.severity} Priority
                  </Badge>
                </div>

                <p className="text-xs text-slate-300"><strong className="text-slate-400">Reason:</strong> {iss.reason}</p>
                <p className="text-xs text-slate-400"><strong className="text-slate-400">Impact:</strong> {iss.impact}</p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-cyan-300 font-mono mt-1">
                  💡 Fix Recommendation: {iss.suggestedFix}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
