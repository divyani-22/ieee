import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Tablet,
  Smartphone,
  Monitor,
  CheckCircle2,
  HelpCircle,
  Bookmark,
  Layers,
  Flame,
  Star,
  RotateCw,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '../../components/Button';

export interface HeroSectionProps {
  onStartLearning: () => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLearning,
  onExploreFeatures,
}) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pb-20">
      {/* Decorative soft pastel background blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-lightBlue-100/50 dark:bg-navy-800/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-coral-100/40 dark:bg-coral-950/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellowPastel-100/40 dark:bg-yellowPastel-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* ========================================================================= */}
        {/* LEFT SIDE: Typography, Description, CTAs, Platform Badges */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Friendly pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lightBlue-100/80 dark:bg-navy-800 border border-lightBlue-200 dark:border-navy-700 text-xs font-extrabold text-navy dark:text-lightBlue-200 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-coral fill-coral" />
            <span>Interactive Educational Platform</span>
          </div>

          {/* Very large bold navy typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-navy dark:text-white leading-[1.08]">
            Learn Smarter. <br />
            <span className="text-coral">
              Remember More.
            </span>
          </h1>

          {/* Short supporting description */}
          <p className="text-base sm:text-lg font-medium text-navy/70 dark:text-lightBlue-100/80 max-w-xl leading-relaxed">
            Recall turns your lecture notes and PDFs into interactive 3D flashcards, smart three-tier quizzes, and targeted bookmark revisions — completely private on your device.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="coral"
              onClick={onStartLearning}
              className="text-base px-7 py-4 font-black shadow-coral-soft hover:scale-[1.02] transition-transform"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={onExploreFeatures}
              className="text-base px-6 py-4 font-bold"
            >
              Explore Features
            </Button>
          </div>

          {/* Platform / Support information with small clean icons */}
          <div className="pt-6 border-t border-lightBlue-100 dark:border-navy-800 flex items-center gap-6 text-xs font-bold text-navy/60 dark:text-lightBlue-200">
            <span className="text-navy/40 dark:text-navy-400 uppercase text-[11px] tracking-wider">
              Available on:
            </span>
            <div className="flex items-center gap-1.5">
              <Tablet className="w-4 h-4 text-navy dark:text-lightBlue-200" />
              <span>Tablet</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-navy dark:text-lightBlue-200" />
              <span>Phone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-navy dark:text-lightBlue-200" />
              <span>Desktop</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT SIDE: Multi-layered floating mockup screens (Visual Focus) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 relative w-full flex items-center justify-center min-h-[460px] sm:min-h-[540px] px-2 select-none">
          <div className="relative w-full max-w-lg">

            {/* SCREEN 1 (Back Right): Bookmark Screen Card */}
            <div className="absolute -top-6 -right-2 sm:-right-4 w-60 sm:w-68 p-4 rounded-3xl bg-coral-50 dark:bg-navy-800/90 border border-coral-200/80 dark:border-navy-700 shadow-soft-lg transform rotate-6 animate-float-slow -z-1">
              <div className="flex items-center justify-between pb-2 border-b border-coral-100 dark:border-navy-700">
                <span className="text-xs font-black text-coral flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 fill-coral" />
                  My Bookmarks
                </span>
                <span className="px-2 py-0.5 rounded-full bg-coral text-white text-[10px] font-black">
                  8 Concepts
                </span>
              </div>
              <p className="text-[11px] font-bold text-navy dark:text-white mt-2 leading-tight">
                "Resting Membrane Potential: -70mV"
              </p>
              <div className="mt-2 text-[10px] font-bold text-coral-600 dark:text-coral-300">
                Tap to Review All
              </div>
            </div>

            {/* SCREEN 2 (Back Left): Progress Screen Card */}
            <div className="absolute -bottom-4 -left-2 sm:-left-6 w-60 sm:w-68 p-4 rounded-3xl bg-yellowPastel-50 dark:bg-navy-800/90 border border-yellowPastel-200 dark:border-navy-700 shadow-soft-lg transform -rotate-6 animate-float-reverse z-10">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-black text-navy dark:text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-coral fill-coral" />
                  Daily Streak
                </span>
                <span className="text-xs font-black text-navy dark:text-white">7 Days</span>
              </div>
              <div className="space-y-1.5 mt-2">
                <div className="flex justify-between text-[11px] font-bold text-navy/70 dark:text-lightBlue-200">
                  <span>Quiz Accuracy</span>
                  <span className="text-navy dark:text-white font-black">78%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-yellowPastel-200 overflow-hidden">
                  <div className="w-[78%] h-full bg-yellowPastel-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* SCREEN 3 (Center Top): Interactive 3D Flashcard Mockup */}
            <div className="relative mx-auto w-72 sm:w-80 p-5 rounded-4xl bg-white dark:bg-navy-800 border-2 border-lightBlue-200/80 dark:border-navy-700 shadow-soft-lg z-20 transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-lightBlue-100 text-navy">
                  Flashcard
                </span>
                <span className="text-xs font-bold text-navy/50 dark:text-lightBlue-200">
                  Neuroscience
                </span>
              </div>

              <div className="py-4 text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-coral">
                  Question
                </span>
                <p className="text-base font-extrabold text-navy dark:text-white leading-snug">
                  What triggers the opening of voltage-gated Na+ channels?
                </p>
              </div>

              <div className="pt-3 border-t border-lightBlue-100 dark:border-navy-700 flex items-center justify-between text-xs text-navy/60 dark:text-lightBlue-200">
                <span className="flex items-center gap-1 font-semibold text-[11px]">
                  <RotateCw className="w-3 h-3 text-coral" />
                  Tap to flip in 3D
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-coral-100 text-coral text-[10px] font-bold">
                    Don't Remember
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-lightBlue-100 text-navy text-[10px] font-bold">
                    Remembered
                  </span>
                </div>
              </div>
            </div>

            {/* SCREEN 4 (Front Offset): Quiz Question Mockup Card */}
            <div className="absolute top-28 -right-4 sm:-right-8 w-68 sm:w-76 p-4 rounded-3xl bg-white dark:bg-navy-850 border border-lightBlue-100 dark:border-navy-700 shadow-soft-lg z-30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellowPastel-100 text-navy">
                  Quiz • Level 2
                </span>
                <span className="text-[11px] font-extrabold text-navy dark:text-white">Q 01 / 10</span>
              </div>

              <p className="text-xs font-bold text-navy dark:text-white leading-tight mb-2.5">
                Which ion initiates neurotransmitter release?
              </p>

              <div className="space-y-1.5">
                <div className="px-2.5 py-1.5 rounded-xl bg-lightBlue-50 dark:bg-navy-750 border border-lightBlue-200 text-xs font-bold text-navy dark:text-white flex items-center justify-between">
                  <span>A. Calcium (Ca2+)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-navy dark:text-lightBlue-300" />
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-pageBg dark:bg-navy-800 text-[11px] text-navy/70 dark:text-lightBlue-200 font-medium">
                  <span>B. Potassium (K+)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
