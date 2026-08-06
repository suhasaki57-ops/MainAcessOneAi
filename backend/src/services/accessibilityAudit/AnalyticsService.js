import db from '../../supabase/database.js';

export const getAnalyticsData = async (userId) => {
  const reports = (await db.findAll('Reports')) || [];
  const docs = (await db.findAll('Documents')) || [];
  const logs = (await db.findAll('ActivityLogs')) || [];

  const totalAuditsRun = reports.length;
  const averageScore = totalAuditsRun > 0
    ? Math.round(reports.reduce((acc, r) => acc + (Number(r.score) || 0), 0) / totalAuditsRun)
    : 0;

  const criticalIssuesFound = reports.reduce((acc, r) => {
    const issues = Array.isArray(r.violations) ? r.violations : [];
    return acc + issues.filter((i) => i.severity === 'Critical').length;
  }, 0);

  const copilotQueries = logs.filter((l) => l.action?.includes('Copilot') || l.action?.includes('Chat')).length;
  const simplifications = logs.filter((l) => l.action?.includes('Simplification')).length;
  const translations = logs.filter((l) => l.action?.includes('Translation')).length;

  return {
    averageScore,
    totalAuditsRun,
    criticalIssuesFound,
    weeklyAIUsage: {
      simplifications,
      translations,
      audits: totalAuditsRun,
      copilotQueries,
    },
    documentTypeBreakdown: [
      { type: 'PDF Files', count: docs.filter((d) => d.mime_type?.includes('pdf')).length, percentage: docs.length ? Math.round((docs.filter((d) => d.mime_type?.includes('pdf')).length / docs.length) * 100) : 0 },
      { type: 'Web URLs', count: logs.filter((l) => l.action?.includes('Website')).length, percentage: 0 },
      { type: 'Images (OCR)', count: logs.filter((l) => l.action?.includes('OCR')).length, percentage: 0 },
      { type: 'Plain Text', count: docs.filter((d) => !d.mime_type?.includes('pdf')).length, percentage: 0 },
    ],
    languageBreakdown: [
      { language: 'English', count: logs.filter((l) => l.description?.includes('English')).length },
      { language: 'Spanish', count: logs.filter((l) => l.description?.includes('Spanish')).length },
      { language: 'Telugu', count: logs.filter((l) => l.description?.includes('Telugu')).length },
      { language: 'Hindi', count: logs.filter((l) => l.description?.includes('Hindi')).length },
    ],
    scoreTrend: [
      { date: 'Mon', score: averageScore },
      { date: 'Tue', score: averageScore },
      { date: 'Wed', score: averageScore },
      { date: 'Thu', score: averageScore },
      { date: 'Fri', score: averageScore },
      { date: 'Sat', score: averageScore },
      { date: 'Sun', score: averageScore },
    ],
  };
};

export default getAnalyticsData;

