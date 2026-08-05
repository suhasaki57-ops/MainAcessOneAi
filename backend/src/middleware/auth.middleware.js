import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import env from '../config/env.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request. Token missing.');
  }

  try {
    const decodedToken = jwt.verify(token, env.jwtSecret);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token.');
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, `User role '${req.user?.role}' is not authorized to access this resource.`);
    }
    next();
  };
};
