import db from '../supabase/database.js';

// Centralized In-Memory Store for instant sub-second retrieval & Supabase connection safety
let inMemoryLogs = [
  {
    id: 'log-seed-1',
    user_id: 'demo-user-101',
    action: 'Accessibility Audit',
    category: 'Scans',
    description: 'Audit color contrast ratio for CTA button',
    status: 'success',
    is_favorite: true,
    created_at: new Date('2026-08-05T14:22:00Z').toISOString(),
    date: '2026-08-05 14:22',
    metadata: { target: 'CTA button', score: 92 },
  },
  {
    id: 'log-seed-2',
    user_id: 'demo-user-101',
    action: 'Translation',
    category: 'Translations',
    description: 'Translate user interface strings into Spanish',
    status: 'success',
    is_favorite: false,
    created_at: new Date('2026-08-05T11:05:00Z').toISOString(),
    date: '2026-08-05 11:05',
    metadata: { sourceLang: 'English', targetLang: 'Spanish' },
  },
  {
    id: 'log-seed-3',
    user_id: 'demo-user-101',
    action: 'AI Chat Request',
    category: 'Prompts',
    description: 'Summarize WCAG 2.1 AA Compliance PDF',
    status: 'success',
    is_favorite: true,
    created_at: new Date('2026-08-04T18:30:00Z').toISOString(),
    date: '2026-08-04 18:30',
    metadata: { prompt: 'Summarize WCAG 2.1 AA Compliance PDF' },
  },
  {
    id: 'log-seed-4',
    user_id: 'demo-user-101',
    action: 'Document Upload',
    category: 'Uploads',
    description: 'Uploaded Product_Specification.docx OCR',
    status: 'success',
    is_favorite: false,
    created_at: new Date('2026-08-04T15:10:00Z').toISOString(),
    date: '2026-08-04 15:10',
    metadata: { filename: 'Product_Specification.docx', fileType: 'application/docx' },
  },
];

const getClientInfo = (req) => {
  if (!req) return { ip_address: '127.0.0.1', user_agent: 'Node.js Client' };
  const ip_address = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const user_agent = req.headers['user-agent'] || 'Unknown Browser';
  return { ip_address: typeof ip_address === 'string' ? ip_address.split(',')[0] : '127.0.0.1', user_agent };
};

