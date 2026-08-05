import fs from 'fs';
import { processPDFBuffer } from './pdfProcessor.js';
import { processImageFile } from './imageProcessor.js';
import { processWebsiteURL } from './websiteProcessor.js';
import { cleanContent } from './contentCleaner.js';
import { extractMetadata } from './metadataExtractor.js';
import { documentStorage } from './documentStorageService.js';

export const processFileDocument = async (file, userId, customTitle) => {
  const filePath = file.path;
  const mimeType = file.mimetype;
  let parsed = {};

  if (mimeType === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    parsed = await processPDFBuffer(buffer, file.originalname);
  } else if (mimeType.startsWith('image/')) {
    parsed = await processImageFile(filePath);
  } else {
    const textContent = fs.readFileSync(filePath, 'utf-8');
    const cleanedText = cleanContent(textContent);
    parsed = {
      title: file.originalname,
      cleanedText,
      ...extractMetadata(cleanedText, 1),
    };
  }

  const docRecord = {
    userId,
    title: customTitle || parsed.title || file.originalname,
    fileName: file.filename || file.originalname,
    filePath,
    fileSize: file.size,
    mimeType,
    extractedText: parsed.cleanedText,
    ocrStatus: 'completed',
    ...parsed,
  };

  const saved = await documentStorage.saveDocument(docRecord);
  const resultObj = Array.isArray(saved) ? saved[0] : saved;

  return {
    ...resultObj,
    pageCount: parsed.pageCount || 1,
    wordCount: parsed.wordCount || 0,
    characterCount: parsed.characterCount || 0,
    estimatedReadingTime: parsed.estimatedReadingTime || '1 min read',
    extractedText: parsed.cleanedText,
  };
};

export const processURLDocument = async (url, userId) => {
  const parsed = await processWebsiteURL(url);

  const docRecord = {
    userId,
    title: parsed.title,
    fileName: `${parsed.title.slice(0, 20)}.html`,
    filePath: url,
    fileSize: parsed.characterCount,
    mimeType: 'text/html',
    extractedText: parsed.cleanedText,
    ocrStatus: 'completed',
  };

  const saved = await documentStorage.saveDocument(docRecord);
  const resultObj = Array.isArray(saved) ? saved[0] : saved;

  return {
    ...resultObj,
    pageCount: 1,
    wordCount: parsed.wordCount,
    characterCount: parsed.characterCount,
    estimatedReadingTime: parsed.estimatedReadingTime,
    extractedText: parsed.cleanedText,
  };
};

export const processTextDocument = async (title, rawText, userId) => {
  const cleanedText = cleanContent(rawText);
  const metadata = extractMetadata(cleanedText, 1);

  const docRecord = {
    userId,
    title: title || 'Pasted Content Document',
    fileName: 'raw_content.txt',
    filePath: '/uploads/raw_content.txt',
    fileSize: metadata.characterCount,
    mimeType: 'text/plain',
    extractedText: cleanedText,
    ocrStatus: 'completed',
  };

  const saved = await documentStorage.saveDocument(docRecord);
  const resultObj = Array.isArray(saved) ? saved[0] : saved;

  return {
    ...resultObj,
    pageCount: 1,
    wordCount: metadata.wordCount,
    characterCount: metadata.characterCount,
    estimatedReadingTime: metadata.estimatedReadingTime,
    extractedText: cleanedText,
  };
};
