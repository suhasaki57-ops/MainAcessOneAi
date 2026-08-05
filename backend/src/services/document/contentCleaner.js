export const cleanContent = (text = '') => {
  if (!text) return '';

  return text
    // Remove null bytes and non-printable control characters
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace multiple carriage returns/newlines with double newline
    .replace(/(\r\n|\n|\r){3,}/g, '\n\n')
    // Fix broken line hyphenations (e.g. "accessi-\nbility" -> "accessibility")
    .replace(/(\w+)-\n(\w+)/g, '$1$2')
    // Replace multiple spaces with single space
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

export default cleanContent;
