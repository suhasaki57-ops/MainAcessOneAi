import { registerUser, loginUser } from '../services/auth.service.js';
import { getUserProfile } from '../services/user.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.cookie('accessToken', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.cookie('accessToken', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(new ApiResponse(200, result, 'User logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  return res.status(200).json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  return res.status(200).json(new ApiResponse(200, user, 'Current user retrieved successfully'));
});
