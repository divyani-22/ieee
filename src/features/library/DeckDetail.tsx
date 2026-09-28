import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Plus,
  Star,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  LayoutGrid,
  CreditCard
} from 'lucide-react';
import { Deck, Card, CardType, CardDifficulty } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import { CardTypeBadge, DifficultyBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Flashcard } from '../../components/Flashcard';
import { exportDeckToAnkiCsv, exportDeckToJson, downloadFile } from '../../services/ankiExport';
import { formatInterval } from '../../services/spacedRepetition';

export interface DeckDetailProps {
  deck: Deck;
  cards: Card[];
  onBack: () => void;
  onStudy: () => void;
  onQuiz: () => void;
  onUpdateCard: (card: Card) => Promise<void>;
  onDeleteCard: (cardId: number) => Promise<void>;
  onAddCard: (card: Omit<Card, 'id' | 'deckId'>) => Promise<void>;
}

export const DeckDetail: React.FC<DeckDetailProps> = ({
  deck,
  cards,
  onBack,
  onStudy,
  onQuiz,
  onUpdateCard,
  onDeleteCard,
  onAddCard,
}) => {
  const [deckViewMode, setDeckViewMode] = useState<'flip' | 'list'>('flip');
  const [activeFlipIndex, setActiveFlipIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);

  // New card form state
  const [newType, setNewType] = useState<CardType>('definition');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<CardDifficulty>('medium');

  const filteredCards = cards.filter(c => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'starred') return c.starred;
    return c.type === typeFilter;
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const dueCardsCount = cards.filter(c => c.dueDate <= todayStr).length;

  const handleToggleStar = async (card: Card) => {
    await onUpdateCard({
      ...card,
      starred: !card.starred,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;
    await onUpdateCard(editingCard);
    setEditingCard(null);
  };

  const handleCreateNewCard = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    await onAddCard({
      type: newType,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      explanation: newExplanation.trim() || undefined,
      difficulty: newDifficulty,
      repetitions: 0,
      interval: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().slice(0, 10),
      starred: false,
    });

    setIsNewCardModalOpen(false);
    setNewQuestion('');
    setNewAnswer('');
    setNewExplanation('');
  };

  const handleExportCsv = () => {
    const csv = exportDeckToAnkiCsv(deck, cards);
    downloadFile(csv, `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_anki.csv`, 'text/csv');
  };

  const handleExportJson = () => {
    const json = exportDeckToJson(deck, cards);
    downloadFile(json, `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_recall.json`, 'application/json');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Back button and top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleExportCsv} className="text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
            Anki CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportJson} className="text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            JSON
          </Button>
          <Button size="sm" variant="primary" onClick={() => setIsNewCardModalOpen(true)} className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Hero Deck Card */}
      <GlassCard elevated className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                {deck.sourceType}
              </span>
              <span className="text-xs text-zinc-400">
                Created {new Date(deck.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              {deck.title}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
              {deck.description || 'Master lecture concepts through spaced repetition flashcards and targeted quizzes.'}
            </p>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <Button size="md" variant="primary" onClick={onStudy} className="w-full shadow-md shadow-indigo-500/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Study Due ({dueCardsCount})
            </Button>
            <Button size="md" variant="secondary" onClick={onQuiz} className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800">
            <div className="text-xs text-zinc-400">Total Cards</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-white">{cards.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800">
            <div className="text-xs text-zinc-400">Due for Review</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{dueCardsCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800">
            <div className="text-xs text-zinc-400">Mastered (Rep &ge; 3)</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {cards.filter(c => c.repetitions >= 3).length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800">
            <div className="text-xs text-zinc-400">Starred Cards</div>
            <div className="text-lg font-bold text-amber-500">
              {cards.filter(c => c.starred).length}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* View Switcher & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
          <button
            onClick={() => {
              setDeckViewMode('flip');
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              deckViewMode === 'flip'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            3D Flipcards View
          </button>
          <button
            onClick={() => setDeckViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              deckViewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Card List ({cards.length})
          </button>
        </div>

        {deckViewMode === 'list' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'all', label: `All (${cards.length})` },
              { id: 'definition', label: 'Definitions' },
              { id: 'cloze', label: 'Cloze' },
              { id: 'mcq', label: 'MCQs' },
              { id: 'true-false', label: 'True/False' },
              { id: 'starred', label: `★ Starred (${cards.filter(c => c.starred).length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  typeFilter === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700/60 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode 1: Interactive 3D Flipcard Carousel */}
      {deckViewMode === 'flip' && (
        <div className="space-y-4 pt-2">
          {cards.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-2xl border-zinc-300 dark:border-zinc-800 text-zinc-400 text-sm">
              No flashcards in this deck yet.
            </div>
          ) : (
            <div className="space-y-4">
              <Flashcard
                card={cards[activeFlipIndex % cards.length]}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(prev => !prev)}
                onToggleBookmark={async (c, nextState) => {
                  await onUpdateCard({
                    ...c,
                    bookmarked: nextState,
                    bookmarkedAt: nextState ? new Date().toISOString() : undefined,
                  });
                }}
                topicTitle={deck.title}
              />

              {/* Flipcard Navigation Controls */}
              <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={activeFlipIndex === 0}
                  onClick={() => {
                    setActiveFlipIndex(prev => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  className="text-xs font-bold"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous Card
                </Button>

                <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  Card {(activeFlipIndex % cards.length) + 1} of {cards.length}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  disabled={activeFlipIndex >= cards.length - 1}
                  onClick={() => {
                    setActiveFlipIndex(prev => Math.min(cards.length - 1, prev + 1));
                    setIsFlipped(false);
                  }}
                  className="text-xs font-bold"
                >
                  Next Card
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Study Mode Call to action */}
              <div className="text-center pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={onStudy}
                  className="shadow-lg shadow-indigo-500/25 px-8 font-bold"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Launch Full Spaced Repetition Study Session
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Detailed Cards Management List */}
      {deckViewMode === 'list' && (
      <div className="space-y-3">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-2xl border-zinc-300 dark:border-zinc-800 text-zinc-400 text-sm">
            No cards match the selected filter.
          </div>
        ) : (
          filteredCards.map((card, idx) => (
            <GlassCard
              key={card.id || idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 border border-zinc-200/70 dark:border-zinc-800 hover:border-indigo-400/40 transition-all"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTypeBadge type={card.type} />
                  <DifficultyBadge difficulty={card.difficulty} />
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Due: {card.dueDate} ({formatInterval(card.interval)})
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    • Reps: {card.repetitions}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    Prompt / Question
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 whitespace-pre-line leading-relaxed">
                    {card.question}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                    Answer
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                    {card.answer}
                  </p>
                </div>

                {card.explanation && (
                  <p className="text-xs text-zinc-400 italic pt-1">
                    Note: {card.explanation}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                <button
                  onClick={() => handleToggleStar(card)}
                  aria-label="Star card"
                  className={`p-2 rounded-xl transition-colors ${
                    card.starred
                      ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Star className={`w-4 h-4 ${card.starred ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => setEditingCard(card)}
                  aria-label="Edit card"
                  className="p-2 rounded-xl text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (card.id && confirm('Delete this card?')) {
                      onDeleteCard(card.id);
                    }
                  }}
                  aria-label="Delete card"
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
      )}

      {/* Edit Card Modal */}
      {editingCard && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCard(null)}
          title="Edit Card"
          subtitle="Refine question, answer, and memory notes"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Question / Prompt</label>
              <textarea
                rows={3}
                value={editingCard.question}
                onChange={e => setEditingCard({ ...editingCard, question: e.target.value })}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Answer</label>
              <textarea
                rows={3}
                value={editingCard.answer}
                onChange={e => setEditingCard({ ...editingCard, answer: e.target.value })}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Explanation / Source Note</label>
              <input
                type="text"
                value={editingCard.explanation || ''}
                onChange={e => setEditingCard({ ...editingCard, explanation: e.target.value })}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditingCard(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Card Modal */}
      {isNewCardModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsNewCardModalOpen(false)}
          title="Add New Card to Deck"
          subtitle="Create a custom flashcard"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500">Card Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as CardType)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm"
                >
                  <option value="definition">Definition</option>
                  <option value="cloze">Cloze</option>
                  <option value="mcq">MCQ</option>
                  <option value="true-false">True / False</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={e => setNewDifficulty(e.target.value as CardDifficulty)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Challenging</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Question / Prompt</label>
              <textarea
                rows={3}
                placeholder="What is X? or Complete the statement..."
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Answer</label>
              <textarea
                rows={2}
                placeholder="The correct definition or key term..."
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Optional Context / Source Sentence</label>
              <input
                type="text"
                placeholder="Source lecture context..."
                value={newExplanation}
                onChange={e => setNewExplanation(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setIsNewCardModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateNewCard} disabled={!newQuestion || !newAnswer}>
                Add Card
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
