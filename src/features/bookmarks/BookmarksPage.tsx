import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Trash2,
  RotateCw,
  Layers
} from 'lucide-react';
import { Card, Deck } from '../../types';
import { Button } from '../../components/Button';
import { CardTypeBadge } from '../../components/Badge';

export interface BookmarksPageProps {
  bookmarkedCards: Card[];
  decks: Deck[];
  onRemoveBookmark: (cardId: number) => Promise<void>;
  onReviewAll: () => void;
  onNavigateToDecks: () => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  bookmarkedCards,
  decks,
  onRemoveBookmark,
  onReviewAll,
  onNavigateToDecks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeckFilter, setSelectedDeckFilter] = useState<number | 'all'>('all');
  const [revealedCardId, setRevealedCardId] = useState<number | null>(null);

  const deckMap = React.useMemo(() => {
    const map = new Map<number, Deck>();
    decks.forEach(d => {
      if (d.id) map.set(d.id, d);
    });
    return map;
  }, [decks]);

  const filteredCards = bookmarkedCards.filter(card => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.explanation && card.explanation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDeck = selectedDeckFilter === 'all' || card.deckId === selectedDeckFilter;
    return matchesSearch && matchesDeck;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-xs font-bold text-coral mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-coral" />
            <span>Targeted Revision Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-navy dark:text-white flex items-center gap-3">
            My Bookmarks
          </h1>
          <p className="text-sm font-semibold text-navy/60 dark:text-lightBlue-200 mt-1">
            Concepts you marked as "I Don't Remember" during study sessions.
          </p>
        </div>

        {bookmarkedCards.length > 0 && (
          <Button
            size="lg"
            variant="coral"
            onClick={onReviewAll}
            className="shadow-coral-soft font-black text-sm px-6 py-3.5 shrink-0"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Review All ({bookmarkedCards.length})
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      {bookmarkedCards.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 dark:text-lightBlue-200" />
            <input
              type="text"
              placeholder="Search through bookmarked questions or answers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 text-sm font-bold text-navy dark:text-white placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-coral shadow-soft"
            />
          </div>

          <select
            value={selectedDeckFilter}
            onChange={e =>
              setSelectedDeckFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-4 py-3 rounded-2xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 text-xs font-bold text-navy dark:text-lightBlue-100 focus:outline-none focus:ring-2 focus:ring-coral shadow-soft cursor-pointer"
          >
            <option value="all">All Topics ({bookmarkedCards.length})</option>
            {decks.map(d => {
              const count = bookmarkedCards.filter(c => c.deckId === d.id).length;
              if (count === 0) return null;
              return (
                <option key={d.id} value={d.id}>
                  {d.title} ({count})
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Bookmarks List */}
      {bookmarkedCards.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-4xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 text-center space-y-4 shadow-soft">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-coral-50 flex items-center justify-center text-coral shadow-soft">
            <Bookmark className="w-8 h-8 fill-coral" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-navy dark:text-white">
              No concepts bookmarked yet.
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-navy/60 dark:text-lightBlue-200 max-w-md mx-auto">
              Cards you mark as "I Don't Remember" will appear here for targeted revision.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={onNavigateToDecks} className="font-bold">
              Study Flashcards Now
            </Button>
          </div>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-3xl border border-dashed border-lightBlue-200 text-navy/60 text-sm font-bold">
          No bookmarked concepts match your search.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-navy/50 dark:text-lightBlue-200 px-2">
            <span>{filteredCards.length} concept{filteredCards.length !== 1 ? 's' : ''} saved for revision</span>
            <span>Click "Review All" to study full deck in 3D</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredCards.map((card, idx) => {
              const parentDeck = deckMap.get(card.deckId);
              const isRevealed = revealedCardId === card.id;

              return (
                <div
                  key={card.id || idx}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 hover:border-lightBlue-200 shadow-soft hover:shadow-soft-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Topic & Date Added */}
                      <div className="flex flex-wrap items-center gap-2">
                        {parentDeck && (
                          <span className="text-[11px] font-black px-3 py-1 rounded-full bg-lightBlue-100 text-navy dark:bg-navy-700 dark:text-lightBlue-200 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-coral" />
                            {parentDeck.title}
                          </span>
                        )}
                        <CardTypeBadge type={card.type} />
                        <span className="text-[11px] font-semibold text-navy/50 dark:text-lightBlue-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Date Added: {formatDate(card.bookmarkedAt)}
                        </span>
                      </div>

                      {/* Question */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-black uppercase tracking-wider text-coral">
                          Question / Concept
                        </div>
                        <p className="text-base font-extrabold text-navy dark:text-white whitespace-pre-line leading-relaxed">
                          {card.question}
                        </p>
                      </div>

                      {/* Answer */}
                      <div className="space-y-1 pt-1">
                        <div className="text-[11px] font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200 flex items-center justify-between">
                          <span>Answer</span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedCardId(card.id || null)}
                              className="text-[11px] font-bold text-coral hover:underline"
                            >
                              Reveal Answer
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <div className="p-3.5 rounded-2xl bg-pageBg dark:bg-navy-900 border border-lightBlue-100 dark:border-navy-700 space-y-1 animate-fade-in">
                            <p className="text-sm font-bold text-navy dark:text-white whitespace-pre-line leading-relaxed">
                              {card.answer}
                            </p>
                            {card.explanation && (
                              <p className="text-xs text-navy/60 dark:text-lightBlue-200 italic pt-1 border-t border-lightBlue-200/40">
                                {card.explanation}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-navy/40 italic">
                            (Hidden for active recall test — tap "Reveal Answer" or "Review" to test yourself)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions: Review & Remove Bookmark */}
                    <div className="flex sm:flex-col items-center gap-2 self-end sm:self-start shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setRevealedCardId(prev => (prev === card.id ? null : card.id || null));
                        }}
                        className="text-xs font-bold"
                      >
                        <RotateCw className="w-3.5 h-3.5 mr-1" />
                        {isRevealed ? 'Hide' : 'Review'}
                      </Button>

                      <button
                        onClick={() => card.id && onRemoveBookmark(card.id)}
                        title="Remove Bookmark"
                        className="px-3 py-1.5 rounded-2xl bg-coral-50 hover:bg-coral-100 text-coral-700 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Bookmark</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
