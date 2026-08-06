import { registerUser, loginUser } from '../services/auth.service.js';
import { getUserProfile } from '../services/user.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ActivityLogService from '../services/activityLogService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  ActivityLogService.logRegister(result.user?.id || 'demo-user-101', req.body.email, req);

  res.cookie('accessToken', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  try {
    const result = await loginUser(req.body);

    ActivityLogService.logLogin(result.user?.id || 'demo-user-101', req.body.email, 'success', req);

    res.cookie('accessToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(new ApiResponse(200, result, 'User logged in successfully'));
  } catch (err) {
    ActivityLogService.logLogin('unknown', req.body.email, 'failed', req);
    throw err;
  }
});

export const logout = asyncHandler(async (req, res) => {
  ActivityLogService.logLogout(req.user?.id || 'demo-user-101', req);
  res.clearCookie('accessToken');
  return res.status(200).json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  return res.status(200).json(new ApiResponse(200, user, 'Current user retrieved successfully'));
});
