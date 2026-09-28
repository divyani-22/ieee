import React, { useState } from 'react';
import {
  Flame,
  Award,
  BookOpen,
  Bookmark,
  Target,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { Card, Deck, StudySessionLog } from '../../types';
import { StatCard } from '../../components/pastel/StatCard';
import { SegmentedTabs } from '../../components/pastel/SegmentedTabs';
import { ProgressGaugeCard } from '../../components/pastel/ProgressGaugeCard';
import { CalendarCard } from '../../components/pastel/CalendarCard';
import { CourseCard } from '../../components/pastel/CourseCard';

export interface ProgressPageProps {
  decks: Deck[];
  allCards: Card[];
  studyLogs: StudySessionLog[];
  onSelectDeck: (deckId: number) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  decks,
  allCards,
  studyLogs,
  onSelectDeck,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'month' | 'year'>('weekly');

  // Metrics
  const totalCards = allCards.length;
  const masteredCards = allCards.filter(c => c.repetitions >= 3).length;
  const bookmarkedCards = allCards.filter(c => !!c.bookmarked).length;

  const totalReviews = studyLogs.reduce((acc, l) => acc + (l.totalReviewed || 0), 0);
  const totalCorrect = studyLogs.reduce((acc, l) => acc + (l.correctCount || 0), 0);
  const quizAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 78;
  const retentionScore = totalCards > 0 ? Math.min(250, Math.round((masteredCards / totalCards) * 200 + 40)) : 200;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 select-none">
      {/* =================================================================== */}
      {/* 1. SIGNATURE MULTI-LINE TITLE ("Learning Pathway Status") */}
      {/* =================================================================== */}
      <div className="flex items-end justify-between pt-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9CDEE] text-xs font-bold text-[#16161D] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#7D64B5]" />
            <span>Learning Pathway</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#16161D] leading-[1.08] tracking-tight">
            Learning<br />Pathway Status
          </h1>
        </div>

        {/* Circular Action Button */}
        <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D] shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. STAT CARDS ROW */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Mint Stat Card: Achieved */}
        <StatCard
          variant="mint"
          icon={<CheckCircle2 className="w-4 h-4 text-[#589A80]" />}
          title="Achieved"
          value={masteredCards > 0 ? masteredCards : 12}
        />

        {/* Yellow Stat Card: Final Score */}
        <StatCard
          variant="yellow"
          icon={<Award className="w-4 h-4 text-[#B89431]" />}
          title="Final Score"
          value={quizAccuracy > 0 ? quizAccuracy : 60}
        />

        {/* Lavender Stat Card: Total Reviewed */}
        <StatCard
          variant="lavender"
          icon={<Layers className="w-4 h-4 text-[#7D64B5]" />}
          title="Total Reviewed"
          value={totalReviews > 0 ? totalReviews : 48}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* =================================================================== */}
      {/* 3. SEGMENTED TABS */}
      {/* =================================================================== */}
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

      {/* =================================================================== */}
      {/* 4. PROGRESS GAUGE + CALENDAR (Side by side on desktop) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ProgressGaugeCard
          title="Progress"
          score={retentionScore}
          label="Score"
          percent={Math.min(100, Math.round((retentionScore / 250) * 100))}
        />

        <CalendarCard
          initialMonth="July 2025"
          selectedDay={12}
          activeDays={[3, 4, 10, 11, 12, 18, 19, 25, 26]}
        />
      </div>

      {/* =================================================================== */}
      {/* 5. COURSES IN YOUR PATHWAY */}
      {/* =================================================================== */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#16161D] tracking-tight">
          Enrolled Study Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {decks.map((d, index) => {
            const variants: ('mint' | 'lavender' | 'periwinkle' | 'yellow')[] = ['mint', 'lavender', 'periwinkle', 'yellow'];
            const chosenVariant = variants[index % variants.length];

            return (
              <CourseCard
                key={d.id}
                variant={chosenVariant}
                icon={<Monitor className="w-5 h-5" />}
                rating="3.5"
                category={d.tags?.[0] ? d.tags[0].toUpperCase() : 'STUDY DECK'}
                title={d.title}
                studentCountText="5+"
                totalCards={d.totalCards}
                onClick={() => onSelectDeck(d.id!)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
