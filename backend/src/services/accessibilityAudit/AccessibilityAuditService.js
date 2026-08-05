import { aiEngine } from '../../ai/aiService.js';
import { calculateAccessibilityScore } from './ScoringService.js';
import { generateRecommendations } from './RecommendationEngine.js';
import { generateExecutiveReport } from './ReportGenerator.js';
import { scanWebsiteAccessibility } from './WebsiteScanner.js';
import db from '../../supabase/database.js';

export const auditContent = async (text, userId) => {
  const aiAnalysis = await aiEngine.analyzeAccessibility(text);
  const recommendations = generateRecommendations(aiAnalysis.accessibilityProblems || []);
  const scoreMetrics = calculateAccessibilityScore(recommendations, { complexWords: aiAnalysis.complexWords?.length || 0 });
  
  const reportPayload = generateExecutiveReport({
    ...scoreMetrics,
    issues: recommendations,
  });

  try {
    await db.insert('Reports', {
      user_id: userId,
      title: 'Accessibility Audit Report',
      score: scoreMetrics.score,
      violations: recommendations,
    });
  } catch (err) {
    console.warn('Report persistence warning:', err.message);
  }

  return reportPayload;
};

export const auditWebsite = async (url, userId) => {
  const scanned = await scanWebsiteAccessibility(url);
  const reportPayload = generateExecutiveReport(scanned);

  try {
    await db.insert('Reports', {
      user_id: userId,
      title: `Website Audit: ${url}`,
      score: scanned.score,
      violations: scanned.issues,
    });
  } catch (err) {
    console.warn('Website report persistence warning:', err.message);
  }

  return reportPayload;
};
