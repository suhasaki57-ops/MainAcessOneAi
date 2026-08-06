import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import InputField from '../components/forms/InputField';
import { aiService } from '../services/aiService';
import { documentService } from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import { FiUploadCloud, FiFileText, FiX, FiCpu, FiCheckCircle, FiAlertTriangle, FiZap } from 'react-icons/fi';

export const UploadPage = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [pastedText, setPastedText] = useState('');
  const [pastedUrl, setPastedUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [result, setResult] = useState(null);
  const { addToast } = useNotification();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = async () => {
    setUploading(true);
    setResult(null);

    try {
      let extractedText = '';
      let confidence = 90;
      let confidenceRating = 'High';

      if (activeTab === 'file' && files.length > 0) {
        console.log('🔍 [FRONTEND DEBUG 1] Uploading file:', files[0]?.name, `${(files[0]?.size / 1024).toFixed(1)} KB`);

        setProcessingStage('1/4: Enhancing Image & Contrast (Sharp)...');
        await new Promise((r) => setTimeout(r, 400));

        setProcessingStage('2/4: Tesseract Neural OCR Extracting Text...');
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('title', files[0].name);

        const uploadRes = await documentService.uploadFile(formData);
        const uploadedDoc = uploadRes.data || uploadRes;
        extractedText = uploadedDoc.extractedText || uploadedDoc.cleanedText || files[0].name;
        confidence = uploadedDoc.confidence || 90;
        confidenceRating = uploadedDoc.confidenceRating || (confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low');

        console.log('🔍 [FRONTEND DEBUG 2] Backend OCR Result:', extractedText.slice(0, 150));
      } else if (activeTab === 'url' && pastedUrl.trim()) {
        setProcessingStage('1/4: Fetching Web Page Layout...');
        const urlRes = await documentService.processUrl(pastedUrl);
        const urlDoc = urlRes.data || urlRes;
        extractedText = urlDoc.extractedText || urlDoc.cleanedText || pastedUrl;
      } else if (pastedText.trim()) {
        extractedText = pastedText;
      } else {
        addToast({ message: 'Please attach a document or provide text/URL.', type: 'warning' });
        setUploading(false);
        return;
      }

      setProcessingStage('3/4: Sanitizing OCR Noise & Structuring Layout...');
      const ocrRes = await aiService.cleanOCR(extractedText);
      console.log('🔍 [FRONTEND DEBUG 3] Clean OCR Response:', ocrRes);

      setProcessingStage('4/4: Gemini AI Document Understanding & Summary...');
      const sumRes = await aiService.summarize(extractedText);
      console.log('🔍 [FRONTEND DEBUG 4] Gemini Summary Response:', sumRes);

      setResult({
        ocr: ocrRes.data || ocrRes,
        summary: sumRes.data || sumRes,
        confidence,
        confidenceRating,
      });

      addToast({ message: 'Document OCR and Gemini AI processing complete!', type: 'success' });
    } catch (err) {
      addToast({ message: err.message || 'AI processing failed.', type: 'error' });
    } finally {
      setUploading(false);
      setProcessingStage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Upload & OCR AI Engine</h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit documents, OCR image packets, or web links for automated sanitation, structuring, and summarization.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'file', label: 'File Upload (PDF / Image)' },
            { id: 'text', label: 'Paste Raw Text' },
            { id: 'url', label: 'Paste Web URL' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'file' && (
          <Card>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-cyan-500/10">
                <FiUploadCloud />
              </div>
              <h3 className="font-bold text-white text-base">Drag & Drop Your Document or Product Image</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Supports PDF, PNG, JPG, JPEG, WEBP, and TXT files up to 10MB.
              </p>

              <label className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-cyan-600/30 transition-all">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-6 flex flex-col gap-2 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-semibold text-slate-300">Attached File ({files.length})</h4>
                {files.map((file, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-cyan-400 text-base" />
                      <span className="font-medium text-white">{file.name}</span>
                      <span className="text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'text' && (
          <Card className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-300">Input Document Content</label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste raw text or product OCR description here..."
              className="w-full p-4 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 leading-relaxed"
            />
          </Card>
        )}

        {activeTab === 'url' && (
          <Card className="flex flex-col gap-3">
            <InputField
              label="Web Page Address"
              value={pastedUrl}
              onChange={(e) => setPastedUrl(e.target.value)}
              placeholder="https://example.com/article"
            />
          </Card>
        )}

        {/* Processing Stage Indicator */}
        {uploading && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3 animate-pulse">
            <FiZap className="text-cyan-400 text-lg" />
            <span className="text-xs font-semibold text-cyan-300">Processing Stage: {processingStage}</span>
          </div>
        )}

        <Button onClick={handleUploadSubmit} disabled={uploading} className="w-full py-3 flex items-center justify-center gap-2">
          <FiCpu /> {uploading ? 'Processing Document Engine...' : 'Process Document via Gemini AI'}
        </Button>

        {/* AI Processed Output Results */}
        {result && (
          <div className="flex flex-col gap-6 mt-4">
            {/* Confidence Header */}
            {result.confidence && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-300">OCR Extraction Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={result.confidenceRating === 'High' ? 'success' : result.confidenceRating === 'Medium' ? 'warning' : 'danger'}>
                    {result.confidenceRating} Confidence ({result.confidence}%)
                  </Badge>
                </div>
              </div>
            )}

            {result.confidenceRating === 'Low' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-300 text-xs font-semibold">
                <FiAlertTriangle className="text-base shrink-0" />
                <span>Notice: Low OCR confidence detected on source image. Image sharpening and AI cleaning applied.</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="flex flex-col gap-3 border border-cyan-500/20 bg-cyan-500/5">
                <h3 className="font-bold text-cyan-400 text-sm border-b border-slate-800 pb-2">Sanitized & Cleaned OCR Text</h3>
                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto pr-1 font-mono">
                  {result.ocr?.cleanedText || result.ocr?.summary}
                </div>
              </Card>

              <Card className="flex flex-col gap-3">
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">AI Generated Summary</h3>
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">{result.summary?.shortSummary}</p>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Key Topic Highlights:</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
                    {result.summary?.bulletPoints?.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
