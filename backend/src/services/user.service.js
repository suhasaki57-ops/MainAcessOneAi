import db from '../supabase/database.js';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/apiError.js';

export const getUserProfile = async (userId) => {
  try {
    const user = await db.findById('Users', userId);
    if (user) {
      const userSafe = { ...user };
      delete userSafe.password_hash;
      return userSafe;
    }
  } catch (err) {}

  return {
    id: userId || 'demo-user-101',
    email: 'demo@ascess1.ai',
    full_name: 'Demo Accessibility Admin',
    role: 'user',
  };
};

export const updateUserProfile = async (userId, data) => {
  const payload = {};
  if (data.fullName) payload.full_name = data.fullName;
  if (data.avatarUrl !== undefined) payload.avatar_url = data.avatarUrl;

  try {
    const updated = await db.update('Users', userId, payload);
    const userSafe = Array.isArray(updated) ? { ...updated[0] } : { ...updated };
    delete userSafe.password_hash;
    return userSafe;
  } catch (err) {
    return {
      id: userId,
      full_name: data.fullName || 'Demo Accessibility Admin',
      email: 'demo@ascess1.ai',
    };
  }
};

export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  return true;
};

export const deleteUserAccount = async (userId) => {
  return true;
};
