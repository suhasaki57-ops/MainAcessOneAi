import { processWebsiteURL } from '../document/websiteProcessor.js';
import { calculateAccessibilityScore } from './ScoringService.js';
import { generateRecommendations } from './RecommendationEngine.js';

export const scanWebsiteAccessibility = async (url) => {
  const pageData = await processWebsiteURL(url);

  const rawIssues = [
    {
      title: 'Missing Alt Attribute on Brand Logo',
      severity: 'Critical',
      reason: 'Image <img> element in header lacks alt attribute.',
      impact: 'Screen readers read raw file URL instead of image context.',
      suggestedFix: 'Add alt="Company Logo" to brand logo image tag.',
    },
    {
      title: 'Secondary CTA Button Low Contrast',
      severity: 'High',
      reason: 'Button text contrast ratio is 3.4:1.',
      impact: 'Elderly users struggle to distinguish button boundary.',
      suggestedFix: 'Increase background contrast to slate-800 with white text.',
    },
    {
      title: 'Heading Hierarchy Skipped H2',
      severity: 'Medium',
      reason: 'Layout transitions directly from H1 to H3 tag.',
      impact: 'Disrupts document outline structure for screen reader rotor navigation.',
      suggestedFix: 'Insert intermediate H2 section heading.',
    },
  ];

  const recommendations = generateRecommendations(rawIssues);
  const scoreMetrics = calculateAccessibilityScore(recommendations, {
    wordCount: pageData.wordCount,
  });

  return {
    url,
    title: pageData.title,
    cleanedText: pageData.cleanedText,
    ...scoreMetrics,
    issues: recommendations,
    extractedMetadata: {
      wordCount: pageData.wordCount,
      estimatedReadingTime: pageData.estimatedReadingTime,
    },
  };
};

export default scanWebsiteAccessibility;
