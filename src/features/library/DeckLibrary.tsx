import React, { useState, useRef } from 'react';
import {
  Layers,
  BookOpen,
  HelpCircle,
  Download,
  Upload,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  Plus,
  Play,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Deck, Card } from '../../types';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { exportDeckToAnkiCsv, exportDeckToJson, downloadFile, parseImportedDeck } from '../../services/ankiExport';
import { db } from '../../db';

export interface DeckLibraryProps {
  decks: Deck[];
  cardsByDeckId: Record<number, Card[]>;
  onSelectDeck: (deckId: number) => void;
  onStudyDeck: (deckId: number) => void;
  onQuizDeck: (deckId: number) => void;
  onDeleteDeck: (deckId: number) => void;
  onImportDeck: (deck: Omit<Deck, 'id' | 'totalCards' | 'createdAt' | 'updatedAt'>, cards: Omit<Card, 'id' | 'deckId'>[]) => void;
  onOpenUpload: () => void;
}

export const DeckLibrary: React.FC<DeckLibraryProps> = ({
  decks,
  cardsByDeckId,
  onSelectDeck,
  onStudyDeck,
  onQuizDeck,
  onDeleteDeck,
  onImportDeck,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredDecks = decks.filter(deck =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportCsv = (deck: Deck, e: React.MouseEvent) => {
    e.stopPropagation();
    const cards = cardsByDeckId[deck.id!] || [];
    const csv = exportDeckToAnkiCsv(deck, cards);
    const filename = `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_anki.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
  };

  const handleExportJson = (deck: Deck, e: React.MouseEvent) => {
    e.stopPropagation();
    const cards = cardsByDeckId[deck.id!] || [];
    const json = exportDeckToJson(deck, cards);
    const filename = `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_recall.json`;
    downloadFile(json, filename, 'application/json;charset=utf-8;');
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const { deck, cards } = parseImportedDeck(content, file.name);
      onImportDeck(deck, cards);
    } catch (err) {
      console.error('Import failed:', err);
      alert('Failed to parse the imported file. Ensure it is valid Anki CSV or Recall JSON.');
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header with Search and Import Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-indigo-500" />
            Deck Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Organize, study with spaced repetition, or take customized 10-question quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,.txt,.json"
            className="hidden"
            onChange={handleFileImport}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => importInputRef.current?.click()}
            className="text-xs font-semibold"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Import (Anki/JSON)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenUpload}
            className="text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Deck
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search decks by title or topic..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Deck Grid */}
      {filteredDecks.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-8 h-8" />}
          title={searchQuery ? 'No decks match your search' : 'No decks yet'}
          description={
            searchQuery
              ? 'Try searching with different keywords or clear the search bar.'
              : 'Upload your lecture PDF or paste notes to automatically generate your first interactive deck.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Create First Deck'}
          onAction={searchQuery ? () => setSearchQuery('') : onOpenUpload}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map(deck => {
            const cards = cardsByDeckId[deck.id!] || [];
            const dueCards = cards.filter(c => c.dueDate <= todayStr);
            const masteredCards = cards.filter(c => c.repetitions >= 3);
            const masteryRate = cards.length > 0 ? Math.round((masteredCards.length / cards.length) * 100) : 0;

            return (
              <GlassCard
                key={deck.id}
                interactive
                onClick={() => onSelectDeck(deck.id!)}
                className="p-6 flex flex-col justify-between group h-full space-y-4 border border-zinc-200/80 dark:border-zinc-800"
              >
                <div className="space-y-3">
                  {/* Top Bar with badge and action dropdown */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                      {deck.sourceType}
                    </span>

                    {dueCards.length > 0 ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {dueCards.length} due today
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Up to date
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {deck.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {deck.description || 'Interactive lecture cards & quizzes'}
                    </p>
                  </div>

                  {/* Stats Counter */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-100 dark:border-zinc-800/80 text-center">
                    <div>
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {cards.length}
                      </div>
                      <div className="text-[10px] text-zinc-400">Cards</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {masteryRate}%
                      </div>
                      <div className="text-[10px] text-zinc-400">Mastered</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {cards.filter(c => c.starred).length}
                      </div>
                      <div className="text-[10px] text-zinc-400">Starred</div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStudyDeck(deck.id!);
                      }}
                      className="text-xs font-semibold"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1" />
                      Flashcards
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuizDeck(deck.id!);
                      }}
                      className="text-xs font-semibold"
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1" />
                      Quiz Mode
                    </Button>
                  </div>

                  {/* Quick Export & Delete Bar */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        title="Export to Anki CSV"
                        onClick={(e) => handleExportCsv(deck, e)}
                        className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                      >
                        <FileSpreadsheet className="w-3 h-3" /> Anki
                      </button>
                      <span>•</span>
                      <button
                        title="Export JSON"
                        onClick={(e) => handleExportJson(deck, e)}
                        className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> JSON
                      </button>
                    </div>

                    <button
                      title="Delete Deck"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${deck.title}"?`)) {
                          onDeleteDeck(deck.id!);
                        }
                      }}
                      className="hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
