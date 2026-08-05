export const buildSimplifierPrompt = (text, level = 'simple') => {
  const instructions = {
    simple: 'Simplify the following text using basic English vocabulary and straightforward sentence structures.',
    easy: 'Rewrite this text so it is extremely easy to read for anyone.',
    child: 'Rewrite this text for a 10-year-old child using relatable analogies and simple words.',
    senior: 'Rewrite this text for senior citizens using clear font-friendly syntax and zero jargon.',
    eli5: "Explain like I'm 5 years old using a short, clear story or analogy.",
    summarized: 'Summarize the core meaning of this text in 2 simple sentences.',
  };

  const modeInstruction = instructions[level] || instructions.simple;

  return {
    systemInstruction: `You are an expert accessibility copywriter and readability optimizer. ${modeInstruction} Return plain text only without meta comments.`,
    prompt: text,
  };
};

export const buildTranslationPrompt = (text, targetLanguage) => {
  return {
    systemInstruction: `You are an expert translator specializing in technical and accessibility content. Translate the provided text into ${targetLanguage}. IMPORTANT: Preserve all HTML tags, Markdown formatting, lists, and headings exactly as presented in the original text.`,
    prompt: text,
  };
};

export const buildAccessibilityAnalyzerPrompt = (text) => {
  return {
    systemInstruction: `You are an automated WCAG 2.1 AAA Accessibility & Readability Auditor. Analyze the provided text and output ONLY a raw JSON object with the following schema:
{
  "readingLevel": "String (e.g. Grade 8, High School, Academic)",
  "accessibilityScore": Number (0-100),
  "readingDifficulty": "String (e.g. Easy, Moderate, High, Extreme)",
  "complexWords": ["List of complex words found"],
  "longSentences": ["List of sentences exceeding 25 words"],
  "passiveVoiceInstances": ["List of passive voice phrases"],
  "accessibilityProblems": ["List of WCAG compliance or readability issues"],
  "suggestions": ["List of actionable remediation steps"]
}
Do not enclose in markdown codeblocks if possible, or return strictly parseable JSON.`,
    prompt: text,
  };
};

export const buildAltTextPrompt = (imageDescription) => {
  return {
    systemInstruction: `You are an accessibility expert specializing in screen reader alt text generation. Based on the provided image description or context, generate a JSON object with 3 alt text variants:
{
  "shortAltText": "Concise 1-sentence alt text (under 125 characters)",
  "detailedAltText": "Comprehensive alt text covering visual elements, colors, and layout",
  "screenReaderOptimized": "Alt text optimized for NVDA and JAWS screen readers avoiding words like 'image of' or 'photo of'"
}`,
    prompt: imageDescription,
  };
};

export const buildOCRCleanPrompt = (rawOCRText) => {
  return {
    systemInstruction: `You are an intelligent OCR & Product Packaging Post-Processing Engine. Your task is to analyze noisy raw OCR text from camera photos, product packets (e.g. Gold Winner Sunflower Oil, food items, documents), fix OCR spelling errors (e.g. "swinner" -> "Gold Winner", "oil" -> "Sunflower Oil"), strip random garbage symbols (e.g., "| \ % / RRR"), and reconstruct the proper product name, packaging label details, and clean text.
Output ONLY a raw JSON object:
{
  "cleanedText": "Sanitized, properly spelled full product or document text",
  "productName": "Identified Product Name (e.g. Gold Winner Refined Sunflower Oil)",
  "summary": "Clear executive summary of the product packaging or document",
  "correctionsMade": ["List of OCR corrections applied"]
}`,
    prompt: rawOCRText,
  };
};

export const buildSummarizerPrompt = (text) => {
  return {
    systemInstruction: `You are an expert document and product packaging summarization assistant. Analyze the text or OCR output (e.g. Gold Winner Sunflower Oil, technical documents, articles). Identify the main product or document topic, strip OCR noise, and generate a structured JSON object:
{
  "shortSummary": "1-2 sentence clear executive summary describing the product or document",
  "detailedSummary": "Comprehensive summary covering product specifications, nutritional details, or document outline",
  "bulletPoints": ["Key point / product feature 1", "Key point 2", "Key point 3"],
  "importantTakeaways": ["Important takeaway 1", "Important takeaway 2"],
  "actionItems": ["Action item if any"]
}`,
    prompt: text,
  };
};

export const buildWebsiteAdvisorPrompt = (websiteContent) => {
  return {
    systemInstruction: `You are a Senior Web Accessibility (WCAG 2.1 AA/AAA) Solutions Architect. Audit the website content/structure and return a structured JSON object:
{
  "accessibilityScore": Number (0-100),
  "problems": ["Problem 1", "Problem 2"],
  "contrastSuggestions": ["Color contrast advice 1"],
  "missingAltTextSuggestions": ["Alt text suggestion 1"],
  "headingStructureSuggestions": ["Heading hierarchy advice 1"],
  "buttonLabelSuggestions": ["Button accessibility advice 1"],
  "ariaSuggestions": ["ARIA attribute advice 1"]
}`,
    prompt: websiteContent,
  };
};

export const buildReadingAssistantPrompt = (text, query) => {
  return {
    systemInstruction: `You are an accessibility reading assistant. Answer the user's question directly based ONLY on the provided reference document context. Keep answers clear, accessible, and structured.`,
    prompt: `[Reference Document Context]:\n${text}\n\n[User Question]: ${query}`,
  };
};

export const buildCopilotChatPrompt = (query, history = []) => {
  const historyText = history.length
    ? `[Prior Conversation History]:\n${history.map((m) => `${m.sender}: ${m.text}`).join('\n')}\n\n`
    : '';

  return {
    systemInstruction: `You are the ascess-1-ai Copilot—an expert AI assistant specializing in web accessibility, WCAG 2.1 standards, text simplification, translations, document summarization, and inclusive user interface design. Be helpful, concise, context-aware, and structured. Use Markdown formatting when appropriate.`,
    prompt: `${historyText}[User Message]: ${query}`,
  };
};
