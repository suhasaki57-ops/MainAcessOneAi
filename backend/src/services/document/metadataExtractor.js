export const extractMetadata = (text = '', pageCount = 1) => {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const characterCount = clean.length;
  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    characterCount,
    pageCount,
    estimatedReadingTime: `${readingTimeMinutes} min read`,
  };
};

export default extractMetadata;
