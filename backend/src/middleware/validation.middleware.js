import { ApiError } from '../utils/apiError.js';

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const formattedErrors = error.errors?.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    })) || [];
    next(new ApiError(400, 'Validation Error', formattedErrors));
  }
};

export default validateRequest;
