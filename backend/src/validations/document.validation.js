import { z } from 'zod';

export const processUrlSchema = z.object({
  body: z.object({
    url: z.string().url('Invalid website URL format'),
  }),
});

export const processTextSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    text: z.string().min(1, 'Raw text content is required'),
  }),
});

export const setContextSchema = z.object({
  body: z.object({
    documentId: z.string().min(1, 'Document ID is required'),
  }),
});
