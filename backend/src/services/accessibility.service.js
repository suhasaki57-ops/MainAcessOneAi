import db from '../supabase/database.js';

export const getPreferences = async (userId) => {
  const settings = await db.findById('Settings', userId);
  if (!settings) {
    return {
      user_id: userId,
      screen_reader_enabled: false,
      auto_translate: false,
      preferred_voice: 'en-US-Standard-A',
      voice_rate: 1.0,
      voice_pitch: 1.0,
      notifications_enabled: true,
    };
  }
  return settings;
};

export const updatePreferences = async (userId, payload) => {
  const existing = await db.findById('Settings', userId);
  if (!existing) {
    const created = await db.insert('Settings', { user_id: userId, ...payload });
    return Array.isArray(created) ? created[0] : created;
  }
  const updated = await db.update('Settings', userId, payload);
  return Array.isArray(updated) ? updated[0] : updated;
};
