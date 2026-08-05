export const getAnalyticsData = (userId) => {
  return {
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
  };
};

export default getAnalyticsData;
