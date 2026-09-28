import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, createDeckWithCards, deleteDeck } from './db';
import { Card, Deck, GenerationConfig, QuizDifficultyLevel, StudySessionLog, ViewMode } from './types';
import { generateCardsSmartOrFallback } from './services/webllm';
import { generateCardsFromText } from './services/nlp';
import { SAMPLE_NEUROSCIENCE_TEXT } from './samples/sampleDecks';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { HeroSection } from './features/landing/HeroSection';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { UploadZone } from './features/upload/UploadZone';
import { DeckLibrary } from './features/library/DeckLibrary';
import { DeckDetail } from './features/library/DeckDetail';
import { FlashcardViewer } from './features/study/FlashcardViewer';
import { QuizSession } from './features/quiz/QuizSession';
import { BookmarksPage } from './features/bookmarks/BookmarksPage';
import { ProgressPage } from './features/progress/ProgressPage';
import { EmptyState } from './components/EmptyState';
import { Target, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeDeckId, setActiveDeckId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Star features state
  const [quizDifficultyLevel, setQuizDifficultyLevel] = useState<QuizDifficultyLevel>('intermediate');
  const [isReviewingBookmarks, setIsReviewingBookmarks] = useState(false);

  // Live queries from IndexedDB (Dexie)
  const decks = useLiveQuery(() => db.decks.toArray(), []) || [];
  const allCards = useLiveQuery(() => db.cards.toArray(), []) || [];
  const studyLogs = useLiveQuery(() => db.studyLogs.toArray(), []) || [];

  // Bookmarked cards across all decks
  const bookmarkedCards = React.useMemo(() => {
    return allCards.filter(c => !!c.bookmarked);
  }, [allCards]);

  // Map cards by deckId
  const cardsByDeckId = React.useMemo(() => {
    const map: Record<number, Card[]> = {};
    for (const card of allCards) {
      if (!map[card.deckId]) map[card.deckId] = [];
      map[card.deckId].push(card);
    }
    return map;
  }, [allCards]);

  // Total due cards across all decks for today
  const todayStr = new Date().toISOString().slice(0, 10);
  const totalDueCardsCount = allCards.filter(c => c.dueDate <= todayStr).length;

  // Active deck & active cards
  const activeDeck = (activeDeckId ? decks.find(d => d.id === activeDeckId) : decks[0]) || null;
  const activeCards = activeDeck ? cardsByDeckId[activeDeck.id!] || [] : [];

  // Seed sample deck on first launch if empty
  useEffect(() => {
    async function seedInitialDeck() {
      const count = await db.decks.count();
      if (count === 0) {
        const sampleCards = generateCardsFromText(SAMPLE_NEUROSCIENCE_TEXT, {
          density: 5,
          cardTypes: ['definition', 'cloze', 'mcq', 'true-false'],
          difficulty: 'all',
          useSmartMode: false,
        });

        // Pre-mark two cards as bookmarked so the user sees My Bookmarks populated right away
        const seededCards = sampleCards.map((c, idx) => {
          if (idx === 1 || idx === 3) {
            return {
              ...c,
              bookmarked: true,
              bookmarkedAt: new Date().toISOString(),
            };
          }
          return c;
        });

        const newId = await createDeckWithCards(
          {
            title: 'Cellular Neuroscience & Action Potentials',
            description: 'Core concepts in resting membrane potential, ion channels, action potentials, and synaptic transmission.',
            sourceType: 'text',
            tags: ['neuroscience', 'biology', 'action-potential'],
            color: 'from-indigo-500 to-purple-600',
          },
          seededCards
        );
        setActiveDeckId(newId);
      }
    }
    seedInitialDeck();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generation Handler
  const handleGenerate = async (
    title: string,
    extractedText: string,
    config: GenerationConfig,
    sourceType: 'pdf' | 'image' | 'text' | 'markdown' | 'multi'
  ) => {
    setIsGenerating(true);
    try {
      const generatedCards = await generateCardsSmartOrFallback(extractedText, config);

      if (generatedCards.length === 0) {
        showToast('Could not extract enough sentences. Try increasing document length.');
        setIsGenerating(false);
        return;
      }

      const deckId = await createDeckWithCards(
        {
          title,
          description: `Auto-generated deck containing ${generatedCards.length} interactive cards.`,
          sourceType,
          tags: ['lecture', 'auto-generated'],
          color: 'from-indigo-500 to-violet-600',
        },
        generatedCards
      );

      setActiveDeckId(deckId);
      setIsReviewingBookmarks(false);
      setCurrentView('study');
      showToast(`Generated "${title}" with ${generatedCards.length} flipable flashcards!`);
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast(`Generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateCard = async (card: Card) => {
    if (card.id) {
      await db.cards.put(card);
    }
  };

  const handleToggleBookmark = async (card: Card, bookmarked: boolean) => {
    if (card.id) {
      await db.cards.update(card.id, {
        bookmarked,
        bookmarkedAt: bookmarked ? new Date().toISOString() : undefined,
      });
      showToast(bookmarked ? '🔖 Added to My Bookmarks' : 'Removed from Bookmarks');
    }
  };

  const handleRemoveBookmark = async (cardId: number) => {
    await db.cards.update(cardId, {
      bookmarked: false,
      bookmarkedAt: undefined,
    });
    showToast('Bookmark removed from concept');
  };

  const handleDeleteCard = async (cardId: number) => {
    await db.cards.delete(cardId);
    if (activeDeckId) {
      const remainingCount = await db.cards.where('deckId').equals(activeDeckId).count();
      await db.decks.update(activeDeckId, { totalCards: remainingCount });
    }
    showToast('Card deleted');
  };

  const handleAddCard = async (cardData: Omit<Card, 'id' | 'deckId'>) => {
    if (!activeDeckId) return;
    await db.cards.add({
      ...cardData,
      deckId: activeDeckId,
    } as Card);

    const count = await db.cards.where('deckId').equals(activeDeckId).count();
    await db.decks.update(activeDeckId, { totalCards: count });
    showToast('New card added to deck');
  };

  const handleDeleteDeck = async (deckId: number) => {
    await deleteDeck(deckId);
    if (activeDeckId === deckId) {
      setActiveDeckId(null);
      setCurrentView('decks');
    }
    showToast('Deck deleted');
  };

  const handleImportDeck = async (
    deckData: Omit<Deck, 'id' | 'totalCards' | 'createdAt' | 'updatedAt'>,
    cardsData: Omit<Card, 'id' | 'deckId'>[]
  ) => {
    const deckId = await createDeckWithCards(deckData, cardsData);
    setActiveDeckId(deckId);
    setIsReviewingBookmarks(false);
    setCurrentView('study');
    showToast(`Imported "${deckData.title}" with ${cardsData.length} flipable flashcards!`);
  };

  const handleFinishFlashcardSession = async (stats: {
    totalReviewed: number;
    againCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
  }) => {
    if (!activeDeckId && !isReviewingBookmarks) return;
    await db.studyLogs.add({
      deckId: activeDeckId || (decks[0]?.id || 1),
      mode: 'flashcards',
      date: new Date().toISOString(),
      totalReviewed: stats.totalReviewed,
      correctCount: stats.goodCount + stats.easyCount,
      againCount: stats.againCount,
      hardCount: stats.hardCount,
      goodCount: stats.goodCount,
      easyCount: stats.easyCount,
      durationSeconds: stats.totalReviewed * 6,
    });
  };

  const handleFinishQuizSession = async (stats: {
    totalQuestions: number;
    score: number;
    durationSeconds: number;
    weakTopics: string[];
  }) => {
    if (!activeDeckId) return;
    await db.studyLogs.add({
      deckId: activeDeckId,
      mode: 'quiz',
      date: new Date().toISOString(),
      totalReviewed: stats.totalQuestions,
      correctCount: stats.score,
      durationSeconds: stats.durationSeconds,
      weakTopics: stats.weakTopics,
    });
  };

  // Launch Star Feature Actions
  const handleLaunchQuizWithLevel = (difficulty: QuizDifficultyLevel) => {
    if (decks.length > 0 && !activeDeckId) {
      setActiveDeckId(decks[0].id!);
    }
    setQuizDifficultyLevel(difficulty);
    setCurrentView('quiz');
  };

  const handleLaunchFlashcards = () => {
    if (decks.length > 0 && !activeDeckId) {
      setActiveDeckId(decks[0].id!);
    }
    setIsReviewingBookmarks(false);
    setCurrentView('study');
  };

  const handleReviewAllBookmarks = () => {
    setIsReviewingBookmarks(true);
    setCurrentView('study');
  };

  // Virtual deck for Bookmarks Review
  const bookmarksVirtualDeck: Deck = {
    id: 999999,
    title: 'My Bookmarked Concepts',
    description: 'Targeted revision for concepts previously marked as not remembered.',
    sourceType: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalCards: bookmarkedCards.length,
    tags: ['bookmarks', 'revision'],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Navigation Header with Live Bookmarks & Due Badges */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          setIsReviewingBookmarks(false);
          setCurrentView(v);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        dueCardsCount={totalDueCardsCount}
        bookmarkedCount={bookmarkedCards.length}
        totalCardsCount={allCards.length}
        onOpenUpload={() => {
          setIsReviewingBookmarks(false);
          setCurrentView('home');
          setTimeout(() => {
            document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && (
          <div className="space-y-12">
            {/* Landing Hero Section with Visual Floating Screens */}
            <HeroSection
              onStartLearning={() => {
                if (decks.length > 0) {
                  handleLaunchFlashcards();
                } else {
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onExploreFeatures={() => {
                document.getElementById('dashboard-overview')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Dashboard Overview Cards */}
            <div id="dashboard-overview">
              <DashboardOverview
                studentName="Alex"
                totalCards={allCards.length}
                bookmarkedCount={bookmarkedCards.length}
                dueCardsCount={totalDueCardsCount}
                onOpenQuiz={() => handleLaunchQuizWithLevel('intermediate')}
                onOpenFlashcards={handleLaunchFlashcards}
                onOpenBookmarks={() => setCurrentView('bookmarks')}
                onReviewAllBookmarks={handleReviewAllBookmarks}
                onOpenUpload={() => {
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* Ingestion & Upload Zone */}
            <div id="upload-section">
              <UploadZone
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        )}

        {currentView === 'bookmarks' && (
          <BookmarksPage
            bookmarkedCards={bookmarkedCards}
            decks={decks}
            onRemoveBookmark={handleRemoveBookmark}
            onReviewAll={handleReviewAllBookmarks}
            onNavigateToDecks={() => setCurrentView('decks')}
          />
        )}

        {currentView === 'decks' && (
          <DeckLibrary
            decks={decks}
            cardsByDeckId={cardsByDeckId}
            onSelectDeck={(deckId) => {
              setActiveDeckId(deckId);
              setCurrentView('deck-detail');
            }}
            onStudyDeck={(deckId) => {
              setActiveDeckId(deckId);
              setIsReviewingBookmarks(false);
              setCurrentView('study');
            }}
            onQuizDeck={(deckId) => {
              setActiveDeckId(deckId);
              setCurrentView('quiz');
            }}
            onDeleteDeck={handleDeleteDeck}
            onImportDeck={handleImportDeck}
            onOpenUpload={() => setCurrentView('home')}
          />
        )}

        {currentView === 'deck-detail' && (
          activeDeck ? (
            <DeckDetail
              deck={activeDeck}
              cards={activeCards}
              onBack={() => setCurrentView('decks')}
              onStudy={() => {
                setIsReviewingBookmarks(false);
                setCurrentView('study');
              }}
              onQuiz={() => setCurrentView('quiz')}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
              onAddCard={handleAddCard}
            />
          ) : (
            <EmptyState
              icon={<Layers className="w-8 h-8 text-indigo-500" />}
              title="Deck Not Found"
              description="The selected deck is not available or was deleted."
              actionText="Go to Library"
              onAction={() => setCurrentView('decks')}
            />
          )
        )}

        {currentView === 'study' && (
          <FlashcardViewer
            deck={isReviewingBookmarks ? bookmarksVirtualDeck : (activeDeck || bookmarksVirtualDeck)}
            cards={isReviewingBookmarks ? bookmarkedCards : activeCards}
            onFinishSession={handleFinishFlashcardSession}
            onUpdateCardSchedule={handleUpdateCard}
            onToggleBookmark={handleToggleBookmark}
            showToast={showToast}
            onBack={() => {
              if (isReviewingBookmarks) {
                setIsReviewingBookmarks(false);
                setCurrentView('bookmarks');
              } else {
                setCurrentView('deck-detail');
              }
            }}
          />
        )}

        {currentView === 'quiz' && (
          activeDeck ? (
            <QuizSession
              deck={activeDeck}
              cards={activeCards}
              initialDifficulty={quizDifficultyLevel}
              onFinishQuiz={handleFinishQuizSession}
              onBack={() => setCurrentView(activeDeckId ? 'deck-detail' : 'home')}
            />
          ) : (
            <EmptyState
              icon={<Target className="w-8 h-8 text-amber-500" />}
              title="No Decks Available for Quiz"
              description="Create or upload a study deck first to test your retention across Simple, Intermediate, and Hard difficulty levels."
              actionText="Create Deck"
              onAction={() => setCurrentView('home')}
            />
          )
        )}

        {currentView === 'insights' && (
          <ProgressPage
            decks={decks}
            allCards={allCards}
            studyLogs={studyLogs}
            onSelectDeck={(deckId) => {
              setActiveDeckId(deckId);
              setCurrentView('deck-detail');
            }}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-none">
          <div className="bg-navy-900 text-white px-5 py-3 rounded-2xl shadow-soft-lg border border-navy-700 text-xs font-bold flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-coral-400 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
