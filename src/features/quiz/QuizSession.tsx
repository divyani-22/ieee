import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  RotateCcw,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Award,
  Zap,
  Target,
  BrainCircuit,
  Star,
  ShieldCheck
} from 'lucide-react';
import { Card, Deck, QuizDifficultyLevel } from '../../types';
import { Button } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { CardTypeBadge } from '../../components/Badge';

export interface QuizSessionProps {
  deck: Deck;
  cards: Card[];
  initialDifficulty?: QuizDifficultyLevel;
  onFinishQuiz: (stats: {
    totalQuestions: number;
    score: number;
    durationSeconds: number;
    weakTopics: string[];
  }) => void;
  onBack: () => void;
}

export interface QuestionResult {
  card: Card;
  userAnswer: string;
  isCorrect: boolean;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  deck,
  cards,
  initialDifficulty,
  onFinishQuiz,
  onBack,
}) => {
  // Pre-quiz selection state
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficultyLevel>(
    initialDifficulty || 'intermediate'
  );
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  // Active quiz state
  const [quizQuestions, setQuizQuestions] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer optional
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Counts by difficulty in deck
  const easyCards = cards.filter(c => c.difficulty === 'easy');
  const medCards = cards.filter(c => c.difficulty === 'medium');
  const hardCards = cards.filter(c => c.difficulty === 'hard');

  const startQuizWithDifficulty = (difficulty: QuizDifficultyLevel) => {
    let pool: Card[] = [];

    if (difficulty === 'simple') {
      // Prioritize easy, fallback to medium
      pool = [...easyCards, ...medCards, ...hardCards];
    } else if (difficulty === 'intermediate') {
      // Prioritize medium, balance with easy and hard
      pool = [...medCards, ...easyCards, ...hardCards];
    } else {
      // Hard: prioritize hard, fallback to medium
      pool = [...hardCards, ...medCards, ...easyCards];
    }

    if (pool.length === 0) pool = [...cards];

    // Pick top 10 unique cards
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    setQuizQuestions(selected);
    setSelectedDifficulty(difficulty);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setIsAnswered(false);
    setResults([]);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setQuizStarted(true);
  };

  useEffect(() => {
    if (!timerEnabled || isCompleted || !quizStarted) return;
    const interval = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerEnabled, isCompleted, quizStarted]);

  const currentQuestion = quizQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (isAnswered || !currentQuestion) return;

    let userAns = '';
    let isCorrect = false;

    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false') {
      userAns = selectedAnswer || '';
      isCorrect = userAns.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    } else {
      userAns = typedAnswer.trim();
      const normUser = userAns.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normAns = currentQuestion.answer.toLowerCase().replace(/[^a-z0-9]/g, '');
      isCorrect =
        normUser === normAns ||
        (normAns.length > 5 && normAns.includes(normUser) && normUser.length >= 4);
    }

    setIsAnswered(true);
    setResults(prev => [...prev, { card: currentQuestion, userAnswer: userAns, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      const totalCorrect =
        results.filter(r => r.isCorrect).length +
        (selectedAnswer?.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ||
        typedAnswer.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase()
          ? 1
          : 0);

      const weakTopics = Array.from(
        new Set(results.filter(r => !r.isCorrect).map(r => r.card.type))
      );

      if (totalCorrect >= Math.ceil(quizQuestions.length * 0.7)) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      onFinishQuiz({
        totalQuestions: quizQuestions.length,
        score: totalCorrect,
        durationSeconds: secondsElapsed,
        weakTopics,
      });
    }
  };

  const handleRetryMistakes = () => {
    const mistakes = results.filter(r => !r.isCorrect).map(r => r.card);
    if (mistakes.length === 0) return;

    setQuizQuestions(mistakes);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setIsAnswered(false);
    setResults([]);
    setIsCompleted(false);
  };

  // Format timer seconds
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. PRE-QUIZ DIFFICULTY SELECTION SCREEN
  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20 select-none">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Deck
        </button>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-700/60 text-xs font-bold text-amber-700 dark:text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Star Feature • Multi-Tier Quiz Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Choose Quiz Difficulty
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Deck: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{deck.title}</span> ({cards.length} cards total).
            Select your preferred level to tailor the questions to your study stage.
          </p>
        </div>

        {/* 3 Difficulty Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Simple */}
          <GlassCard
            interactive
            onClick={() => setSelectedDifficulty('simple')}
            className={`p-6 space-y-4 border-2 transition-all cursor-pointer relative ${
              selectedDifficulty === 'simple'
                ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                : 'border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-400/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Beginner
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                Simple
                {selectedDifficulty === 'simple' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Basic questions for beginners and quick revision. Focuses on foundational definitions and direct clozes.
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Card Pool:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {easyCards.length > 0 ? `${easyCards.length} easy` : `${cards.length} available`}
              </span>
            </div>
          </GlassCard>

          {/* Intermediate */}
          <GlassCard
            interactive
            onClick={() => setSelectedDifficulty('intermediate')}
            className={`p-6 space-y-4 border-2 transition-all cursor-pointer relative ${
              selectedDifficulty === 'intermediate'
                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                : 'border-zinc-200/80 dark:border-zinc-800 hover:border-amber-400/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Moderate
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                Intermediate
                {selectedDifficulty === 'intermediate' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                )}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Questions that require a better understanding of the topic. Balanced multiple-choice and conceptual application.
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Card Pool:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {medCards.length > 0 ? `${medCards.length} medium` : `${cards.length} available`}
              </span>
            </div>
          </GlassCard>

          {/* Hard */}
          <GlassCard
            interactive
            onClick={() => setSelectedDifficulty('hard')}
            className={`p-6 space-y-4 border-2 transition-all cursor-pointer relative ${
              selectedDifficulty === 'hard'
                ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/30 shadow-lg shadow-rose-500/10'
                : 'border-zinc-200/80 dark:border-zinc-800 hover:border-rose-400/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300">
                Challenging
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                Hard
                {selectedDifficulty === 'hard' && (
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                )}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Challenging questions that test deeper knowledge and understanding. Includes subtle altered-premise true/false & nuanced distractors.
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Card Pool:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {hardCards.length > 0 ? `${hardCards.length} hard` : `${cards.length} available`}
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Preferences & Start Action */}
        <GlassCard elevated className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-zinc-700 dark:text-zinc-300 select-none">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={e => setTimerEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-500" />
              Enable Quiz Timer
            </span>
          </label>

          <Button
            size="lg"
            variant="primary"
            onClick={() => startQuizWithDifficulty(selectedDifficulty)}
            className="w-full sm:w-auto shadow-lg shadow-indigo-500/25 px-8 font-bold"
          >
            Start {selectedDifficulty.toUpperCase()} Quiz
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (!currentQuestion && !isCompleted) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <p className="text-zinc-500">Not enough cards in this deck to start a quiz.</p>
        <Button variant="primary" onClick={onBack}>
          Back to Deck
        </Button>
      </div>
    );
  }

  // 2. QUIZ RESULTS SCREEN
  if (isCompleted) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const scorePct = Math.round((correctCount / quizQuestions.length) * 100);
    const mistakes = results.filter(r => !r.isCorrect);

    const difficultyBadgeColor =
      selectedDifficulty === 'simple'
        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        : selectedDifficulty === 'intermediate'
        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">
        <GlassCard elevated className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${difficultyBadgeColor}`}>
                {selectedDifficulty} Quiz
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Deck: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{deck.title}</span> • Duration: {formatTimer(secondsElapsed)}
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 py-4 border-y border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {scorePct}%
              </div>
              <div className="text-xs text-zinc-400 uppercase font-semibold">Final Score</div>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {correctCount} / {quizQuestions.length}
              </div>
              <div className="text-xs text-zinc-400 uppercase font-semibold">Correct Answers</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {mistakes.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleRetryMistakes}
                className="text-xs font-bold text-amber-600 dark:text-amber-400"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Retry {mistakes.length} Mistakes
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setQuizStarted(false)}
              className="text-xs font-bold"
            >
              Try Another Level
            </Button>
            <Button variant="primary" onClick={onBack} className="text-xs font-bold">
              Done & Return
            </Button>
          </div>
        </GlassCard>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Question Review & Explanations ({results.length})
          </h3>

          <div className="space-y-3">
            {results.map((res, i) => (
              <GlassCard
                key={i}
                className={`p-4 border ${
                  res.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-400">Q{i + 1}</span>
                      <CardTypeBadge type={res.card.type} />
                      {res.isCorrect ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {res.card.question}
                    </p>

                    <div className="text-xs space-y-0.5 pt-1">
                      <p className="text-zinc-500">
                        <span className="font-semibold">Your Answer:</span>{' '}
                        <span
                          className={
                            res.isCorrect
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-rose-500 font-bold'
                          }
                        >
                          {res.userAnswer || '(none)'}
                        </span>
                      </p>
                      {!res.isCorrect && (
                        <p className="text-zinc-500">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Correct Answer:
                          </span>{' '}
                          {res.card.answer}
                        </p>
                      )}
                    </div>

                    {res.card.explanation && (
                      <p className="text-xs text-zinc-400 italic pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-2">
                        {res.card.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. ACTIVE QUIZ QUESTION RENDER
  const options =
    currentQuestion.options || (currentQuestion.type === 'true-false' ? ['True', 'False'] : []);

  const difficultyBadgeColor =
    selectedDifficulty === 'simple'
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      : selectedDifficulty === 'intermediate'
      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setQuizStarted(false)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Level
        </button>

        {/* Level & Question Counter */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyBadgeColor}`}>
            {selectedDifficulty}
          </span>
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Question {currentIndex + 1} <span className="text-zinc-400">/ {quizQuestions.length}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
          <Timer className="w-3.5 h-3.5 text-indigo-500" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <GlassCard elevated className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <CardTypeBadge type={currentQuestion.type} />
          <span className="text-xs text-zinc-400 font-medium">Instant Feedback</span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Input Choices */}
        {options.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer =
                option.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();

              let buttonStyle =
                'bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  buttonStyle =
                    'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = 'bg-rose-500/15 border-rose-500 text-rose-600 font-bold';
                } else {
                  buttonStyle = 'opacity-40 border-zinc-200 dark:border-zinc-800';
                }
              } else if (isSelected) {
                buttonStyle =
                  'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 ring-2 ring-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-xl border text-left text-sm transition-all duration-150 flex items-center justify-between ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Fill in the blank / typed answer */
          <div className="space-y-3 pt-2">
            <input
              type="text"
              placeholder="Type your answer here..."
              value={typedAnswer}
              disabled={isAnswered}
              onChange={e => setTypedAnswer(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !isAnswered && typedAnswer.trim()) {
                  handleSubmitAnswer();
                }
              }}
              className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Instant Feedback Banner */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
              selectedAnswer?.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase() ||
              typedAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedAnswer?.trim().toLowerCase() ===
                currentQuestion.answer.trim().toLowerCase() ||
              typedAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase() ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Incorrect. The answer is: {currentQuestion.answer}
                  </span>
                </>
              )}
            </div>

            {currentQuestion.explanation && (
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                <span className="font-semibold text-indigo-500">Source Fact: </span>
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}

        {/* Footer Submit / Next Buttons */}
        <div className="pt-2 flex justify-end">
          {!isAnswered ? (
            <Button
              variant="primary"
              size="md"
              disabled={options.length > 0 ? !selectedAnswer : !typedAnswer.trim()}
              onClick={handleSubmitAnswer}
              className="shadow-md"
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleNextQuestion} className="shadow-md">
              {currentIndex + 1 < quizQuestions.length ? 'Next Question' : 'View Results'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
