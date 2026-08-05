import db from '../../supabase/database.js';
import supabase from '../../supabase/client.js';

export const documentStorage = {
  saveDocument: async (docData) => {
    const payload = {
      user_id: docData.userId,
      title: docData.title || 'Untitled Document',
      file_name: docData.fileName || 'document.pdf',
      file_path: docData.filePath || '/uploads/file.pdf',
      file_size: docData.fileSize || 1024,
      mime_type: docData.mimeType || 'application/pdf',
      extracted_text: docData.extractedText || '',
      ocr_status: docData.ocrStatus || 'completed',
    };
    return await db.insert('Documents', payload);
  },

  getUserDocuments: async (userId, { type, search, favorite } = {}) => {
    try {
      let query = supabase.from('Documents').select('*').order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase document query fallback:', err.message);
    }

    const fallbackList = await db.select('Documents');
    return fallbackList || [];
  },

  getDocumentById: async (id) => {
    return await db.findById('Documents', id);
  },

  deleteDocument: async (id) => {
    return await db.delete('Documents', id);
  },
};

export default documentStorage;
