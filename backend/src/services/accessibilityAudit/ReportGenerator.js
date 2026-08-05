export const generateExecutiveReport = (auditResult) => {
  return {
    reportId: `REP-${Date.now()}`,
    createdAt: new Date().toISOString(),
    executiveSummary: `This accessibility audit evaluated document content against WCAG 2.1 AAA benchmarks. The overall score achieved is ${auditResult.score}/100 (${auditResult.tier} Rating).`,
    score: auditResult.score,
    tier: auditResult.tier,
    badges: auditResult.badges || [],
    categories: auditResult.categories,
    issuesCount: {
      total: auditResult.issues?.length || 0,
      critical: auditResult.issues?.filter((i) => i.severity === 'Critical').length || 0,
      high: auditResult.issues?.filter((i) => i.severity === 'High').length || 0,
      medium: auditResult.issues?.filter((i) => i.severity === 'Medium').length || 0,
      low: auditResult.issues?.filter((i) => i.severity === 'Low').length || 0,
    },
    issues: auditResult.issues || [],
  };
};

export default generateExecutiveReport;
