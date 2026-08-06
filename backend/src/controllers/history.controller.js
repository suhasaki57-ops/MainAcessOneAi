import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ActivityLogService from '../services/activityLogService.js';

export const getHistory = asyncHandler(async (req, res) => {
  const { category, search, status, dateRange } = req.query;

  const logs = await ActivityLogService.getLogs(req.user?.id || 'demo-user-101', {
    category,
    search,
    status,
    dateRange,
  });

  return res.status(200).json(new ApiResponse(200, logs, 'Activity logs fetched successfully'));
});

export const createHistory = asyncHandler(async (req, res) => {
  const { title, category, action, description, metadata } = req.body;

  const newLog = await ActivityLogService.createLog({
    userId: req.user?.id || 'demo-user-101',
    action: action || title || 'New Activity Log',
    category: category || 'Scans',
    description: description || title || 'User Activity',
    metadata: metadata || {},
    req,
  });

  return res.status(201).json(new ApiResponse(201, newLog, 'Activity log entry created'));
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedLog = await ActivityLogService.toggleFavorite(id, req.user?.id || 'demo-user-101');

  if (updatedLog) {
    ActivityLogService.logFavoriteToggle(req.user?.id || 'demo-user-101', id, updatedLog.is_favorite, req);
  }

  return res.status(200).json(new ApiResponse(200, updatedLog || { id, is_favorite: true }, 'Favorite status updated'));
});

export const deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ActivityLogService.deleteLog(id, req.user?.id || 'demo-user-101');

  ActivityLogService.logHistoryDelete(req.user?.id || 'demo-user-101', id, req);

  return res.status(200).json(new ApiResponse(200, { id }, 'History entry deleted'));
});
