let activeDocumentContextMap = new Map();

export const setActiveDocumentContext = (userId, documentData) => {
  activeDocumentContextMap.set(userId, documentData);
  return documentData;
};

export const getActiveDocumentContext = (userId) => {
  return activeDocumentContextMap.get(userId) || null;
};

export const clearActiveDocumentContext = (userId) => {
  activeDocumentContextMap.delete(userId);
  return true;
};
