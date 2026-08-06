import { createWorker } from 'tesseract.js';
import fs from 'fs';

async function testRawVsPreprocessed() {
  const filePath = 'c:/Users/admin/OneDrive/Desktop/AcessOneAI/ascess-1-ai/backend/src/uploads/file-1785993503207-188219592.png';
  console.log(`🖼️ Testing Raw Image OCR on: ${filePath}\n`);

  const worker = await createWorker('eng');

  console.log('1. Testing RAW File OCR...');
  const retRaw = await worker.recognize(filePath);
  console.log(`Raw File OCR Text Length: ${retRaw.data.text.length} chars`);
  console.log('--- Raw Extracted Text Output ---');
  console.log(retRaw.data.text);
  console.log('---------------------------------');

  await worker.terminate();
}

testRawVsPreprocessed().catch(console.error);
