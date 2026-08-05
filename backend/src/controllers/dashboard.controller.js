import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = {
    totalDocuments: 12,
    accessibilityScore: 94.8,
    translationsCount: 45,
    aiQueriesCount: 128,
    recentActivities: [
      { id: '1', action: 'Accessibility Scan', description: 'Scanned homepage URL', timestamp: new Date() },
      { id: '2', action: 'PDF Summary', description: 'Generated summary for document.pdf', timestamp: new Date() }
    ]
  };

  return res.status(200).json(new ApiResponse(200, stats, 'Dashboard statistics fetched successfully'));
});
