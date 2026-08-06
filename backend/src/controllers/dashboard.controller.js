import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../supabase/database.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const docs = (await db.findAll('Documents')) || [];
  const reports = (await db.findAll('Reports')) || [];
  const logs = (await db.findAll('ActivityLogs')) || [];

  const totalDocuments = docs.length;
  const accessibilityScore = reports.length > 0
    ? Math.round(reports.reduce((acc, r) => acc + (Number(r.score) || 0), 0) / reports.length)
    : 0;

  const translationsCount = logs.filter((l) => l.action?.includes('Translation')).length;
  const aiQueriesCount = logs.filter((l) => l.action?.includes('Chat') || l.action?.includes('Copilot')).length;

  const recentActivities = logs.slice(0, 5).map((l) => ({
    id: l.id || `act_${Date.now()}`,
    action: l.action || 'Activity',
    description: l.description || 'System Activity',
    timestamp: l.created_at || new Date(),
  }));

  const stats = {
    totalDocuments,
    accessibilityScore,
    translationsCount,
    aiQueriesCount,
    recentActivities,
  };

  return res.status(200).json(new ApiResponse(200, stats, 'Dashboard statistics fetched successfully'));
});

