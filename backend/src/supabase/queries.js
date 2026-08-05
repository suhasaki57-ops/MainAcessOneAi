import supabase from './client.js';

export const userQueries = {
  findByEmail: async (email) => {
    const { data, error } = await supabase.from('Users').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
  },
  createUser: async (userData) => {
    const { data, error } = await supabase.from('Users').insert([userData]).select().single();
    if (error) throw error;
    return data;
  }
};

export const documentQueries = {
  getUserDocuments: async (userId) => {
    const { data, error } = await supabase.from('Documents').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

export const aiHistoryQueries = {
  getLogsByUser: async (userId) => {
    const { data, error } = await supabase.from('AIHistory').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

export const accessibilityQueries = {
  getReportsByUser: async (userId) => {
    const { data, error } = await supabase.from('AccessibilityReports').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
