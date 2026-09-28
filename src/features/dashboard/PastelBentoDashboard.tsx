import React, { useState } from 'react';
import { PageHeader } from '../../components/pastel/PageHeader';
import { CourseCard } from '../../components/pastel/CourseCard';
import { StatCard } from '../../components/pastel/StatCard';
import { SegmentedTabs } from '../../components/pastel/SegmentedTabs';
import { ProgressGaugeCard } from '../../components/pastel/ProgressGaugeCard';
import { CalendarCard } from '../../components/pastel/CalendarCard';
import { HeroOnboardingCard } from '../../components/pastel/HeroOnboardingCard';
import { Deck, Card as FlashcardItem } from '../../types';
import { Monitor, BarChart2, BookOpen, Layers, CheckCircle, Award, Sparkles } from 'lucide-react';

export interface PastelBentoDashboardProps {
  decks: Deck[];
  allCards: FlashcardItem[];
  bookmarkedCount: number;
  dueCardsCount: number;
  userName?: string;
  onOpenDeck: (deckId: number) => void;
  onStartQuiz: () => void;
  onStartFlashcards: () => void;
  onOpenBookmarks: () => void;
  onOpenUpload: () => void;
}

export const PastelBentoDashboard: React.FC<PastelBentoDashboardProps> = ({
  decks,
  allCards,
  bookmarkedCount,
  dueCardsCount,
  userName = 'Alex',
  onOpenDeck,
  onStartQuiz,
  onStartFlashcards,
  onOpenBookmarks,
  onOpenUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'month' | 'year'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate actual statistics from IndexedDB data
  const totalCards = allCards.length;
  const masteredCards = allCards.filter(c => c.repetitions >= 3).length;
  const retentionScore = totalCards > 0 ? Math.min(250, Math.round((masteredCards / totalCards) * 200 + 40)) : 200;

  // Filter decks by search query
  const filteredDecks = decks.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* =================================================================== */}
      {/* 1. SIGNATURE PAGE HEADER */}
      {/* =================================================================== */}
      <PageHeader
        userName={userName}
        progressPercent={Math.min(100, Math.round((masteredCards / Math.max(1, totalCards)) * 100))}
        titleLine1="Your Progress"
        titleLine2="Today"
        onOpenSearch={() => {
          const el = document.getElementById('bento-search-input');
          if (el) el.focus();
        }}
        onOpenNotifications={() => {
          alert(`You have ${dueCardsCount} flashcards due for revision today!`);
        }}
      />

      {/* Hidden search input toggle */}
      <div className="relative">
        <input
          id="bento-search-input"
          type="text"
          placeholder="Search courses, study decks, concepts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-3 rounded-full bg-white/80 border border-white shadow-soft text-sm font-semibold text-[#16161D] placeholder-[#A3A3B5] focus:outline-none focus:ring-2 focus:ring-[#B9A6E3] transition-all"
        />
      </div>

      {/* =================================================================== */}
      {/* 2. 12-COLUMN BENTO GRID DASHBOARD */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* ================================================================= */}
        {/* LEFT COLUMN: Hero Onboarding + Category Course Cards (Span 7) */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Signature Component 7: Onboarding / Hero Card */}
          <HeroOnboardingCard
            title="Start Learning Today"
            description="Unlock knowledge anytime with expert-led lessons and personalized AI flashcards."
            buttonText="Upload Notes or Lecture"
            onCtaClick={onOpenUpload}
          />

          {/* Section Subheading */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16161D] tracking-tight">
              Active Courses & Decks
            </h3>
            <button
              onClick={onStartFlashcards}
              className="text-xs font-bold text-[#7D64B5] hover:underline"
            >
              View All ({decks.length})
            </button>
          </div>

          {/* Signature Component 2: Course / Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1: Mint Card ("Tech & Software" / First Deck) */}
            <CourseCard
              variant="mint"
              icon={<Monitor className="w-5 h-5 text-[#589A80]" />}
              rating="3.5"
              category={decks[0]?.tags?.[0] ? decks[0].tags[0].toUpperCase() : "Tech & Software"}
              title={decks[0]?.title || "Designing Seamless User Experiences"}
              studentCountText="5+"
              totalCards={decks[0]?.totalCards || 16}
              onClick={() => {
                if (decks[0]?.id) onOpenDeck(decks[0].id);
                else onStartFlashcards();
              }}
            />

            {/* Card 2: Lavender Card ("Data Analysis" / Second Deck) */}
            <CourseCard
              variant="lavender"
              icon={<BarChart2 className="w-5 h-5 text-[#7D64B5]" />}
              rating="3.2"
              category={decks[1]?.tags?.[0] ? decks[1].tags[0].toUpperCase() : "Data Analysis"}
              title={decks[1]?.title || "Effective Analytics Software Solutions"}
              studentCountText="5+"
              totalCards={decks[1]?.totalCards || 20}
              onClick={() => {
                if (decks[1]?.id) onOpenDeck(decks[1].id);
                else onStartQuiz();
              }}
            />

            {/* Extra user deck if available: Periwinkle card */}
            {decks.length > 2 && (
              <CourseCard
                variant="periwinkle"
                icon={<BookOpen className="w-5 h-5 text-[#5660A6]" />}
                rating="4.0"
                category={decks[2]?.tags?.[0] ? decks[2].tags[0].toUpperCase() : "Bio & Sciences"}
                title={decks[2]?.title}
                studentCountText="8+"
                totalCards={decks[2]?.totalCards || 12}
                onClick={() => onOpenDeck(decks[2].id!)}
              />
            )}

            {/* Bookmarks Quick Card: Yellow card */}
            <CourseCard
              variant="yellow"
              icon={<Award className="w-5 h-5 text-[#B89431]" />}
              rating="5.0"
              category="REVISION & RECALL"
              title="My Bookmarked Concepts Review"
              studentCountText={`${bookmarkedCount}+`}
              totalCards={bookmarkedCount}
              onClick={onOpenBookmarks}
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: Stat Cards, Tabs, Gauge, Calendar (Span 5) */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Signature Component 3: Stat Cards (Two side by side) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Mint Stat Card: "Achieved" */}
            <StatCard
              variant="mint"
              icon={<CheckCircle className="w-4 h-4 text-[#589A80]" />}
              title="Achieved"
              value={masteredCards > 0 ? masteredCards : 12}
              onClick={onStartFlashcards}
            />

            {/* Yellow Stat Card: "Final Score" */}
            <StatCard
              variant="yellow"
              icon={<Award className="w-4 h-4 text-[#B89431]" />}
              title="Final Score"
              value={dueCardsCount > 0 ? 60 + dueCardsCount : 60}
              onClick={onStartQuiz}
            />
          </div>

          {/* Signature Component 4: Segmented Tabs (Weekly / Month / Year) */}
          <div className="flex justify-center sm:justify-start">
            <SegmentedTabs
              activeTab={activeTab}
              onChange={(t) => setActiveTab(t as any)}
              tabs={[
                { id: 'weekly', label: 'Weekly' },
                { id: 'month', label: 'Month' },
                { id: 'year', label: 'Year' },
              ]}
            />
          </div>

          {/* Signature Component 5: Progress Gauge Card */}
          <ProgressGaugeCard
            title="Progress"
            score={retentionScore}
            label="Score"
            percent={Math.min(100, Math.round((retentionScore / 250) * 100))}
            onMenuClick={() => alert(`Your current retention index is ${retentionScore} pts.`)}
          />

          {/* Signature Component 6: Calendar Card */}
          <CalendarCard
            initialMonth="July 2025"
            selectedDay={12}
            activeDays={[3, 4, 10, 11, 12, 18, 19, 25, 26]}
            onSelectDate={(day) => console.log('Selected date:', day)}
          />
        </div>
      </div>
    </div>
  );
};
