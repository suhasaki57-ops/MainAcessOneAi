import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    prompt: z.string().min(1, 'Prompt is required'),
    history: z.array(z.object({ sender: z.string(), text: z.string() })).optional(),
  }),
});

export const simplifySchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text is required'),
    level: z.enum(['simple', 'easy', 'child', 'senior', 'eli5', 'summarized']).default('simple'),
  }),
});

export const translateSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text to translate is required'),
    targetLanguage: z.string().min(1, 'Target language is required'),
  }),
});

export const analyzeSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text for accessibility analysis is required'),
  }),
});

export const altTextSchema = z.object({
  body: z.object({
    imageDescription: z.string().min(1, 'Image description or context is required'),
  }),
});

export const ocrCleanSchema = z.object({
  body: z.object({
    rawOCRText: z.string().min(1, 'Raw OCR text is required'),
  }),
});

export const summarizeSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Document text is required'),
  }),
});

export const websiteReportSchema = z.object({
  body: z.object({
    websiteContent: z.string().min(1, 'Website text or URL content is required'),
  }),
});

export const readingAssistantSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Reference document text is required'),
    query: z.string().min(1, 'User question is required'),
  }),
});
