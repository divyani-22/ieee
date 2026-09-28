# Recall Study App: End-to-End Audit & Test Log

**Branch:** `fix/e2e-audit`  
**Host Platform:** Client-side SPA (Vite + React + TypeScript + Tailwind + Framer Motion)  
**Database:** Dexie IndexedDB (Local on-device)  
**AI / OCR Engine:** Zero-backend client-side (pdfjs-dist + Tesseract.js Web Worker + Local NLP / WebGPU)

---

## Detailed Test Matrix

| # | Item | Expected Behavior | Actual Behavior Before Fix | Status | Fix Commit |
|---|---|---|---|---|---|
| 1 | **Flashcard Answer & Definition Display** | Card maintains full vertical height (420px+) on both front & back; answer and definitions clearly visible without squashing | Card container collapsed vertically to ~40px ribbon due to missing explicit height on 3D perspective wrapper; definitions hidden | ✅ PASS | `bf055da` |
| 2 | **Keyboard Controls & Shortcuts (A11y)** | Physical keyboard keys `Space`/`Enter` flip card, `D` marks "I Don't Remember", `R` marks "I Remembered", `B` toggles bookmark, `1`-`4` trigger SM-2 ratings | `D`, `R`, and `B` shortcuts were advertised in modal but missing from active keyboard listener | ✅ PASS | `fix(study)` |
| 3 | **Route & Deck View Empty States** | Entering Quiz or Deck-Detail without an active deck gracefully presents actionable EmptyState | Rendered blank empty container if activeDeck was null | ✅ PASS | `fix(app)` |
| 4 | **Fallback Synthesis for Terse / Custom Notes** | Custom lecture notes without strict "is defined as" patterns synthesize valid concept flashcards | Text without pattern matches returned 0 cards and prompted user to re-upload | ✅ PASS | `fix(nlp)` |
| 5 | **SM-2 Spaced Repetition Scheduling** | Consecutive "Good" reviews increase review interval monotonically (1d -> 4d -> 10d -> 25d -> 63d); "Again" resets to 1d | Verified mathematical correctness in `tests/recall.test.mjs` Test 2 & 10 | ✅ PASS | Verified |
| 6 | **Three Quiz Difficulty Levels** | User can choose Simple (beginner), Intermediate (moderate), or Hard (challenging) with distinct card pools and scoring | Verified difficulty level partitioning and instant evaluation | ✅ PASS | Verified |
| 7 | **"I Don't Remember" Auto-Bookmarking** | Clicking "I Don't Remember" saves card to My Bookmarks with timestamp and schedules for immediate reinforcement | Auto-bookmarking verified and tested in both unit tests and UI flow | ✅ PASS | Verified |
| 8 | **Document Ingestion & OCR Rasterization** | Text PDFs extract via pdfjs-dist; scanned pages rasterize to canvas and run Tesseract Web Worker OCR | Ingestion handles PDF, images, TXT, and Markdown with progress reporting | ✅ PASS | Verified |
| 9 | **Anki CSV & JSON Export / Import** | Decks export to standard Anki TSV format with tags/HTML, and JSON roundtrips all metadata without data loss | Verified in Test 4 of test suite | ✅ PASS | Verified |
| 10 | **Color Contrast & Theme Modes** | Dark and Light themes maintain AA contrast ratios for cream graph-paper tactile flashcards and UI glass cards | High contrast border and font classes with auto-scaling text | ✅ PASS | Verified |

---

## Regression Verification
- **Automated Tests:** 10/10 passed across 3 consecutive runs (`node --test tests/recall.test.mjs`)
- **Bundle Build:** Clean production build with Vite code-splitting into vendor chunks (zero errors)
- **Zero API Keys:** Completely offline and private on-device execution
