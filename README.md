# Recall 🧠 — Intelligent Client-Side Study & Mastery App

> **Turn any lecture material into interactive flashcards and quizzes — 100% in-browser, offline-first, zero backend, NO API KEYS.**

Recall is a high-performance, privacy-first study companion designed with the aesthetic polish of Linear and Arc. It takes digital PDFs, scanned documents, camera photos of lecture slides/notes, or raw text, and generates four types of high-retention study cards using an autonomous, on-device NLP synthesis pipeline.

---

## 🚀 Key Highlights & Architecture

- **100% Client-Side & Private**: Zero data leaves your browser. No accounts, no telemetry, no monthly API fees.
- **Smart Document Ingestion & Hybrid OCR**:
  - `pdfjs-dist` for direct text parsing from digital lecture PDFs.
  - Automatic scanned page detector: when text yields fall below readability thresholds, the page is rasterized to an offscreen canvas and processed via `Tesseract.js` in a dedicated Web Worker.
  - Multi-file drag-and-drop supporting PDF, PNG/JPG/WebP, TXT, and Markdown.
  - Document pre-cleaning (un-hyphenating line breaks, stripping Unicode artifacts).
  - Built-in previewer allowing manual edits and word-count inspection before synthesis.
- **API-Free On-Device NLP Generation Pipeline**:
  1. **Definition Synthesis**: Automatic regex and syntactic patterns detection (`X is defined as Y`, `X refers to Y`, `X denotes Y`).
  2. **Syntactic Cloze Deletions**: Identifies top TF-IDF keywords and contextual entities to construct cloze prompts (`{{...}}`).
  3. **4-Choice Multiple Choice Questions (MCQs)**: Blanks out central concepts and draws plausible, non-repeating distractors from other key terms of the same semantic type within the document.
  4. **True/False Statements**: Analyzes factual statements and crafts subtle negative or term-swapped counter-factuals with full citations to the source fact.
  5. **Tuning Controls**: Density slider (cards per section), difficulty selector (Easy, Medium, Hard), and card type toggles.
- **Optional "Smart Mode" (WebGPU In-Browser LLM)**:
  - Supports client-side WebGPU acceleration with progressive loading and automatic, zero-overhead fallback to the local NLP engine if WebGPU is unavailable.
- **Spaced Repetition Flashcards**:
  - Enhanced SM-2 / FSRS scheduling with four response tiers: `Again` (1), `Hard` (2), `Good` (3), `Easy` (4).
  - Smooth 3D flip card physics powered by Framer Motion.
  - Full keyboard shortcuts: `Space` / `Enter` to flip, `1`-`4` for rapid ratings.
  - Streak tracking, due-today queues, and celebratory particle animations (`canvas-confetti`).
- **Targeted 10-Question Quizzes**:
  - Timed or untimed multi-format quiz sessions with instant feedback.
  - Detailed explanation modal citing the exact sentence from the lecture document.
  - "Retry Mistakes" option to immediately drill missed concepts.
- **Card & Deck Management**:
  - Full IndexedDB offline persistence via `Dexie.js`.
  - Anki-compatible CSV export/import (Front, Back, Tags).
  - Full JSON backup export/restore.
  - Manual card addition, card editing, starring, and deletion.

---

## 🛠 Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework & Language | React 18, TypeScript, Vite 5 |
| Styling & Theming | Tailwind CSS, Lucide Icons, Glassmorphic tokens, Dark/Light mode |
| Animations & 3D | Framer Motion, canvas-confetti |
| Local Database | Dexie.js (IndexedDB wrapper) & `dexie-react-hooks` |
| PDF & OCR | `pdfjs-dist`, `tesseract.js` (WebAssembly & Web Worker) |
| Scheduling Algorithm | SuperMemo-2 / FSRS hybrid spaced repetition |
| Card NLP Engine | Heuristic keyword frequency, phrase chunker, and definition patterns |

---

## 📦 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher, tested on v24.15.0)
- npm (v9 or higher)

### Installation & Run

1. Clone or navigate into the project directory:
   ```bash
   cd recall
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in `dist/`.

---

## 🚢 Deploying to Vercel (Static Single Page App)

Recall is 100% static and requires zero backend server functions. It can be deployed to Vercel with a single click or command:

### Option A: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
Select default settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Option B: Via Vercel Dashboard & GitHub
1. Push your repository to GitHub.
2. In the Vercel Dashboard, click **Add New > Project** and import the repository.
3. Configure the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Since no environment variables or API keys are required, deployment takes under 60 seconds!

---

## 🧪 Testing with Sample Files

Recall includes sample lecture materials directly in `/samples` and pre-wired one-click quick test buttons on the upload screen:
- `samples/lecture-neuroscience.txt`: Foundations of Cellular Neuroscience & Action Potentials
- `samples/cellular-biology.md`: Cellular Energetics, ATP Synthesis, and Molecular Genetics
- `samples/sample-lecture.pdf`: Valid test PDF on Computer Architecture principles

---

## ⚖️ License
MIT License. Free to use, inspect, fork, and distribute.
