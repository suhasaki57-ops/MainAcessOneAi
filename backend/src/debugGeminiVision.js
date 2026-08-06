import fs from 'fs';
import { getGeminiModel } from './ai/geminiClient.js';

async function testGeminiVisionOnFreedomOil() {
  const filePath = 'c:/Users/admin/OneDrive/Desktop/AcessOneAI/ascess-1-ai/backend/src/uploads/file-1785993503207-188219592.png';
  console.log(`🖼️ Testing Gemini Multimodal Vision API on uploaded file: ${filePath}\n`);

  const imageBuffer = fs.readFileSync(filePath);
  const base64Data = imageBuffer.toString('base64');

  const model = getGeminiModel('gemini-1.5-flash');

  const prompt = `You are a Senior Document & Product Label Intelligence Specialist. Analyze this uploaded image (Freedom Oil / product packaging / document). Extract all visible readable text, product specifications, brand name, nutritional info, and main details. Ignore background reflections or glare. Provide a clean summary and OCR extraction.`;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: 'image/png',
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    console.log('🤖 Gemini Vision Response:\n');
    console.log(response.text());
  } catch (err) {
    console.error('❌ Gemini Vision Error:', err.message);
  }
}

testGeminiVisionOnFreedomOil().catch(console.error);
