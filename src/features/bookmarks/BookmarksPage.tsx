import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Layers,
  HelpCircle,
  Star
} from 'lucide-react';
import { Card, Deck } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import { CardTypeBadge, DifficultyBadge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';

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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header with Star Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-300/60 dark:border-amber-700/60 text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Star Feature • Concepts to Master</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <Bookmark className="w-7 h-7 text-amber-500 fill-amber-500" />
            My Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            All the concepts you marked as "I Don't Remember" during study sessions. Revise them until consolidated!
          </p>
        </div>

        {bookmarkedCards.length > 0 && (
          <Button
            size="lg"
            variant="primary"
            onClick={onReviewAll}
            className="shadow-lg shadow-indigo-500/25 shrink-0 bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600 hover:from-amber-600 hover:to-violet-700 border-amber-400/40 text-white font-bold"
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
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search through bookmarked questions, answers, or notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedDeckFilter}
            onChange={e =>
              setSelectedDeckFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3.5 py-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
        <EmptyState
          icon={<Bookmark className="w-8 h-8 text-amber-500" />}
          title="No Bookmarked Concepts Yet"
          description="Whenever you encounter a tough card during flashcard study, click 'I Don't Remember' or the Bookmark icon to automatically save it here for targeted revision."
          actionText="Study Flashcards"
          onAction={onNavigateToDecks}
        />
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-2xl border-zinc-300 dark:border-zinc-800 text-zinc-400 text-sm">
          No bookmarked concepts match your search.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold px-1">
            <span>{filteredCards.length} concept{filteredCards.length !== 1 ? 's' : ''} saved for revision</span>
            <span>Click "Review All" to study full deck</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredCards.map((card, idx) => {
              const parentDeck = deckMap.get(card.deckId);
              return (
                <GlassCard
                  key={card.id || idx}
                  className="p-5 sm:p-6 border border-amber-300/40 dark:border-amber-600/30 hover:border-amber-400 dark:hover:border-amber-500 transition-all shadow-sm group"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Topic & Metadata */}
                      <div className="flex flex-wrap items-center gap-2">
                        {parentDeck && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {parentDeck.title}
                          </span>
                        )}
                        <CardTypeBadge type={card.type} />
                        <DifficultyBadge difficulty={card.difficulty} />
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Bookmarked: {formatDate(card.bookmarkedAt)}
                        </span>
                      </div>

                      {/* Question */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500" />
                          Concept / Question
                        </div>
                        <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 whitespace-pre-line leading-relaxed">
                          {card.question}
                        </p>
                      </div>

                      {/* Answer */}
                      <div className="space-y-1 pt-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Answer / Explanation
                        </div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed">
                          {card.answer}
                        </p>
                      </div>

                      {/* Explanation note */}
                      {card.explanation && (
                        <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-850/80 border border-zinc-200/50 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <span className="font-bold text-indigo-500">Key Context: </span>
                          {card.explanation}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col items-center gap-2 self-end sm:self-start shrink-0">
                      <button
                        onClick={() => card.id && onRemoveBookmark(card.id)}
                        title="Remove bookmark (I've learned this concept!)"
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-800 text-zinc-600 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-400 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Bookmark</span>
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
