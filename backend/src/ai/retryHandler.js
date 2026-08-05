export const withRetry = async (fn, retries = 1, delayMs = 500) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`⚠️ Transient Gemini API error encountered. Retrying in ${delayMs}ms... (Error: ${error.message})`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return await withRetry(fn, retries - 1, delayMs * 2);
  }
};

export default withRetry;
