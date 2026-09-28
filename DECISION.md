# Architecture & Scout Decision: Recall

## 1. Scout Evaluation Summary
During the Step 0 repository scout, we researched existing open-source web applications that generate flashcards and quizzes from lecture notes/PDFs (such as *Flashcard-Study-App*, *Study Genie*, *Get-it*, and *Cardflash*).

### Findings:
1. **Cloud & API Dependencies**: Most existing open-source solutions rely on external cloud backends (Firebase, Supabase, Puter.js) or require third-party LLM API keys (OpenAI GPT-4, Google Gemini API, Claude). This directly contradicts our strict constraint: **100% client-side, zero backend, NO API keys, and fully functional offline**.
2. **Missing In-Browser OCR & Hybrid PDF Processing**: Existing templates either only extract simple text using standard PDF readers (failing on scanned documents and handwritten images) or offload OCR to remote microservices. None seamlessly combine `pdfjs-dist` text stream extraction with automatic low-yield fallback to rasterization + `tesseract.js` Web Worker OCR.
3. **Rigid or Simplistic NLP Pipelines**: Few projects feature an autonomous on-device NLP engine capable of syntactic cloze generation, definition pattern extraction ("X is defined as Y"), contextual distractor-sampled MCQs, and altered-premise True/False synthesis completely in-browser without server roundtrips.
4. **Outdated Tech Stacks & Incomplete Spaced Repetition**: Many candidate projects were either abandoned prototypes, lacking modern design languages (shadcn/ui, glassmorphism, Framer Motion 3D transforms), or had stubbed spaced repetition schedulers lacking Anki-grade compatibility.

## 2. Decision: Bespoke High-Performance Architecture
**We decided to build Recall from the ground up**, curating well-maintained, battle-tested modular client-side libraries rather than forking a monolithic or API-dependent repo.

### Selected Library Ecosystem:
- **Build & Framework**: Vite 5 + React 18 + TypeScript
- **Styling & Motion**: Tailwind CSS + Lucide Icons + Framer Motion (3D flip physics, fluid transitions, glassmorphic dark/light aesthetics inspired by Linear and Arc)
- **Offline Storage**: Dexie.js (IndexedDB wrapper with ACID compliance, reactive queries, and lightning-fast local persistence)
- **Document Ingestion & OCR**:
  - `pdfjs-dist`: High-performance vector and digital PDF text stream parsing.
  - `tesseract.js`: WebAssembly OCR running in dedicated Web Workers for scanned PDFs, phone camera photos, and lecture slides.
- **Spaced Repetition Scheduler**:
  - Custom enhanced SM-2 / FSRS-inspired scheduling engine with four standard ratings: `Again` (1), `Hard` (2), `Good` (3), `Easy` (4), interval calculations, ease factors, streak tracking, and due queue management.
- **On-Device NLP Engine**:
  - Fast syntactic chunker, token-ranker (TF-IDF keyword heuristics), pattern matcher for definitions (`is / are / refers to / denotes`), Cloze deletion synthesizer, and contextual distractor generator.
- **Optional Local LLM (WebLLM)**:
  - Integration interface for `@mlc-ai/web-llm` with WebGPU detection, progress bar model weights streaming, and zero-overhead fallback to the local NLP engine.
- **Interoperability**:
  - Native Anki-compatible CSV export/import and rich JSON deck backup/restore.

This guarantees a production-ready, ultra-fast, zero-telemetry, zero-cost study companion.
