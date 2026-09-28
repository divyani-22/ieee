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
  ChevronLeft,
  Award,
  Zap,
  Target,
  BrainCircuit,
  Star,
  Clock,
  BookOpen,
  X
} from 'lucide-react';
import { Card, Deck, QuizDifficultyLevel } from '../../types';
import { Button } from '../../components/Button';
import { getPastelByIndex, getPastelConfig } from '../../utils/pastelColors';

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
  const [showReviewList, setShowReviewList] = useState(false);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Categorize pool
  const easyCards = cards.filter(c => c.difficulty === 'easy');
  const medCards = cards.filter(c => c.difficulty === 'medium');
  const hardCards = cards.filter(c => c.difficulty === 'hard');

  const startQuizWithDifficulty = (difficulty: QuizDifficultyLevel) => {
    let pool: Card[] = [];

    if (difficulty === 'simple') {
      pool = [...easyCards, ...medCards, ...hardCards];
    } else if (difficulty === 'intermediate') {
      pool = [...medCards, ...easyCards, ...hardCards];
    } else {
      pool = [...hardCards, ...medCards, ...easyCards];
    }

    if (pool.length === 0) pool = [...cards];

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
    setShowReviewList(false);
    setQuizStarted(true);
  };

  useEffect(() => {
    if (!quizStarted || isCompleted) return;
    const interval = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStarted, isCompleted]);

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
      const totalCorrect = results.filter(r => r.isCorrect).length;
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
        weakTopics: Array.from(new Set(results.filter(r => !r.isCorrect).map(r => r.card.type))),
      });
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const prevResult = results[currentIndex - 1];
      if (prevResult) {
        setSelectedAnswer(prevResult.userAnswer);
        setTypedAnswer(prevResult.userAnswer);
        setIsAnswered(true);
      }
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // =========================================================================
  // 1. THREE QUIZ DIFFICULTY LEVEL SELECTION SCREEN (Pastel Reference Style)
  // =========================================================================
  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 select-none">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-navy/70 dark:text-lightBlue-200 hover:text-navy dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        {/* Hero Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lightBlue-100 text-navy text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-coral fill-coral" />
            <span>Multi-Tier Quiz Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-navy dark:text-white tracking-tight">
            Choose Quiz Difficulty
          </h1>
          <p className="text-sm font-semibold text-navy/60 dark:text-lightBlue-200 max-w-lg mx-auto">
            Deck: <span className="font-extrabold text-navy dark:text-white">{deck.title}</span> ({cards.length} cards total).
            Select your preferred level to tailor the practice questions.
          </p>
        </div>

        {/* Exactly THREE Quiz Difficulty Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. SIMPLE (Mint #D6EAE1) */}
          <div
            onClick={() => setSelectedDifficulty('simple')}
            className={`card-pillowy p-7 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-[#D6EAE1] hover:-translate-y-1.5 ${
              selectedDifficulty === 'simple'
                ? 'border-[#589A80] ring-4 ring-[#A8D5C2]/40 shadow-pillowy-hover'
                : 'border-transparent shadow-pillowy'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#589A80]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#16161D] shadow-xs">
                  Beginner
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-[#16161D]">
                  SIMPLE
                </h3>
                <p className="text-xs font-semibold text-[#6B6B7B] leading-relaxed">
                  Basic concepts and quick revision. Foundational definitions and direct recall questions.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between text-xs font-bold text-[#6B6B7B]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  10 Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  5 Mins
                </span>
              </div>

              <button
                onClick={() => startQuizWithDifficulty('simple')}
                className="w-full py-3 rounded-full bg-[#22222B] text-white font-extrabold text-xs shadow-soft hover:bg-black transition-all"
              >
                Start Simple Quiz
              </button>
            </div>
          </div>

          {/* 2. INTERMEDIATE (Butter Yellow #FCE6A6) */}
          <div
            onClick={() => setSelectedDifficulty('intermediate')}
            className={`card-pillowy p-7 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-[#FCE6A6] hover:-translate-y-1.5 ${
              selectedDifficulty === 'intermediate'
                ? 'border-[#B89431] ring-4 ring-[#E5CB82]/40 shadow-pillowy-hover'
                : 'border-transparent shadow-pillowy'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#B89431]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#16161D] shadow-xs">
                  Moderate
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-[#16161D]">
                  INTERMEDIATE
                </h3>
                <p className="text-xs font-semibold text-[#6B6B7B] leading-relaxed">
                  Questions requiring deeper topic understanding and multi-step conceptual connections.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between text-xs font-bold text-[#6B6B7B]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  10 Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  8 Mins
                </span>
              </div>

              <button
                onClick={() => startQuizWithDifficulty('intermediate')}
                className="w-full py-3 rounded-full bg-[#22222B] text-white font-extrabold text-xs shadow-soft hover:bg-black transition-all"
              >
                Start Intermediate Quiz
              </button>
            </div>
          </div>

          {/* 3. HARD (Lavender #D9CDEE) */}
          <div
            onClick={() => setSelectedDifficulty('hard')}
            className={`card-pillowy p-7 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-[#D9CDEE] hover:-translate-y-1.5 ${
              selectedDifficulty === 'hard'
                ? 'border-[#7D64B5] ring-4 ring-[#B9A6E3]/40 shadow-pillowy-hover'
                : 'border-transparent shadow-pillowy'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-[#7D64B5]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#16161D] shadow-xs">
                  Challenging
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-[#16161D]">
                  HARD
                </h3>
                <p className="text-xs font-semibold text-[#6B6B7B] leading-relaxed">
                  Challenging synthesis questions designed to thoroughly test mastery under exam-like conditions.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between text-xs font-bold text-[#6B6B7B]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  10 Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  12 Mins
                </span>
              </div>

              <button
                onClick={() => startQuizWithDifficulty('hard')}
                className="w-full py-3 rounded-full bg-[#22222B] text-white font-extrabold text-xs shadow-soft hover:bg-black transition-all"
              >
                Start Hard Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. QUIZ COMPLETE RESULTS SCREEN
  // =========================================================================
  if (isCompleted) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const incorrectCount = quizQuestions.length - correctCount;
    const scorePct = Math.round((correctCount / quizQuestions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 select-none">
        <div className="bg-white dark:bg-navy-800 rounded-4xl p-8 sm:p-10 border border-lightBlue-100 dark:border-navy-700 shadow-soft-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-lightBlue-100 text-navy flex items-center justify-center shadow-soft">
            <Award className="w-10 h-10 text-coral" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lightBlue-100 text-navy text-xs font-black uppercase">
              {selectedDifficulty} Quiz
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy dark:text-white">
              Quiz Complete!
            </h2>
            <p className="text-xs font-semibold text-navy/60 dark:text-lightBlue-200">
              Deck: {deck.title} • Time Taken: {formatTimer(secondsElapsed)}
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-pageBg dark:bg-navy-900 border border-lightBlue-100/70 dark:border-navy-700">
            <div>
              <div className="text-3xl font-black text-navy dark:text-white">{scorePct}%</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-navy/50 dark:text-lightBlue-200">Score</div>
            </div>
            <div>
              <div className="text-3xl font-black text-coral">{correctCount}</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-navy/50 dark:text-lightBlue-200">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-black text-navy/60 dark:text-lightBlue-200">{incorrectCount}</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-navy/50 dark:text-lightBlue-200">Incorrect</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="md"
              variant="secondary"
              onClick={() => setShowReviewList(prev => !prev)}
              className="font-bold"
            >
              {showReviewList ? 'Hide Review' : 'Review Answers'}
            </Button>

            <Button
              size="md"
              variant="yellow"
              onClick={() => startQuizWithDifficulty(selectedDifficulty)}
              className="font-bold shadow-soft"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Try Again
            </Button>

            <Button
              size="md"
              variant="primary"
              onClick={onBack}
              className="font-bold shadow-soft"
            >
              Done & Return
            </Button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        {showReviewList && (
          <div className="space-y-4 pt-4 animate-fade-in">
            <h3 className="text-xs font-black uppercase tracking-wider text-navy/60 dark:text-lightBlue-200 px-2">
              Reviewing {results.length} Questions
            </h3>

            <div className="space-y-3">
              {results.map((res, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-3xl border transition-all ${
                    res.isCorrect
                      ? 'bg-lightBlue-50/60 border-lightBlue-200 dark:bg-navy-800'
                      : 'bg-coral-50/60 border-coral-200 dark:bg-navy-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-navy/50">Q{i + 1}</span>
                        {res.isCorrect ? (
                          <span className="text-xs font-bold text-navy flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-coral" /> Correct
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-coral-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-coral" /> Incorrect
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-navy dark:text-white">
                        {res.card.question}
                      </p>

                      <div className="text-xs space-y-0.5 pt-1 text-navy/80 dark:text-lightBlue-100">
                        <p>
                          <span className="font-semibold text-navy/60 dark:text-lightBlue-200">Your Answer:</span>{' '}
                          <span className={res.isCorrect ? 'font-bold text-navy dark:text-white' : 'font-bold text-coral'}>
                            {res.userAnswer || '(none)'}
                          </span>
                        </p>
                        {!res.isCorrect && (
                          <p>
                            <span className="font-semibold text-navy/60 dark:text-lightBlue-200">Correct Answer:</span>{' '}
                            <span className="font-black text-navy dark:text-white">{res.card.answer}</span>
                          </p>
                        )}
                      </div>

                      {res.card.explanation && (
                        <p className="text-xs text-navy/60 dark:text-lightBlue-200 italic pt-1 border-t border-lightBlue-200/40 dark:border-navy-700 mt-2">
                          Note: {res.card.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. ACTIVE QUIZ INTERFACE
  // =========================================================================
  const options =
    currentQuestion?.options ||
    (currentQuestion?.type === 'true-false' ? ['True', 'False'] : []);

  const progressPercent = Math.round(((currentIndex + 1) / quizQuestions.length) * 100);
  const formattedIndex = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(quizQuestions.length).padStart(2, '0');

  // Rotate through 6 pastel colors for quiz questions
  const pastelKey = getPastelByIndex(currentIndex);
  const pastel = getPastelConfig(pastelKey);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 select-none">
      {/* Top Header: Exit Quiz, Question counter, Timer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setQuizStarted(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B6B7B] hover:text-[#16161D] transition-colors"
          >
            <X className="w-4 h-4" />
            Exit Quiz
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#16161D]">
              Question {formattedIndex} <span className="text-[#6B6B7B] font-semibold">/ {formattedTotal}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-white shadow-soft text-[#16161D]">
            <Timer className="w-3.5 h-3.5 text-[#16161D]" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>
        </div>

        {/* Thin rounded progress bar in lavender #B9A6E3 */}
        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden shadow-xs">
          <div
            className="h-full bg-[#B9A6E3] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Large Rounded Pastel Question Card */}
      <div
        className="card-pillowy relative p-7 sm:p-10 space-y-6 overflow-hidden shadow-pillowy"
        style={{
          backgroundColor: pastel.front,
          color: '#16161D',
        }}
      >
        {/* Low-opacity open-book watermark */}
        <div className="absolute right-2 bottom-2 pointer-events-none opacity-[0.08] select-none text-[#16161D]">
          <BookOpen className="w-40 h-40" strokeWidth={1} />
        </div>

        {/* Decorative Sparkle Stars */}
        <svg className="absolute top-8 right-24 w-4 h-4 text-white/70 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <svg className="absolute bottom-12 right-28 w-3 h-3 text-white/60 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>

        {/* Top bar: White circular icon chip + question-number chip + difficulty */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-[#16161D]">
              <BrainCircuit className="w-5 h-5 text-[#16161D]" />
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-white shadow-soft text-xs font-black text-[#16161D]">
              Q {formattedIndex} of {formattedTotal}
            </span>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider text-[#16161D] shadow-xs">
            {selectedDifficulty}
          </span>
        </div>

        {/* Question Text: Bold, dark #16161D, 20-24px, tight leading */}
        <h2 className="text-xl sm:text-2xl font-black text-[#16161D] leading-tight tracking-tight whitespace-pre-line relative z-10">
          {currentQuestion?.question}
        </h2>

        {/* Answer Choices */}
        {options.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 pt-1 relative z-10">
            {options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer =
                option.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase();

              // Default: white pill / rounded-2xl row with circular letter badge tinted in card's color
              let optionStyle =
                'bg-white text-[#16161D] border border-white/80 shadow-soft hover:-translate-y-0.5 hover:bg-white/95';
              let badgeBg = pastel.badge;
              let badgeText = '#16161D';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  // Correct: mint #A8D5C2 background with a green check
                  optionStyle =
                    'bg-[#A8D5C2] text-[#16161D] border-2 border-[#589A80] shadow-soft animate-scale-in font-black';
                  badgeBg = '#589A80';
                  badgeText = '#FFFFFF';
                } else if (isSelected && !isCorrectAnswer) {
                  // Wrong: soft coral #F4B6B6 background with an x icon
                  optionStyle =
                    'bg-[#F4B6B6] text-[#16161D] border-2 border-[#D5554F] shadow-soft animate-scale-in font-black';
                  badgeBg = '#D5554F';
                  badgeText = '#FFFFFF';
                } else {
                  optionStyle = 'bg-white/60 text-[#16161D]/45 border border-transparent';
                  badgeBg = 'rgba(0,0,0,0.06)';
                  badgeText = '#16161D';
                }
              } else if (isSelected) {
                // Selected: lavender #B9A6E3 border/ring with a check icon
                optionStyle =
                  'bg-white text-[#16161D] border-2 border-[#B9A6E3] ring-4 ring-[#B9A6E3]/35 shadow-soft font-black';
                badgeBg = '#B9A6E3';
                badgeText = '#FFFFFF';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 sm:p-5 rounded-2xl text-left text-sm sm:text-base font-bold transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors shadow-xs"
                      style={{
                        backgroundColor: badgeBg,
                        color: badgeText,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>

                  {/* Icon indicators */}
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-[#3A7560] stroke-[2.5] shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-[#A6482F] stroke-[2.5] shrink-0" />
                  )}
                  {!isAnswered && isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#7D64B5] stroke-[2.5] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 pt-1 relative z-10">
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
              className="w-full p-4 rounded-2xl bg-white border-2 border-white shadow-soft text-base font-bold text-[#16161D] placeholder-[#6B6B7B] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/40"
            />
          </div>
        )}

        {/* Feedback Banner */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border space-y-1 animate-scale-in relative z-10 shadow-soft ${
              selectedAnswer?.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ||
              typedAnswer.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase()
                ? 'bg-[#D6EAE1] border-[#A8D5C2] text-[#16161D]'
                : 'bg-[#F9D9CF] border-[#F2B8A8] text-[#16161D]'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedAnswer?.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ||
              typedAnswer.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#3A7560] stroke-[2.5]" />
                  <span className="text-sm font-extrabold text-[#16161D]">
                    Correct! Great retention.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-[#A6482F] stroke-[2.5]" />
                  <span className="text-sm font-extrabold text-[#16161D]">
                    Correct answer: {currentQuestion?.answer}
                  </span>
                </>
              )}
            </div>

            {currentQuestion?.explanation && (
              <p className="text-xs text-[#16161D]/80 leading-relaxed pt-1">
                <span className="font-extrabold">Fact: </span>
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}

        {/* Footer Navigation Buttons: Circular arrow for prev + Action button for Next/Submit */}
        <div className="pt-2 border-t border-black/5 flex items-center justify-between relative z-10">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevQuestion}
            className="w-11 h-11 rounded-full bg-white ring-4 ring-white/60 shadow-soft flex items-center justify-center text-[#16161D] hover:-translate-y-0.5 hover:shadow-pillowy transition-all disabled:opacity-40 disabled:hover:translate-y-0"
            title="Previous Question"
            aria-label="Previous Question"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {!isAnswered ? (
            <button
              type="button"
              disabled={options.length > 0 ? !selectedAnswer : !typedAnswer.trim()}
              onClick={handleSubmitAnswer}
              className="px-6 py-3 rounded-full bg-[#22222B] text-white text-xs font-black shadow-pillowy hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-full bg-[#22222B] text-white text-xs font-black shadow-pillowy hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>{currentIndex + 1 < quizQuestions.length ? 'Next Question' : 'View Results'}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
