import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = {
    screenReaderEnabled: true,
    autoTranslate: false,
    preferredVoice: 'en-US-Standard-A',
    voiceRate: 1.0,
    voicePitch: 1.0,
    aiModel: 'gemini-1.5-pro'
  };

  return res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'));
});

export const updateSettings = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.body, 'Settings updated successfully'));
});
