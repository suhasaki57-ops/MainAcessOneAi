export const generateRecommendations = (rawIssues = []) => {
  const defaultIssues = [
    {
      id: 'iss-1',
      title: 'Button Missing ARIA Label',
      severity: 'Critical',
      reason: 'Interactive trigger button lacks accessible name for NVDA/JAWS screen readers.',
      impact: 'Visually impaired users cannot determine button function.',
      suggestedFix: 'Add aria-label="Submit audit form" attribute.',
      improvedCode: '<button aria-label="Submit audit form" className="bg-cyan-600">Submit</button>',
    },
    {
      id: 'iss-2',
      title: 'Low Contrast Subtext',
      severity: 'High',
      reason: 'Subtext color contrast ratio is 3.1:1, falling below WCAG 2.1 AA 4.5:1 minimum.',
      impact: 'Users with low vision or elderly users cannot read instructions clearly.',
      suggestedFix: 'Lighten text color to #94a3b8 or #e2e8f0.',
      improvedCode: '<p className="text-slate-400">Lightened text contrast</p>',
    },
    {
      id: 'iss-3',
      title: 'Long Complex Sentence',
      severity: 'Medium',
      reason: 'Sentence contains 32 words with multi-syllable jargon.',
      impact: 'Increases cognitive load for users with reading difficulties or dyslexia.',
      suggestedFix: 'Split into two shorter sentences under 15 words each.',
      improvedCode: 'Split complex sentence into concise bullet points.',
    },
  ];

  if (!rawIssues || rawIssues.length === 0) {
    return defaultIssues;
  }

  return rawIssues.map((iss, index) => ({
    id: `iss-${index + 1}`,
    title: iss.title || iss.rule || 'Accessibility Finding',
    severity: iss.severity || 'Medium',
    reason: iss.reason || iss.recommendation || 'WCAG benchmark recommendation.',
    impact: iss.impact || 'Affects screen reader or readability user experience.',
    suggestedFix: iss.suggestedFix || 'Apply recommended HTML/CSS adjustments.',
    improvedCode: iss.improvedCode || 'Updated accessible element snippet.',
  }));
};

export default generateRecommendations;
