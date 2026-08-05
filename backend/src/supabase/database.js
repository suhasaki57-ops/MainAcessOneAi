import supabase from './client.js';

const memoryStore = new Map();

export const db = {
  async select(table, query = '*') {
    try {
      const { data, error } = await supabase.from(table).select(query);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn(`Supabase fallback for select(${table}):`, err.message);
      const items = memoryStore.get(table) || [];
      return items;
    }
  },

  async findById(table, id) {
    try {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data;
    } catch (err) {
      console.warn(`Supabase fallback for findById(${table}):`, err.message);
    }
    const items = memoryStore.get(table) || [];
    return items.find((item) => item.id === id) || null;
  },

  async insert(table, payload) {
    const record = {
      id: payload.id || `rec_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...payload,
    };

    try {
      const { data, error } = await supabase.from(table).insert(payload).select();
      if (error) throw error;
      if (data) return data;
    } catch (err) {
      console.warn(`Supabase fallback for insert(${table}):`, err.message);
    }

    const items = memoryStore.get(table) || [];
    items.unshift(record);
    memoryStore.set(table, items);
    return [record];
  },

  async update(table, id, payload) {
    try {
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).select();
      if (error) throw error;
      if (data) return data;
    } catch (err) {
      console.warn(`Supabase fallback for update(${table}):`, err.message);
    }

    const items = memoryStore.get(table) || [];
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...payload };
    }
    return [{ id, ...payload }];
  },

  async delete(table, id) {
    try {
      const { data, error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn(`Supabase fallback for delete(${table}):`, err.message);
    }

    const items = memoryStore.get(table) || [];
    memoryStore.set(
      table,
      items.filter((i) => i.id !== id)
    );
    return true;
  },
};

export default db;
