import db from '../supabase/database.js';

export const listDocuments = async (userId) => {
  return await db.select('Documents', '*');
};

export const createDocumentRecord = async (docData) => {
  return await db.insert('Documents', docData);
};
