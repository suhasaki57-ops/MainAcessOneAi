import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_-])[A-Za-z\d@$!%*?&#^()_-]{8,}$/;

export const registerSchema = z.object({
  body: z
    .object({
      fullName: z.string().min(2, 'Full name must be at least 2 characters'),
      email: z.string().email('Invalid email address format'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(
          passwordRegex,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    avatarUrl: z.string().url('Invalid avatar URL format').or(z.literal('')).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters long')
        .regex(
          passwordRegex,
          'New password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
        ),
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    }),
});
