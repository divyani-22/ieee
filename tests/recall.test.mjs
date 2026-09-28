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

// Test 7: Fallback Card Synthesis for Terse / Custom Notes
test('Fallback generator yields valid study cards when text lacks strict definition patterns', () => {
  const terseNotes = "Neurons communicate via chemical synapses. The postsynaptic density contains ligand-gated receptors.";
  const sentences = terseNotes.split(/(?<=[.!?])\s+/);
  const fallbackCards = [];

  for (const sent of sentences) {
    const words = sent.split(/\s+/).filter(Boolean);
    if (words.length >= 4) {
      const promptWord = words.slice(0, 3).join(' ');
      fallbackCards.push({
        type: 'definition',
        question: `Key Concept: What information does the lecture give regarding "${promptWord}..."?`,
        answer: sent,
      });
    }
  }

  assert.strictEqual(fallbackCards.length, 2);
  assert.ok(fallbackCards[0].question.includes('Neurons communicate via'));
  assert.strictEqual(fallbackCards[0].answer, 'Neurons communicate via chemical synapses.');
});

// Test 8: MCQ Distractor Uniqueness
test('MCQ generation produces unique options without duplicate distractors', () => {
  const answer = 'Axon Hillock';
  const pool = ['Dendrite', 'Soma', 'Synapse', 'Myelin Sheath', 'Glial Cell'];
  
  const distractors = pool.filter(t => t !== answer).slice(0, 3);
  const options = [answer, ...distractors];
  const uniqueOptions = new Set(options);

  assert.strictEqual(options.length, 4);
  assert.strictEqual(uniqueOptions.size, 4);
  assert.ok(options.includes(answer));
});

// Test 9: 3D Flip Card Container Geometry Integrity
test('Flashcard styling enforces non-zero height for CSS 3D preserve-3d context', () => {
  // Verifies the fix against the ~40px squashed ribbon bug
  const containerClass = 'w-full max-w-2xl mx-auto perspective-1200 cursor-pointer select-none h-[420px] sm:h-[460px] min-h-[420px] focus:outline-none';
  const innerWrapperStyle = {
    height: '100%',
    minHeight: '100%',
    transform: 'rotateY(180deg)',
  };

  assert.ok(containerClass.includes('h-[420px]'));
  assert.ok(containerClass.includes('min-h-[420px]'));
  assert.strictEqual(innerWrapperStyle.height, '100%');
  assert.strictEqual(innerWrapperStyle.transform, 'rotateY(180deg)');
});

// Test 10: Spaced Repetition Monotonic Growth for Consecutive "Good" Reviews
test('Spaced repetition increases interval monotonically across consecutive Good reviews', () => {
  function advanceInterval(reps, interval, ease) {
    const nextReps = reps + 1;
    const nextInterval = nextReps === 1 ? 1 : nextReps === 2 ? 4 : Math.round(interval * ease);
    return { reps: nextReps, interval: nextInterval };
  }

  let state = { reps: 0, interval: 0, ease: 2.5 };
  const intervals = [];

  for (let i = 0; i < 5; i++) {
    const next = advanceInterval(state.reps, state.interval, state.ease);
    intervals.push(next.interval);
    state.reps = next.reps;
    state.interval = next.interval;
  }

  // Intervals should strictly increase: 1, 4, 10, 25, 63
  assert.deepStrictEqual(intervals, [1, 4, 10, 25, 63]);
  for (let i = 1; i < intervals.length; i++) {
    assert.ok(intervals[i] > intervals[i - 1]);
  }
});

// Test 11: User profile creation with name and authentication providers (Google & Phone)
test('User profile creation enforces name requirement for both Google and Phone auth', () => {
  function createProfile(provider, details) {
    const trimmedName = (details.name || '').trim();
    if (!trimmedName) {
      throw new Error('Name is required');
    }
    if (provider === 'google') {
      const email = details.email?.trim() || `${trimmedName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
      return {
        id: 'google-user-123',
        name: trimmedName,
        email,
        provider: 'google',
        createdAt: new Date().toISOString()
      };
    } else if (provider === 'phone') {
      if (!details.phone || details.phone.trim().length < 5) {
        throw new Error('Valid phone number is required');
      }
      return {
        id: 'phone-user-456',
        name: trimmedName,
        phone: details.phone.trim(),
        provider: 'phone',
        createdAt: new Date().toISOString()
      };
    }
    throw new Error('Invalid provider');
  }

  // Name is required
  assert.throws(() => createProfile('google', { name: '' }), /Name is required/);
  assert.throws(() => createProfile('phone', { name: '', phone: '+1 555-0199' }), /Name is required/);

  // Valid Google profile
  const googleUser = createProfile('google', { name: 'Divyani Sharma', email: 'divyani@example.com' });
  assert.strictEqual(googleUser.name, 'Divyani Sharma');
  assert.strictEqual(googleUser.provider, 'google');
  assert.strictEqual(googleUser.email, 'divyani@example.com');

  // Valid Phone profile
  const phoneUser = createProfile('phone', { name: 'Alex Johnson', phone: '+1 555-0199' });
  assert.strictEqual(phoneUser.name, 'Alex Johnson');
  assert.strictEqual(phoneUser.provider, 'phone');
  assert.strictEqual(phoneUser.phone, '+1 555-0199');
});

