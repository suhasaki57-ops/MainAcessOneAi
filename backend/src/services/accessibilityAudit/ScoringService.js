export const calculateAccessibilityScore = (issues = [], textMetrics = {}) => {
  let baseScore = 100;

  // Deduct based on priority issues
  issues.forEach((issue) => {
    switch (issue.severity) {
      case 'Critical':
        baseScore -= 12;
        break;
      case 'High':
        baseScore -= 8;
        break;
      case 'Medium':
        baseScore -= 5;
        break;
      case 'Low':
        baseScore -= 2;
        break;
      case 'Informational':
        baseScore -= 1;
        break;
      default:
        baseScore -= 3;
    }
  });

  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

  // Tier Rating
  let tier = 'Average';
  if (finalScore >= 90) tier = 'Excellent';
  else if (finalScore >= 75) tier = 'Good';
  else if (finalScore >= 60) tier = 'Average';
  else if (finalScore >= 45) tier = 'Needs Improvement';
  else tier = 'Poor';

  // Category Breakdown Scores (0-100)
  const categories = {
    readability: Math.max(40, finalScore + (textMetrics.complexWords ? -5 : 3)),
    languageSimplicity: Math.max(40, finalScore - 2),
    accessibility: finalScore,
    structure: Math.max(50, finalScore + 2),
    navigation: Math.max(50, finalScore + 1),
    inclusiveness: Math.max(50, finalScore),
    overallExperience: finalScore,
  };

  // Badges
  const badges = [];
  if (finalScore >= 90) badges.push('Accessibility Champion');
  if (finalScore >= 75) badges.push('Good Accessibility');
  if (categories.structure >= 85) badges.push('Excellent Structure');
  if (categories.inclusiveness >= 85) badges.push('Inclusive Writing');
  if (finalScore < 60) badges.push('Needs Improvement');

  return {
    score: finalScore,
    tier,
    categories,
    badges,
  };
};

export default calculateAccessibilityScore;