export const ActivityLogService = {
  // Core generic log creator
  createLog: async ({ userId = 'demo-user-101', action, category = 'System', description, metadata = {}, status = 'success', req = null }) => {
    const { ip_address, user_agent } = getClientInfo(req);
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 16);

    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      user_id: userId,
      action,
      category,
      description: description || action,
      status,
      is_favorite: false,
      metadata,
      ip_address,
      user_agent,
      created_at: now.toISOString(),
      date: formattedDate,
    };

    // Store in-memory instantly
    inMemoryLogs.unshift(newLog);

    // Persist to ActivityLogs table in Supabase
    try {
      await db.insert('ActivityLogs', {
        user_id: userId,
        action,
        description: newLog.description,
        ip_address,
        user_agent,
      });
    } catch (err) {
      console.warn('ActivityLogs DB insert fallback:', err.message);
    }

    return newLog;
  },

  // Helper Methods for specific user actions
  logRegister: (userId, email, req) =>
    ActivityLogService.createLog({ userId, action: 'User Registration', category: 'Auth', description: `Registered new account: ${email}`, metadata: { email }, req }),

  logLogin: (userId, email, status = 'success', req) =>
    ActivityLogService.createLog({ userId, action: status === 'success' ? 'User Login' : 'Failed Login Attempt', category: 'Auth', description: status === 'success' ? `Logged in successfully: ${email}` : `Failed login attempt: ${email}`, status, metadata: { email }, req }),

  logLogout: (userId, req) =>
    ActivityLogService.createLog({ userId, action: 'Logout', category: 'Auth', description: 'User signed out', req }),

  logProfileUpdate: (userId, fields = [], req) =>
    ActivityLogService.createLog({ userId, action: 'Profile Update', category: 'Profile', description: `Updated user profile (${fields.join(', ')})`, metadata: { updatedFields: fields }, req }),

  logPasswordChange: (userId, req) =>
    ActivityLogService.createLog({ userId, action: 'Password Change', category: 'Profile', description: 'User changed account password', req }),

  logSettingsUpdate: (userId, settings = {}, req) =>
    ActivityLogService.createLog({ userId, action: 'Accessibility Settings Update', category: 'Settings', description: 'Updated global accessibility settings', metadata: settings, req }),

  logThemeChange: (userId, theme, req) =>
    ActivityLogService.createLog({ userId, action: 'Theme Change', category: 'Settings', description: `Changed UI theme mode to ${theme}`, metadata: { theme }, req }),

  logFontSizeChange: (userId, fontSize, req) =>
    ActivityLogService.createLog({ userId, action: 'Font Size Change', category: 'Settings', description: `Adjusted font scaling to ${fontSize}`, metadata: { fontSize }, req }),

  logVoiceSettingsChange: (userId, voice, req) =>
    ActivityLogService.createLog({ userId, action: 'Voice Settings Change', category: 'Settings', description: `Updated TTS voice to ${voice}`, metadata: { voice }, req }),

  logUpload: (userId, filename, fileType, size, req) =>
    ActivityLogService.createLog({ userId, action: 'Document Upload', category: 'Uploads', description: `Uploaded document ${filename}`, metadata: { filename, fileType, size }, req }),

  logDocumentDelete: (userId, docId, filename, req) =>
    ActivityLogService.createLog({ userId, action: 'Document Delete', category: 'Uploads', description: `Deleted document ${filename || docId}`, metadata: { docId, filename }, req }),

  logDocumentDownload: (userId, docId, filename, req) =>
    ActivityLogService.createLog({ userId, action: 'Document Download', category: 'Uploads', description: `Downloaded document ${filename || docId}`, metadata: { docId, filename }, req }),

  logOCRProcessing: (userId, filename, req) =>
    ActivityLogService.createLog({ userId, action: 'OCR Processing', category: 'Uploads', description: `Processed image OCR for ${filename}`, metadata: { filename }, req }),

  logPDFProcessing: (userId, filename, req) =>
    ActivityLogService.createLog({ userId, action: 'PDF Processing', category: 'Uploads', description: `Extracted text from PDF ${filename}`, metadata: { filename }, req }),

  logImageProcessing: (userId, filename, req) =>
    ActivityLogService.createLog({ userId, action: 'Image Processing', category: 'Uploads', description: `Analyzed visual layout for ${filename}`, metadata: { filename }, req }),

  logWebsiteScan: (userId, url, req) =>
    ActivityLogService.createLog({ userId, action: 'Website Scan', category: 'Scans', description: `Scanned website URL ${url}`, metadata: { url }, req }),

  logAudit: (userId, target, score, req) =>
    ActivityLogService.createLog({ userId, action: 'Accessibility Audit', category: 'Scans', description: `Completed accessibility audit for ${target} (Score: ${score}/100)`, metadata: { target, score }, req }),

  logReportExport: (userId, format, req) =>
    ActivityLogService.createLog({ userId, action: 'Accessibility Report Exported', category: 'Scans', description: `Exported accessibility report as ${format.toUpperCase()}`, metadata: { format }, req }),

  logTranslation: (userId, sourceLang, targetLang, textLength, req) =>
    ActivityLogService.createLog({ userId, action: 'Translation', category: 'Translations', description: `Translated ${textLength} chars from ${sourceLang} to ${targetLang}`, metadata: { sourceLang, targetLang, textLength }, req }),

  logTextSimplification: (userId, textLength, level, req) =>
    ActivityLogService.createLog({ userId, action: 'Text Simplification', category: 'Prompts', description: `Simplified text content (${level} level)`, metadata: { textLength, level }, req }),

  logAIChat: (userId, prompt, responseLength, req) =>
    ActivityLogService.createLog({ userId, action: 'AI Chat Request', category: 'Prompts', description: `Prompted Gemini Copilot: "${prompt.slice(0, 45)}..."`, metadata: { prompt, responseLength }, req }),

  logVoiceInput: (userId, text, req) =>
    ActivityLogService.createLog({ userId, action: 'Voice Input', category: 'Prompts', description: `Captured voice input: "${text.slice(0, 40)}..."`, metadata: { text }, req }),

  logVoiceOutput: (userId, text, req) =>
    ActivityLogService.createLog({ userId, action: 'Voice Output', category: 'Prompts', description: `Spoke text aloud: "${text.slice(0, 40)}..."`, metadata: { text }, req }),

  logHistoryDelete: (userId, logId, req) =>
    ActivityLogService.createLog({ userId, action: 'History Delete', category: 'System', description: `Removed history log entry #${logId}`, metadata: { logId }, req }),

  logFavoriteToggle: (userId, logId, isFav, req) =>
    ActivityLogService.createLog({ userId, action: isFav ? 'Favorite Added' : 'Favorite Removed', category: 'System', description: `${isFav ? 'Favorited' : 'Unfavorited'} log entry #${logId}`, metadata: { logId, isFav }, req }),

  logSearch: (userId, keyword, req) =>
    ActivityLogService.createLog({ userId, action: 'Search', category: 'System', description: `Performed search for "${keyword}"`, metadata: { keyword }, req }),

  // Query & Fetch Logs
  getLogs: async (userId, options = {}) => {
    const { category, search, status, dateRange } = options;
    let logs = [...inMemoryLogs];

    try {
      const dbLogs = await db.select('ActivityLogs');
      if (dbLogs && dbLogs.length > 0) {
        logs = dbLogs.map((l) => ({
          id: l.id,
          user_id: l.user_id,
          action: l.action,
          category: l.category || 'System',
          description: l.description || l.action,
          status: l.status || 'success',
          is_favorite: !!l.is_favorite,
          created_at: l.created_at,
          date: l.date || new Date(l.created_at || Date.now()).toISOString().replace('T', ' ').slice(0, 16),
          metadata: l.metadata || {},
          ip_address: l.ip_address,
          user_agent: l.user_agent,
        }));
      }
    } catch (err) {
      console.warn('ActivityLogs db select fallback:', err.message);
    }

    if (category && category !== 'All') {
      logs = logs.filter((l) => l.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      logs = logs.filter((l) => l.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const lower = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(lower) ||
          l.description.toLowerCase().includes(lower) ||
          l.category.toLowerCase().includes(lower)
      );
    }

    return logs;
  },

  toggleFavorite: async (logId, userId) => {
    const item = inMemoryLogs.find((l) => l.id === logId);
    if (item) {
      item.is_favorite = !item.is_favorite;
      return item;
    }
    return null;
  },

  deleteLog: async (logId, userId) => {
    inMemoryLogs = inMemoryLogs.filter((l) => l.id !== logId);
    return true;
  },
};

export default ActivityLogService;
