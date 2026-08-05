export const exportReportToJSON = (report) => {
  return JSON.stringify(report, null, 2);
};

export const exportReportToMarkdown = (report) => {
  return `# ascess-1-ai Accessibility Report
**Date**: ${new Date(report.createdAt || Date.now()).toLocaleDateString()}
**Overall WCAG Score**: ${report.score} / 100 (${report.tier})

## Executive Summary
${report.executiveSummary}

## Badges Earned
${report.badges?.map((b) => `- 🏆 ${b}`).join('\n') || 'None'}

## Priority Issues (${report.issues?.length || 0})
${report.issues
  ?.map(
    (iss) => `
### [${iss.severity}] ${iss.title}
- **Reason**: ${iss.reason}
- **Impact**: ${iss.impact}
- **Suggested Fix**: ${iss.suggestedFix}
`
  )
  .join('\n')}
`;
};

export const exportReportToTXT = (report) => {
  return `=====================================================
ASCESS-1-AI ACCESSIBILITY AUDIT REPORT
=====================================================
Date: ${new Date(report.createdAt || Date.now()).toLocaleDateString()}
Score: ${report.score} / 100 (${report.tier})

EXECUTIVE SUMMARY:
${report.executiveSummary}

ISSUES FOUND:
${report.issues?.map((i, idx) => `${idx + 1}. [${i.severity}] ${i.title}: ${i.suggestedFix}`).join('\n')}
=====================================================`;
};
