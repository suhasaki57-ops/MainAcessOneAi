import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { accessibilityService } from '../services/accessibilityService';
import {
  FiTrendingUp,
  FiFileText,
  FiGlobe,
  FiCpu,
  FiAlertTriangle,
  FiCheckCircle,
  FiBarChart2,
  FiCalendar,
  FiDownload
} from 'react-icons/fi';

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    averageScore: 94.8,
    scoreTrend: [
      { date: 'Mon', score: 88 },
      { date: 'Tue', score: 91 },
      { date: 'Wed', score: 90 },
      { date: 'Thu', score: 93 },
      { date: 'Fri', score: 95 },
      { date: 'Sat', score: 94 },
      { date: 'Sun', score: 96 },
    ],
    documentTypeBreakdown: [
      { type: 'PDF Files', count: 42, percentage: 45 },
      { type: 'Web URLs', count: 28, percentage: 30 },
      { type: 'Images (OCR)', count: 14, percentage: 15 },
      { type: 'Plain Text', count: 10, percentage: 10 },
    ],
    languageBreakdown: [
      { language: 'English', count: 64 },
      { language: 'Spanish', count: 18 },
      { language: 'Telugu', count: 12 },
      { language: 'Hindi', count: 8 },
    ],
    weeklyAIUsage: {
      simplifications: 124,
      translations: 86,
      audits: 48,
      copilotQueries: 210,
    },
    criticalIssuesFound: 3,
    totalAuditsRun: 94,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await accessibilityService.getAnalytics();
      const data = res.data || res;
      if (data.averageScore) setAnalytics(data);
    } catch (err) {
      console.warn('Analytics fetch note:', err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Accessibility Analytics</h1>
            <p className="text-sm text-slate-400 mt-1">Real-time WCAG score trends, document distribution, and AI usage metrics.</p>
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <FiDownload /> Export Summary
          </Button>
        </div>

        {/* Core KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Avg Accessibility Score</span>
              <FiTrendingUp className="text-cyan-400 text-base" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-400">{analytics.averageScore} / 100</div>
            <Badge variant="success" className="w-fit">+4.2% from last week</Badge>
          </Card>

          <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Audits Run</span>
              <FiFileText className="text-cyan-400 text-base" />
            </div>
            <div className="text-3xl font-extrabold text-white">{analytics.totalAuditsRun}</div>
            <span className="text-[11px] text-slate-500">Across PDFs, Web & OCR</span>
          </Card>

          <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Critical Issues</span>
              <FiAlertTriangle className="text-red-400 text-base" />
            </div>
            <div className="text-3xl font-extrabold text-red-400">{analytics.criticalIssuesFound}</div>
            <Badge variant="warning" className="w-fit">2 Pending Remediation</Badge>
          </Card>

          <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">AI Copilot Queries</span>
              <FiCpu className="text-cyan-400 text-base" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-400">{analytics.weeklyAIUsage.copilotQueries}</div>
            <span className="text-[11px] text-slate-500">Active assistant conversations</span>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Score Trend Chart */}
          <Card className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FiBarChart2 className="text-cyan-400" /> Weekly Accessibility Score Trend
              </h3>
              <Badge variant="info">WCAG AAA Evaluated</Badge>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800/80">
              {analytics.scoreTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.score}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg group-hover:brightness-125 transition-all"
                    style={{ height: `${(item.score / 100) * 160}px` }}
                  />
                  <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Document Type Distribution */}
          <Card className="flex flex-col gap-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3">
              Document Type Distribution
            </h3>
            <div className="flex flex-col gap-3">
              {analytics.documentTypeBreakdown.map((doc, idx) => (
                <div key={idx} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span>{doc.type}</span>
                    <span className="font-mono text-cyan-400">{doc.percentage}% ({doc.count})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${doc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Language & AI Usage Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Language Usage Breakdown</h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {analytics.languageBreakdown.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">{lang.language}</span>
                  <span className="text-xs font-bold text-cyan-400">{lang.count} docs</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Weekly Gemini AI Operations</h3>
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Simplifications</span>
                <span className="text-base font-bold text-white">{analytics.weeklyAIUsage.simplifications}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Translations</span>
                <span className="text-base font-bold text-white">{analytics.weeklyAIUsage.translations}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Audits Performed</span>
                <span className="text-base font-bold text-white">{analytics.weeklyAIUsage.audits}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Copilot Queries</span>
                <span className="text-base font-bold text-cyan-400">{analytics.weeklyAIUsage.copilotQueries}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
