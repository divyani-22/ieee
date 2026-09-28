import * as pdfjsLib from 'pdfjs-dist';
import { recognizeImage } from './ocr';

// Configure pdfjs worker
// Using standard unpkg/cdnjs worker fallback for Vite client-side bundle stability
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ExtractedPageResult {
  pageNumber: number;
  text: string;
  isScanned: boolean;
}

export interface PdfExtractionProgress {
  currentPage: number;
  totalPages: number;
  stage: 'parsing' | 'extracting' | 'ocr';
  scannedPagesCount: number;
}

/**
 * Extracts text from a PDF file. Automatically detects scanned or image-only pages,
 * rasterizes them to canvas, and performs Web Worker OCR via Tesseract.
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (progress: PdfExtractionProgress) => void
): Promise<{ text: string; pageCount: number; scannedCount: number; pages: ExtractedPageResult[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const pages: ExtractedPageResult[] = [];
  let scannedCount = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.({
      currentPage: pageNum,
      totalPages: numPages,
      stage: 'extracting',
      scannedPagesCount: scannedCount,
    });

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    let pageText = textContent.items
      .map((item: any) => item.str || '')
      .join(' ')
      .trim();

    // Scanned page detection threshold: less than 40 chars of text extracted
    const isNearEmpty = pageText.replace(/\s+/g, '').length < 40;

    if (isNearEmpty) {
      scannedCount++;
      onProgress?.({
        currentPage: pageNum,
        totalPages: numPages,
        stage: 'ocr',
        scannedPagesCount: scannedCount,
      });

      try {
        // Rasterize page to canvas for OCR
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better OCR accuracy
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Perform OCR on rasterized canvas
          const ocrText = await recognizeImage(canvas);
          if (ocrText.trim().length > pageText.length) {
            pageText = ocrText.trim();
          }
        }
      } catch (ocrErr) {
        console.warn(`OCR rasterization failed for page ${pageNum}:`, ocrErr);
      }
    }

    pages.push({
      pageNumber: pageNum,
      text: pageText,
      isScanned: isNearEmpty,
    });
  }

  const fullText = pages.map(p => `--- Page ${p.pageNumber} ---\n${p.text}`).join('\n\n');

  return {
    text: fullText,
    pageCount: numPages,
    scannedCount,
    pages,
  };
}
