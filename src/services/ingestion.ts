import { IngestionFileProgress } from '../types';
import { extractTextFromPdf } from './pdf';
import { recognizeImage } from './ocr';

/**
 * Normalizes and cleans raw extracted text:
 * - Fixes broken hyphenated words at linebreaks (e.g. "con- / tinues" -> "continues")
 * - Normalizes Unicode quotes, dashes, and extra whitespace
 * - Consolidates repetitive line breaks
 */
export function cleanExtractedText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2') // rejoin hyphenated words
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function processIngestionFile(
  file: File,
  onProgress: (update: Partial<IngestionFileProgress>) => void
): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = extension === 'pdf' || file.type === 'application/pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(extension) || file.type.startsWith('image/');
  const isText = ['txt', 'md', 'markdown', 'csv'].includes(extension) || file.type.startsWith('text/');

  if (isPdf) {
    onProgress({ status: 'extracting', progress: 10 });
    const result = await extractTextFromPdf(file, prog => {
      const pct = Math.min(90, Math.round((prog.currentPage / prog.totalPages) * 80) + 10);
      onProgress({
        status: prog.stage === 'ocr' ? 'ocr' : 'extracting',
        progress: pct,
        pageCount: prog.totalPages,
        scannedPagesDetected: prog.scannedPagesCount,
      });
    });

    onProgress({ status: 'cleaning', progress: 95 });
    const cleaned = cleanExtractedText(result.text);
    onProgress({
      status: 'done',
      progress: 100,
      extractedText: cleaned,
      pageCount: result.pageCount,
      scannedPagesDetected: result.scannedCount,
    });
    return cleaned;
  }

  if (isImage) {
    onProgress({ status: 'ocr', progress: 15 });
    const ocrText = await recognizeImage(file, (pct) => {
      onProgress({
        status: 'ocr',
        progress: Math.min(90, 15 + Math.round(pct * 0.75)),
      });
    });

    onProgress({ status: 'cleaning', progress: 95 });
    const cleaned = cleanExtractedText(ocrText);
    onProgress({
      status: 'done',
      progress: 100,
      extractedText: cleaned,
      pageCount: 1,
      scannedPagesDetected: 1,
    });
    return cleaned;
  }

  if (isText) {
    onProgress({ status: 'extracting', progress: 50 });
    const rawText = await file.text();
    onProgress({ status: 'cleaning', progress: 85 });
    const cleaned = cleanExtractedText(rawText);
    onProgress({
      status: 'done',
      progress: 100,
      extractedText: cleaned,
      pageCount: 1,
      scannedPagesDetected: 0,
    });
    return cleaned;
  }

  // Fallback as text
  const fallback = await file.text();
  const cleaned = cleanExtractedText(fallback);
  onProgress({ status: 'done', progress: 100, extractedText: cleaned });
  return cleaned;
}
