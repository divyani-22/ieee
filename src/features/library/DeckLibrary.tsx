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
import { getPastelByIndex, getPastelConfig } from '../../utils/pastelColors';
import { Star, ArrowRight } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 select-none">
      {/* Header with Search and Import Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6EAE1] text-xs font-bold text-[#16161D] mb-2 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#16161D]" />
            <span>Interactive Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#16161D] leading-[1.08] tracking-tight">
            Learning Schedule<br />Deck Library
          </h1>
          <p className="text-sm font-semibold text-[#6B6B7B] mt-1.5">
            Organize study decks, review with spaced repetition, or take customized quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,.txt,.json"
            className="hidden"
            onChange={handleFileImport}
          />
          <button
            onClick={() => importInputRef.current?.click()}
            className="px-4 py-2.5 rounded-full bg-white text-[#16161D] shadow-soft text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Import (Anki/JSON)
          </button>

          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-full bg-[#22222B] text-white shadow-soft text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Deck
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
        <input
          type="text"
          placeholder="Search decks by title or topic..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-full bg-white text-[#16161D] placeholder-[#6B6B7B] shadow-soft text-sm font-semibold border-none focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30"
        />
      </div>

      {/* Deck Grid */}
      {filteredDecks.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-8 h-8 text-[#16161D]" />}
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
          {filteredDecks.map((deck, idx) => {
            const cards = cardsByDeckId[deck.id!] || [];
            const dueCards = cards.filter(c => c.dueDate <= todayStr);
            const masteredCards = cards.filter(c => c.repetitions >= 3);
            const masteryRate = cards.length > 0 ? Math.round((masteredCards.length / cards.length) * 100) : 0;

            const pastelKey = getPastelByIndex(idx);
            const pastel = getPastelConfig(pastelKey);

            return (
              <div
                key={deck.id}
                onClick={() => onSelectDeck(deck.id!)}
                className="card-pillowy relative p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer group shadow-pillowy transition-all duration-300"
                style={{
                  backgroundColor: pastel.front,
                  color: '#16161D',
                }}
              >
                {/* Low-opacity open-book watermark */}
                <div className="absolute right-2 bottom-2 pointer-events-none opacity-[0.08] select-none text-[#16161D]">
                  <BookOpen className="w-36 h-36" strokeWidth={1} />
                </div>

                {/* Decorative Sparkle Stars */}
                <svg className="absolute top-8 right-20 w-4 h-4 text-white/70 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
                <svg className="absolute bottom-12 right-28 w-3 h-3 text-white/60 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>

                {/* Top Row: White circular icon chip + White pill status chip */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 text-[#16161D]" />
                  </div>

                  <div className="px-3 py-1 rounded-full bg-white shadow-soft flex items-center gap-1 text-xs font-black text-[#16161D]">
                    {dueCards.length > 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#F58D87] animate-pulse" />
                        <span>{dueCards.length} Due</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 fill-[#16161D] text-[#16161D]" />
                        <span>4.8</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Middle: Category + Bold 2-line title */}
                <div className="my-5 relative z-10 space-y-1">
                  <span className="text-xs font-bold text-[#6B6B7B] tracking-wide block uppercase">
                    {deck.tags?.[0] || deck.sourceType}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#16161D] leading-snug line-clamp-2">
                    {deck.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#6B6B7B] block pt-0.5">
                    {cards.length} interactive cards • {masteryRate}% mastered
                  </span>
                </div>

                {/* Bottom Row: Avatar stack + Circular Arrow Button */}
                <div className="flex items-center justify-between pt-2 pb-4 relative z-10 border-b border-black/5">
                  {/* Overlapping Avatar Stack with "+5" bubble */}
                  <div className="flex items-center -space-x-2">
                    <div className="w-7 h-7 rounded-full ring-2 ring-white overflow-hidden bg-sky-100">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full ring-2 ring-white overflow-hidden bg-emerald-100">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full ring-2 ring-white overflow-hidden bg-amber-100">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-7 px-2 rounded-full bg-white ring-2 ring-white text-[10px] font-extrabold text-[#16161D] flex items-center justify-center shadow-xs">
                      +5
                    </div>
                  </div>

                  {/* Circular Arrow Button with white ring */}
                  <div className="w-11 h-11 rounded-full bg-white ring-4 ring-white/60 shadow-soft flex items-center justify-center text-[#16161D] transition-all group-hover:scale-110 group-hover:bg-[#16161D] group-hover:text-white">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Action Buttons: Flashcards & Quiz Mode */}
                <div className="space-y-2 pt-3 relative z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStudyDeck(deck.id!);
                      }}
                      className="py-2.5 px-3 rounded-full bg-white text-[#16161D] text-xs font-extrabold shadow-soft hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Flashcards
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuizDeck(deck.id!);
                      }}
                      className="py-2.5 px-3 rounded-full bg-white text-[#16161D] text-xs font-extrabold shadow-soft hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Quiz Mode
                    </button>
                  </div>

                  {/* Subtle Export & Delete Bar */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B7B] pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        title="Export to Anki CSV"
                        onClick={(e) => handleExportCsv(deck, e)}
                        className="hover:text-[#16161D] transition-colors flex items-center gap-1"
                      >
                        <FileSpreadsheet className="w-3 h-3" /> Anki
                      </button>
                      <span>•</span>
                      <button
                        title="Export JSON"
                        onClick={(e) => handleExportJson(deck, e)}
                        className="hover:text-[#16161D] transition-colors flex items-center gap-1"
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
                      className="hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
