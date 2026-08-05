import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount } from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  return res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserProfile(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await changeUserPassword(req.user.id, oldPassword, newPassword);
  return res.status(200).json(new ApiResponse(200, {}, 'Password updated successfully'));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await deleteUserAccount(req.user.id);
  res.clearCookie('accessToken');
  return res.status(200).json(new ApiResponse(200, {}, 'User account deleted successfully'));
});
