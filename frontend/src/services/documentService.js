import api from './api';

export const documentService = {
  uploadFile: async (formData) => {
    return await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  processUrl: async (url) => {
    return await api.post('/documents/url', { url });
  },
  processText: async (title, text) => {
    return await api.post('/documents/text', { title, text });
  },
  getDocuments: async (params = {}) => {
    return await api.get('/documents', { params });
  },
  getDocumentById: async (id) => {
    return await api.get(`/documents/${id}`);
  },
  deleteDocument: async (id) => {
    return await api.delete(`/documents/${id}`);
  },
  reprocessDocument: async (documentId, feature) => {
    return await api.post('/documents/process', { documentId, feature });
  },
  setAIContext: async (documentId) => {
    return await api.post('/documents/context', { documentId });
  },
};

export default documentService;
