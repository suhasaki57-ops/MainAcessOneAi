import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getHistory = asyncHandler(async (req, res) => {
  const history = [
    { id: '1', prompt: 'Summarize WCAG guidelines', response: 'WCAG guidelines focus on perceivable, operable, understandable, and robust content.', featureType: 'summarization', created_at: new Date() }
  ];

  return res.status(200).json(new ApiResponse(200, history, 'History fetched successfully'));
});
