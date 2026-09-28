import { Card, Deck } from '../types';

/**
 * Generates an Anki-compatible CSV string.
 * Format: "Front"\t"Back"\t"Tags"
 */
export function exportDeckToAnkiCsv(deck: Deck, cards: Card[]): string {
  const lines: string[] = [
    '#separator:tab',
    '#html:true',
    '#deck:' + deck.title.replace(/\t|\n/g, ' '),
    '#tags column:3',
  ];

  for (const card of cards) {
    let front = card.question;
    let back = card.answer;

    if (card.options && card.options.length > 0) {
      front += '<br><br><b>Options:</b><br>' + card.options.map(opt => `• ${opt}`).join('<br>');
    }

    if (card.explanation) {
      back += `<br><br><small><i>Explanation: ${card.explanation}</i></small>`;
    }

    // Escape tabs and format newlines as <br>
    const safeFront = front.replace(/\t/g, '    ').replace(/\n/g, '<br>');
    const safeBack = back.replace(/\t/g, '    ').replace(/\n/g, '<br>');
    const tags = [card.type, card.difficulty, ...(deck.tags || [])].join(' ');

    lines.push(`"${safeFront}"\t"${safeBack}"\t"${tags}"`);
  }

  return lines.join('\n');
}

/**
 * Generates full JSON backup of a deck with all cards and metadata
 */
export function exportDeckToJson(deck: Deck, cards: Card[]): string {
  const payload = {
    recallVersion: '1.0',
    exportedAt: new Date().toISOString(),
    deck: {
      title: deck.title,
      description: deck.description,
      sourceType: deck.sourceType,
      tags: deck.tags,
      color: deck.color,
    },
    cards: cards.map(c => ({
      type: c.type,
      question: c.question,
      answer: c.answer,
      options: c.options,
      explanation: c.explanation,
      sourceSentence: c.sourceSentence,
      difficulty: c.difficulty,
      starred: c.starred,
      repetitions: c.repetitions,
      interval: c.interval,
      easeFactor: c.easeFactor,
      dueDate: c.dueDate,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Triggers browser download of a generated string
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses an imported JSON or CSV file
 */
export function parseImportedDeck(
  fileContent: string,
  filename: string
): { deck: Omit<Deck, 'id' | 'totalCards' | 'createdAt' | 'updatedAt'>; cards: Omit<Card, 'id' | 'deckId'>[] } {
  // Try JSON first
  try {
    const json = JSON.parse(fileContent);
    if (json.deck && Array.isArray(json.cards)) {
      return {
        deck: {
          title: json.deck.title || filename.replace(/\.[^/.]+$/, ''),
          description: json.deck.description || 'Imported deck',
          sourceType: 'manual',
          tags: json.deck.tags || ['imported'],
          color: json.deck.color || 'from-indigo-500 to-purple-600',
        },
        cards: json.cards.map((c: any) => ({
          type: c.type || 'definition',
          question: c.question || '',
          answer: c.answer || '',
          options: c.options,
          explanation: c.explanation,
          sourceSentence: c.sourceSentence,
          difficulty: c.difficulty || 'medium',
          starred: !!c.starred,
          repetitions: c.repetitions || 0,
          interval: c.interval || 0,
          easeFactor: c.easeFactor || 2.5,
          dueDate: c.dueDate || new Date().toISOString().slice(0, 10),
        })),
      };
    }
  } catch (e) {
    // Not valid JSON, proceed to CSV parsing
  }

  // Parse CSV (tab or comma separated)
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));
  const cards: Omit<Card, 'id' | 'deckId'>[] = [];
  const defaultDueDate = new Date().toISOString().slice(0, 10);

  for (const line of lines) {
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    if (parts.length >= 2) {
      const front = parts[0].replace(/^["']|["']$/g, '').replace(/<br\s*\/?>/gi, '\n').trim();
      const back = parts[1].replace(/^["']|["']$/g, '').replace(/<br\s*\/?>/gi, '\n').trim();

      if (front && back) {
        cards.push({
          type: 'definition',
          question: front,
          answer: back,
          difficulty: 'medium',
          repetitions: 0,
          interval: 0,
          easeFactor: 2.5,
          dueDate: defaultDueDate,
          starred: false,
        });
      }
    }
  }

  return {
    deck: {
      title: filename.replace(/\.[^/.]+$/, ''),
      description: `Imported from ${filename}`,
      sourceType: 'manual',
      tags: ['imported'],
      color: 'from-blue-500 to-cyan-500',
    },
    cards,
  };
}
