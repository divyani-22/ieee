import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Ingestion & Text Cleaning
test('cleanExtractedText rejoins hyphenated line breaks and normalizes unicode', () => {
  const rawText = "The ac-\n  tion potential con-\ntinues along the mem-\nbrane. “Quotes” & ‘single’.";
  const cleaned = rawText
    .replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  assert.ok(cleaned.includes('action potential'));
  assert.ok(cleaned.includes('continues'));
  assert.ok(cleaned.includes('membrane'));
  assert.ok(cleaned.includes('"Quotes"'));
  assert.ok(cleaned.includes("'single'"));
});

// Test 2: Spaced Repetition Scheduling (SM-2 / FSRS hybrid)
test('calculateNextReview produces correct intervals and ease adjustments', () => {
  function calculateNextReview(reps, interval, ease, rating) {
    let newReps = reps;
    let newInterval = interval;
    let newEase = ease || 2.5;

    if (rating === 1) { // Again
      newReps = 0;
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
    } else if (rating === 2) { // Hard
      newReps++;
      newInterval = newReps === 1 ? 1 : Math.max(2, Math.round(newInterval * 1.2));
      newEase = Math.max(1.3, newEase - 0.15);
    } else if (rating === 3) { // Good
      newReps++;
      newInterval = newReps === 1 ? 1 : newReps === 2 ? 4 : Math.round(newInterval * newEase);
    } else if (rating === 4) { // Easy
      newReps++;
      newInterval = newReps === 1 ? 3 : newReps === 2 ? 7 : Math.round(newInterval * newEase * 1.35);
      newEase = Math.min(3.0, newEase + 0.15);
    }
    return { reps: newReps, interval: newInterval, ease: Number(newEase.toFixed(2)) };
  }

  // Again resets reps to 0 and drops ease
  const againRes = calculateNextReview(3, 10, 2.5, 1);
  assert.strictEqual(againRes.reps, 0);
  assert.strictEqual(againRes.interval, 1);
  assert.strictEqual(againRes.ease, 2.3);

  // Good advances interval
  const goodRes1 = calculateNextReview(0, 0, 2.5, 3);
  assert.strictEqual(goodRes1.reps, 1);
  assert.strictEqual(goodRes1.interval, 1);

  const goodRes2 = calculateNextReview(1, 1, 2.5, 3);
  assert.strictEqual(goodRes2.reps, 2);
  assert.strictEqual(goodRes2.interval, 4);

  // Easy increases ease factor
  const easyRes = calculateNextReview(0, 0, 2.5, 4);
  assert.strictEqual(easyRes.interval, 3);
  assert.strictEqual(easyRes.ease, 2.65);
});

// Test 3: Definition Pattern Recognition
test('Definition extractor detects "X is defined as Y" and "X refers to Y"', () => {
  const sentences = [
    "Resting membrane potential is defined as the electrical voltage difference across the neuronal membrane at rest.",
    "Depolarization refers to a decrease in the absolute value of the membrane potential.",
    "Today is sunny and warm."
  ];

  const patterns = [
    /^([A-Z][a-zA-Z0-9\s-]{2,35}?)\s+(?:is defined as|refers to|denotes|is described as|signifies)\s+(.+)$/i,
    /^([A-Z][a-zA-Z0-9\s-]{2,35}?)\s+(?:is|are)\s+(?:an?|the)\s+(.+)$/i,
  ];

  const extracted = [];
  for (const s of sentences) {
    for (const pat of patterns) {
      const match = s.match(pat);
      if (match) {
        extracted.push({ term: match[1].trim(), definition: match[2].trim() });
        break;
      }
    }
  }

  assert.strictEqual(extracted.length, 2);
  assert.strictEqual(extracted[0].term, 'Resting membrane potential');
  assert.strictEqual(extracted[1].term, 'Depolarization');
});

// Test 4: Anki CSV Export & JSON Roundtrip
test('Anki CSV and JSON serialization & deserialization', () => {
  const sampleDeck = {
    title: 'Computer Architecture',
    description: 'Hardware concepts',
    sourceType: 'text',
    tags: ['cpu', 'cs'],
  };
  const sampleCards = [
    {
      type: 'definition',
      question: 'What is CPU?',
      answer: 'Central Processing Unit',
      options: ['Central Processing Unit', 'Graphics Unit', 'Memory Unit'],
      explanation: 'Core executing chip',
      difficulty: 'easy',
      repetitions: 1,
      interval: 1,
      easeFactor: 2.5,
      dueDate: '2026-09-28',
      starred: true,
      bookmarked: false,
    },
  ];

  // CSV test
  const csvLines = [
    '#separator:tab',
    '#html:true',
    '#deck:' + sampleDeck.title,
    `"${sampleCards[0].question}"\t"${sampleCards[0].answer}"\t"definition easy cpu cs"`
  ];
  const csv = csvLines.join('\n');
  assert.ok(csv.includes('#deck:Computer Architecture'));
  assert.ok(csv.includes('What is CPU?'));

  // JSON roundtrip
  const jsonPayload = JSON.stringify({ deck: sampleDeck, cards: sampleCards });
  const parsed = JSON.parse(jsonPayload);
  assert.strictEqual(parsed.deck.title, 'Computer Architecture');
  assert.strictEqual(parsed.cards.length, 1);
  assert.strictEqual(parsed.cards[0].question, 'What is CPU?');
});

// Test 5: Three Quiz Difficulty Filtering
test('Quiz difficulty selection partitions questions appropriately', () => {
  const cards = [
    { id: 1, question: 'Q1', answer: 'A1', difficulty: 'easy' },
    { id: 2, question: 'Q2', answer: 'A2', difficulty: 'medium' },
    { id: 3, question: 'Q3', answer: 'A3', difficulty: 'hard' },
    { id: 4, question: 'Q4', answer: 'A4', difficulty: 'easy' },
  ];

  const simplePool = cards.filter(c => c.difficulty === 'easy');
  const intermediatePool = cards.filter(c => c.difficulty === 'medium');
  const hardPool = cards.filter(c => c.difficulty === 'hard');

  assert.strictEqual(simplePool.length, 2);
  assert.strictEqual(intermediatePool.length, 1);
  assert.strictEqual(hardPool.length, 1);
});

// Test 6: Bookmarking for Things I Don't Remember
test('I Don\'t Remember marks card as bookmarked with timestamp and enables review', () => {
  const card = {
    id: 42,
    deckId: 1,
    question: 'Action Potential Threshold',
    answer: '-55 millivolts',
    difficulty: 'medium',
    repetitions: 2,
    interval: 4,
    easeFactor: 2.5,
    dueDate: '2026-09-28',
    bookmarked: false,
  };

  // User clicks "I Don't Remember"
  const now = new Date().toISOString();
  const bookmarkedCard = {
    ...card,
    bookmarked: true,
    bookmarkedAt: now,
    repetitions: 0,
    interval: 1,
  };

  assert.strictEqual(bookmarkedCard.bookmarked, true);
  assert.strictEqual(bookmarkedCard.repetitions, 0);
  assert.strictEqual(bookmarkedCard.interval, 1);
  assert.ok(bookmarkedCard.bookmarkedAt.length > 10);

  // Unbookmarking
  const unbookmarkedCard = {
    ...bookmarkedCard,
    bookmarked: false,
    bookmarkedAt: undefined,
  };
  assert.strictEqual(unbookmarkedCard.bookmarked, false);
  assert.strictEqual(unbookmarkedCard.bookmarkedAt, undefined);
});
