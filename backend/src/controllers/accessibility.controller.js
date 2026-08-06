import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { getPreferences, updatePreferences } from '../services/accessibility.service.js';
import { auditContent, auditWebsite } from '../services/accessibilityAudit/AccessibilityAuditService.js';
import { exportReportToJSON, exportReportToMarkdown, exportReportToTXT } from '../services/accessibilityAudit/ExportService.js';
import getAnalyticsData from '../services/accessibilityAudit/AnalyticsService.js';
import db from '../supabase/database.js';
import ActivityLogService from '../services/activityLogService.js';

export const getAccessibilityPreferences = asyncHandler(async (req, res) => {
  const prefs = await getPreferences(req.user?.id);
  return res.status(200).json(new ApiResponse(200, prefs, 'Accessibility preferences fetched successfully'));
});

export const updateAccessibilityPreferences = asyncHandler(async (req, res) => {
  const updated = await updatePreferences(req.user?.id, req.body);

  ActivityLogService.logSettingsUpdate(req.user?.id || 'demo-user-101', req.body, req);

  return res.status(200).json(new ApiResponse(200, updated, 'Accessibility preferences updated successfully'));
});

export const getAccessibilityProfile = asyncHandler(async (req, res) => {
  const profile = {
    userId: req.user?.id,
    wcagTarget: 'AAA',
    screenReaderOptimized: true,
    voiceEnabled: true,
    highContrastReady: true,
  };
  return res.status(200).json(new ApiResponse(200, profile, 'Accessibility user profile fetched'));
});

export const updateAccessibilityProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.body, 'Accessibility user profile updated'));
});

export const runAudit = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const result = await auditContent(text, req.user?.id);

  ActivityLogService.logAudit(req.user?.id || 'demo-user-101', 'Submitted Content', result.score || 90, req);

  return res.status(200).json(new ApiResponse(200, result, 'Accessibility audit completed successfully'));
});

export const runWebsiteAudit = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const result = await auditWebsite(url, req.user?.id);

  ActivityLogService.logWebsiteScan(req.user?.id || 'demo-user-101', url, req);
  ActivityLogService.logAudit(req.user?.id || 'demo-user-101', url, result.score || 85, req);

  return res.status(200).json(new ApiResponse(200, result, 'Website accessibility audit completed successfully'));
});

export const getReportHistory = asyncHandler(async (req, res) => {
  const reports = await db.findAll('Reports');
  return res.status(200).json(new ApiResponse(200, reports || [], 'Audit report history retrieved'));
});

export const getReportById = asyncHandler(async (req, res) => {
  const report = await db.findById('Reports', req.params.id);
  return res.status(200).json(new ApiResponse(200, report || {}, 'Audit report details retrieved'));
});

export const deleteReport = asyncHandler(async (req, res) => {
  await db.delete('Reports', req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Audit report deleted'));
});

export const exportReport = asyncHandler(async (req, res) => {
  const { format, report } = req.body;
  let exportedData = '';

  if (format === 'json') {
    exportedData = exportReportToJSON(report);
    res.setHeader('Content-Type', 'application/json');
  } else if (format === 'markdown') {
    exportedData = exportReportToMarkdown(report);
    res.setHeader('Content-Type', 'text/markdown');
  } else {
    exportedData = exportReportToTXT(report);
    res.setHeader('Content-Type', 'text/plain');
  }

  ActivityLogService.logReportExport(req.user?.id || 'demo-user-101', format || 'PDF', req);

  return res.status(200).send(exportedData);
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getAnalyticsData(req.user?.id);
  return res.status(200).json(new ApiResponse(200, analytics, 'Analytics metrics retrieved'));
});
