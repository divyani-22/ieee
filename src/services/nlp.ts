import { Card, CardDifficulty, CardType, GenerationConfig } from '../types';

// Common English stopwords to ignore during keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
  'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
  'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
  'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s',
  'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
  'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'also', 'often',
  'generally', 'typically', 'example', 'such', 'page', 'chapter', 'section', 'lecture'
]);

export interface TermFrequency {
  term: string;
  count: number;
  score: number;
  capitalizedCount: number;
  isMultiWord: boolean;
}

/**
 * Splits text into paragraphs or headings
 */
export function chunkText(text: string): string[] {
  const sections = text.split(/(?:\n\s*#{1,4}\s+|\n\s*---+\s*\n|\n\s*Page\s+\d+\s*\n|\n{2,})/gi);
  return sections
    .map(s => s.trim())
    .filter(s => s.length > 50);
}

/**
 * Splits text into clean sentences
 */
export function splitIntoSentences(text: string): string[] {
  // Regex to split on .!? followed by whitespace and capital letter or end of line, avoiding decimals like 3.14
  const rawSentences = text
    .replace(/([A-Z]\.)\s+/g, '$1__') // protect abbreviations like e.g., i.e.
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/g);

  return rawSentences
    .map(s => s.replace(/__/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(s => s.length >= 25 && s.length <= 350 && /[a-zA-Z]/.test(s));
}

/**
 * Extracts candidate key terms with TF-IDF / frequency heuristics
 */
export function extractKeyTerms(text: string): TermFrequency[] {
  const words = text.match(/\b[A-Za-z0-9_-]{3,}\b/g) || [];
  const freqMap: Map<string, { count: number; capitalized: number; original: string }> = new Map();

  for (const word of words) {
    const lower = word.toLowerCase();
    if (STOP_WORDS.has(lower) || /^\d+$/.test(lower)) continue;

    const isCap = /^[A-Z][a-z0-9]/.test(word);
    const existing = freqMap.get(lower) || { count: 0, capitalized: 0, original: word };
    existing.count++;
    if (isCap) existing.capitalized++;
    freqMap.set(lower, existing);
  }

  // Also extract candidate bigrams/trigrams (e.g. "mitochondrial matrix", "action potential")
  const multiWordRegex = /\b([A-Z][a-z]+(?:\s+[A-Za-z]+){1,2})\b/g;
  let match: RegExpExecArray | null;
  while ((match = multiWordRegex.exec(text)) !== null) {
    const phrase = match[1].trim();
    const lower = phrase.toLowerCase();
    const parts = lower.split(/\s+/);
    if (!parts.some(p => STOP_WORDS.has(p)) && parts.length > 1) {
      const existing = freqMap.get(lower) || { count: 0, capitalized: 2, original: phrase };
      existing.count += 2;
      existing.capitalized += 2;
      freqMap.set(lower, existing);
    }
  }

  const results: TermFrequency[] = [];
  for (const [lower, data] of freqMap.entries()) {
    // Score based on frequency + capitalization boost
    const capBoost = data.capitalized > 0 ? 1.5 : 1.0;
    const lengthBoost = Math.min(2.0, Math.max(1.0, lower.length / 5));
    const score = data.count * capBoost * lengthBoost;

    results.push({
      term: data.original,
      count: data.count,
      score,
      capitalizedCount: data.capitalized,
      isMultiWord: lower.includes(' '),
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Assesses readability and syntactic complexity for card difficulty
 */
function assessDifficulty(sentence: string, term: string): CardDifficulty {
  const words = sentence.split(/\s+/).length;
  const isComplex = words > 25 || term.length > 12 || /[,;]{2,}/.test(sentence);
  const isSimple = words < 14 && term.length < 8;
  if (isComplex) return 'hard';
  if (isSimple) return 'easy';
  return 'medium';
}

/**
 * Checks for duplicate questions
 */
function isDuplicateCard(question: string, existing: Omit<Card, 'id' | 'deckId'>[]): boolean {
  const normQ = question.toLowerCase().replace(/[^a-z0-9]/g, '');
  return existing.some(c => {
    const normExisting = c.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normQ === normExisting || (normQ.length > 20 && normExisting.includes(normQ));
  });
}

/**
 * Definition Pattern Matcher
 * Finds: "X is/are/refers to/is defined as Y", "X denotes Y", "X describes Y"
 */
export function extractDefinitions(sentences: string[]): Array<{ term: string; definition: string; sentence: string }> {
  const patterns = [
    /^([A-Z][a-zA-Z0-9\s-]{2,35}?)\s+(?:is defined as|refers to|denotes|is described as|signifies)\s+(.+)$/i,
    /^([A-Z][a-zA-Z0-9\s-]{2,35}?)\s+(?:is|are)\s+(?:an?|the)\s+(.+)$/i,
    /^([A-Z][a-zA-Z0-9\s-]{2,35}?):\s+(.+)$/i,
    /^(?:By|In|Under)\s+([A-Z][a-zA-Z0-9\s-]{2,30}?),\s+we\s+mean\s+(.+)$/i,
  ];

  const results: Array<{ term: string; definition: string; sentence: string }> = [];

  for (const sentence of sentences) {
    for (const pat of patterns) {
      const match = sentence.match(pat);
      if (match) {
        const term = match[1].trim();
        const definition = match[2].trim();
        if (
          term.length >= 3 &&
          term.length <= 40 &&
          !STOP_WORDS.has(term.toLowerCase()) &&
          definition.length >= 15
        ) {
          results.push({ term, definition, sentence });
          break;
        }
      }
    }
  }

  return results;
}

/**
 * Main On-Device Card Generation Pipeline
 */
export function generateCardsFromText(
  text: string,
  config: GenerationConfig = { density: 5, cardTypes: ['cloze', 'definition', 'mcq', 'true-false'], difficulty: 'all', useSmartMode: false }
): Omit<Card, 'id' | 'deckId'>[] {
  const chunks = chunkText(text);
  const allSentences = splitIntoSentences(text);
  const keyTerms = extractKeyTerms(text);
  const candidatePool = keyTerms.map(k => k.term).filter(t => t.length > 2);

  const generatedCards: Omit<Card, 'id' | 'deckId'>[] = [];
  const defaultDueDate = new Date().toISOString().slice(0, 10);

  // 1. Definition Cards
  if (config.cardTypes.includes('definition')) {
    const definitions = extractDefinitions(allSentences);
    for (const def of definitions) {
      const question = `What is ${def.term}?`;
      const answer = `${def.term} is ${def.definition}`;
      if (!isDuplicateCard(question, generatedCards)) {
        generatedCards.push({
          type: 'definition',
          question,
          answer,
          explanation: `Source concept: "${def.term}". Defined in context as: ${def.definition}`,
          sourceSentence: def.sentence,
          difficulty: assessDifficulty(def.sentence, def.term),
          repetitions: 0,
          interval: 0,
          easeFactor: 2.5,
          dueDate: defaultDueDate,
          starred: false,
        });
      }
    }
  }

  // 2. Cloze Deletion Cards
  if (config.cardTypes.includes('cloze')) {
    // Pick the most informative sentences containing top key terms
    for (const item of keyTerms.slice(0, Math.min(25, keyTerms.length))) {
      const termRegex = new RegExp(`\\b(${item.term})\\b`, 'i');
      const matchingSentence = allSentences.find(s => termRegex.test(s) && s.length > 35);
      if (matchingSentence) {
        const clozePrompt = matchingSentence.replace(termRegex, '{{...}}');
        const question = `Complete the statement:\n"${clozePrompt}"`;
        const answer = item.term;

        if (!isDuplicateCard(question, generatedCards)) {
          generatedCards.push({
            type: 'cloze',
            question,
            answer,
            explanation: `Original context: "${matchingSentence}"`,
            sourceSentence: matchingSentence,
            difficulty: assessDifficulty(matchingSentence, item.term),
            repetitions: 0,
            interval: 0,
            easeFactor: 2.5,
            dueDate: defaultDueDate,
            starred: false,
          });
        }
      }
    }
  }

  // 3. MCQ Cards with Semantic Distractors
  if (config.cardTypes.includes('mcq')) {
    for (let i = 0; i < Math.min(allSentences.length, 30); i++) {
      const sentence = allSentences[i];
      // Find candidate term in this sentence
      const foundTerm = candidatePool.find(term => {
        const reg = new RegExp(`\\b${term}\\b`, 'i');
        return reg.test(sentence);
      });

      if (foundTerm) {
        // Pick 3 distractors from candidatePool that are distinct from foundTerm
        const otherTerms = candidatePool.filter(t => t.toLowerCase() !== foundTerm.toLowerCase());
        if (otherTerms.length >= 3) {
          // Shuffle and pick 3 distractors
          const shuffled = [...otherTerms].sort(() => 0.5 - Math.random());
          const distractors = shuffled.slice(0, 3);
          const options = [foundTerm, ...distractors].sort(() => 0.5 - Math.random());

          const prompt = sentence.replace(new RegExp(`\\b${foundTerm}\\b`, 'i'), '__________');
          const question = `Which term correctly completes the following statement?\n"${prompt}"`;

          if (!isDuplicateCard(question, generatedCards)) {
            generatedCards.push({
              type: 'mcq',
              question,
              answer: foundTerm,
              options,
              explanation: `Correct term is "${foundTerm}". Full context: "${sentence}"`,
              sourceSentence: sentence,
              difficulty: assessDifficulty(sentence, foundTerm),
              repetitions: 0,
              interval: 0,
              easeFactor: 2.5,
              dueDate: defaultDueDate,
              starred: false,
            });
          }
        }
      }
    }
  }

  // 4. True/False Cards
  if (config.cardTypes.includes('true-false')) {
    for (let i = 0; i < Math.min(allSentences.length, 20); i++) {
      const sentence = allSentences[i];
      if (sentence.length < 40 || sentence.length > 200) continue;

      const isTrue = i % 2 === 0;
      let promptText = sentence;
      let explanation = `Statement is TRUE based on the lecture material: "${sentence}"`;

      if (!isTrue) {
        // Create plausible false alteration by swapping key term or negating
        const termToSwap = candidatePool.find(t => new RegExp(`\\b${t}\\b`, 'i').test(sentence));
        const alternateTerm = candidatePool.find(t => t !== termToSwap && Math.abs(t.length - (termToSwap?.length || 0)) < 6);

        if (termToSwap && alternateTerm) {
          promptText = sentence.replace(new RegExp(`\\b${termToSwap}\\b`, 'i'), alternateTerm);
          explanation = `Statement is FALSE. The correct term in context is "${termToSwap}" (not "${alternateTerm}"). Source: "${sentence}"`;
        } else if (/\bis\b/i.test(sentence) && !/\bnot\b/i.test(sentence)) {
          promptText = sentence.replace(/\bis\b/i, 'is NOT');
          explanation = `Statement is FALSE. The original fact states: "${sentence}"`;
        } else {
          continue;
        }
      }

      const question = `True or False?\n"${promptText}"`;
      const answer = isTrue ? 'True' : 'False';

      if (!isDuplicateCard(question, generatedCards)) {
        generatedCards.push({
          type: 'true-false',
          question,
          answer,
          options: ['True', 'False'],
          explanation,
          sourceSentence: sentence,
          difficulty: assessDifficulty(sentence, answer),
          repetitions: 0,
          interval: 0,
          easeFactor: 2.5,
          dueDate: defaultDueDate,
          starred: false,
        });
      }
    }
  }

  // Fallback: If no cards were generated from strict rules, create concept flashcards from available sentences
  if (generatedCards.length === 0 && allSentences.length > 0) {
    for (let i = 0; i < Math.min(allSentences.length, 10); i++) {
      const sent = allSentences[i];
      const words = sent.split(/\s+/).filter(Boolean);
      if (words.length >= 4) {
        const promptWord = words.slice(0, 3).join(' ');
        const question = `Key Concept: What information does the lecture give regarding "${promptWord}..."?`;
        const answer = sent;
        generatedCards.push({
          type: 'definition',
          question,
          answer,
          explanation: `Source sentence from lecture material: "${sent}"`,
          sourceSentence: sent,
          difficulty: assessDifficulty(sent, promptWord),
          repetitions: 0,
          interval: 0,
          easeFactor: 2.5,
          dueDate: defaultDueDate,
          starred: false,
        });
      }
    }
  }

  // Filter by difficulty if requested
  let filtered = generatedCards;
  if (config.difficulty !== 'all') {
    filtered = generatedCards.filter(c => c.difficulty === config.difficulty);
    // If filter is too aggressive, fallback to all
    if (filtered.length === 0) filtered = generatedCards;
  }

  // Limit density based on chunks count and config.density
  const targetCount = Math.max(5, Math.min(100, Math.round(chunks.length * config.density)));
  return filtered.slice(0, targetCount);
}
