import { createWorker } from 'tesseract.js';

let workerPromise: Promise<Tesseract.Worker> | null = null;

async function getWorker(onProgress?: (progress: number, status: string) => void): Promise<Tesseract.Worker> {
  const worker = await createWorker('eng', 1, {
    logger: m => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress(Math.round((m.progress || 0) * 100), m.status);
      }
    },
  });
  return worker;
}

export async function recognizeImage(
  imageSource: string | File | Blob | HTMLCanvasElement,
  onProgress?: (progress: number, status: string) => void
): Promise<string> {
  let worker: Tesseract.Worker | null = null;
  try {
    worker = await createWorker('eng', 1, {
      logger: m => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress(Math.round((m.progress || 0) * 100), m.status);
        }
      },
    });

    const ret = await worker.recognize(imageSource);
    await worker.terminate();
    return ret.data.text || '';
  } catch (error) {
    if (worker) {
      await worker.terminate().catch(() => {});
    }
    console.error('OCR recognition error:', error);
    throw new Error(`OCR failed: ${(error as Error).message}`);
  }
}
