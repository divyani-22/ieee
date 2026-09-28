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
          {/* 1. SIMPLE (Light Blue #AFC7F7) */}
          <div
            onClick={() => setSelectedDifficulty('simple')}
            className={`p-7 rounded-4xl border-2 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-lightBlue-50/80 dark:bg-navy-800/80 hover:-translate-y-1.5 ${
              selectedDifficulty === 'simple'
                ? 'border-lightBlue-400 ring-4 ring-lightBlue-200 shadow-soft-lg'
                : 'border-lightBlue-200/80 hover:border-lightBlue-300 shadow-soft'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-lightBlue-200 dark:bg-navy-700 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-navy dark:text-lightBlue-100" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-navy-700 text-navy dark:text-white shadow-soft">
                  Beginner
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-navy dark:text-white">
                  SIMPLE
                </h3>
                <p className="text-xs font-semibold text-navy/70 dark:text-lightBlue-200 leading-relaxed">
                  Basic concepts and quick practice. Focuses on foundational definitions and direct clozes.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-lightBlue-200/60 dark:border-navy-700">
              <div className="flex items-center justify-between text-xs font-bold text-navy/60 dark:text-lightBlue-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  10 Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  5 Mins
                </span>
              </div>

              <Button
                size="md"
                variant={selectedDifficulty === 'simple' ? 'primary' : 'secondary'}
                onClick={() => startQuizWithDifficulty('simple')}
                className="w-full font-bold shadow-soft"
              >
                Start Quiz
              </Button>
            </div>
          </div>

          {/* 2. INTERMEDIATE (Yellow #FFDC61) */}
          <div
            onClick={() => setSelectedDifficulty('intermediate')}
            className={`p-7 rounded-4xl border-2 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-yellowPastel-50/80 dark:bg-navy-800/80 hover:-translate-y-1.5 ${
              selectedDifficulty === 'intermediate'
                ? 'border-yellowPastel-400 ring-4 ring-yellowPastel-200 shadow-soft-lg'
                : 'border-yellowPastel-200/80 hover:border-yellowPastel-300 shadow-soft'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-yellowPastel-200 dark:bg-navy-700 flex items-center justify-center">
                  <Target className="w-6 h-6 text-navy dark:text-yellowPastel-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-navy-700 text-navy dark:text-white shadow-soft">
                  Moderate
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-navy dark:text-white">
                  INTERMEDIATE
                </h3>
                <p className="text-xs font-semibold text-navy/70 dark:text-lightBlue-200 leading-relaxed">
                  Questions requiring stronger understanding. Balanced multiple-choice and conceptual application.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-yellowPastel-200/60 dark:border-navy-700">
              <div className="flex items-center justify-between text-xs font-bold text-navy/60 dark:text-lightBlue-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  10 Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  8 Mins
                </span>
              </div>

              <Button
                size="md"
                variant={selectedDifficulty === 'intermediate' ? 'yellow' : 'secondary'}
                onClick={() => startQuizWithDifficulty('intermediate')}
                className="w-full font-bold shadow-soft"
              >
                Start Quiz
              </Button>
            </div>
          </div>

          {/* 3. HARD (Coral #F58D87) */}
          <div
            onClick={() => setSelectedDifficulty('hard')}
            className={`p-7 rounded-4xl border-2 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-coral-50/80 dark:bg-navy-800/80 hover:-translate-y-1.5 ${
              selectedDifficulty === 'hard'
                ? 'border-coral ring-4 ring-coral-200 shadow-coral-soft'
                : 'border-coral-200/80 hover:border-coral-300 shadow-soft'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-coral-200 dark:bg-navy-700 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-coral-600 dark:text-coral-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-navy-700 text-coral-600 dark:text-coral-300 shadow-soft">
                  Challenging
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-navy dark:text-white">
                  HARD
                </h3>
                <p className="text-xs font-semibold text-navy/70 dark:text-lightBlue-200 leading-relaxed">
                  Challenging questions requiring deeper understanding. Subtle altered premises & nuanced distractors.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-coral-200/60 dark:border-navy-700">
              <div className="flex items-center justify-between text-xs font-bold text-navy/60 dark:text-lightBlue-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  10 Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  12 Mins
                </span>
              </div>

              <Button
                size="md"
                variant={selectedDifficulty === 'hard' ? 'coral' : 'secondary'}
                onClick={() => startQuizWithDifficulty('hard')}
                className="w-full font-bold shadow-soft"
              >
                Start Quiz
              </Button>
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 select-none">
      {/* Top Header: Question 01 / 10, Progress Bar, Exit Quiz, Timer */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setQuizStarted(false)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/60 dark:text-lightBlue-200 hover:text-navy dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Exit Quiz
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-navy dark:text-white">
            Question {formattedIndex} <span className="text-navy/40 dark:text-lightBlue-200 font-semibold">/ {formattedTotal}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-white dark:bg-navy-800 text-navy dark:text-white border border-lightBlue-100 dark:border-navy-700 shadow-soft">
          <Timer className="w-3.5 h-3.5 text-coral" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-lightBlue-100 dark:bg-navy-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-coral rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Large Rounded Question Card */}
      <div className="bg-white dark:bg-navy-800 rounded-4xl p-6 sm:p-10 border border-lightBlue-100 dark:border-navy-700 shadow-soft-lg space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-lightBlue-100 text-navy">
            {selectedDifficulty.toUpperCase()} LEVEL
          </span>
          <span className="text-xs font-bold text-navy/40 dark:text-lightBlue-200">
            {currentQuestion?.type === 'mcq' ? 'Select 1 of 4 choices' : 'Instant Feedback'}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-black text-navy dark:text-white leading-relaxed whitespace-pre-line">
          {currentQuestion?.question}
        </h2>

        {/* Four Answer Choices (Selected answers use yellow/coral accent colors) */}
        {options.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer =
                option.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase();

              let choiceStyle =
                'bg-pageBg dark:bg-navy-900 border-2 border-lightBlue-100 dark:border-navy-700 text-navy dark:text-white hover:border-lightBlue-300';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  choiceStyle =
                    'bg-lightBlue-100 dark:bg-navy-700 border-2 border-navy text-navy dark:text-white font-black';
                } else if (isSelected && !isCorrectAnswer) {
                  choiceStyle =
                    'bg-coral-100 border-2 border-coral text-coral-700 font-black';
                } else {
                  choiceStyle = 'opacity-40 border-lightBlue-100 text-navy/50';
                }
              } else if (isSelected) {
                // Selected accent state (Yellow / Coral accent styling as requested)
                choiceStyle =
                  'bg-yellowPastel-100 dark:bg-yellowPastel-950/40 border-2 border-yellowPastel-400 text-navy dark:text-white font-black ring-2 ring-yellowPastel-300 shadow-soft';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 sm:p-5 rounded-2xl text-left text-sm sm:text-base font-bold transition-all duration-150 flex items-center justify-between ${choiceStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white dark:bg-navy-800 text-navy dark:text-white border border-lightBlue-200 dark:border-navy-600 flex items-center justify-center text-xs font-black shadow-sm shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-navy dark:text-white shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-coral shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
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
              className="w-full p-4 rounded-2xl bg-pageBg dark:bg-navy-900 border-2 border-lightBlue-200 dark:border-navy-700 text-base font-bold text-navy dark:text-white placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
        )}

        {/* Feedback Banner */}
        {isAnswered && (
          <div
            className={`p-4 rounded-3xl border space-y-1 animate-fade-in ${
              selectedAnswer?.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ||
              typedAnswer.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase()
                ? 'bg-lightBlue-100/70 border-lightBlue-300'
                : 'bg-coral-100/70 border-coral-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedAnswer?.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ||
              typedAnswer.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase() ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-navy" />
                  <span className="text-sm font-black text-navy">
                    Correct! Great retention.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-coral" />
                  <span className="text-sm font-black text-coral-800">
                    The correct answer is: {currentQuestion?.answer}
                  </span>
                </>
              )}
            </div>

            {currentQuestion?.explanation && (
              <p className="text-xs text-navy/80 leading-relaxed pt-0.5">
                <span className="font-bold">Fact: </span>
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}

        {/* Footer Navigation Buttons: Previous Button & Next / Submit Button */}
        <div className="pt-4 border-t border-lightBlue-100 dark:border-navy-700 flex items-center justify-between">
          <Button
            variant="secondary"
            size="md"
            disabled={currentIndex === 0}
            onClick={handlePrevQuestion}
            className="font-bold text-xs"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {!isAnswered ? (
            <Button
              variant="coral"
              size="md"
              disabled={options.length > 0 ? !selectedAnswer : !typedAnswer.trim()}
              onClick={handleSubmitAnswer}
              className="font-black text-xs px-6 shadow-coral-soft"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleNextQuestion}
              className="font-black text-xs px-6 shadow-soft"
            >
              {currentIndex + 1 < quizQuestions.length ? 'Next Question' : 'View Results'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
