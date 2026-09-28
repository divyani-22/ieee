import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, createDeckWithCards, deleteDeck } from './db';
import { Card, Deck, GenerationConfig, StudySessionLog, ViewMode } from './types';
import { generateCardsSmartOrFallback } from './services/webllm';
import { generateCardsFromText } from './services/nlp';
import { SAMPLE_NEUROSCIENCE_TEXT } from './samples/sampleDecks';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { UploadZone } from './features/upload/UploadZone';
import { DeckLibrary } from './features/library/DeckLibrary';
import { DeckDetail } from './features/library/DeckDetail';
import { FlashcardViewer } from './features/study/FlashcardViewer';
import { QuizSession } from './features/quiz/QuizSession';
import { AnalyticsView } from './features/insights/AnalyticsView';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeDeckId, setActiveDeckId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live queries from IndexedDB (Dexie)
  const decks = useLiveQuery(() => db.decks.toArray(), []) || [];
  const allCards = useLiveQuery(() => db.cards.toArray(), []) || [];
  const studyLogs = useLiveQuery(() => db.studyLogs.toArray(), []) || [];

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
  const activeDeck = decks.find(d => d.id === activeDeckId) || null;
  const activeCards = activeDeckId ? cardsByDeckId[activeDeckId] || [] : [];

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

        await createDeckWithCards(
          {
            title: 'Cellular Neuroscience & Action Potentials',
            description: 'Core concepts in resting membrane potential, ion channels, action potentials, and synaptic transmission.',
            sourceType: 'text',
            tags: ['neuroscience', 'biology', 'action-potential'],
            color: 'from-indigo-500 to-purple-600',
          },
          sampleCards
        );
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
      setCurrentView('deck-detail');
      showToast(`Successfully created "${title}" with ${generatedCards.length} cards!`);
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
    setCurrentView('deck-detail');
    showToast(`Imported "${deckData.title}" with ${cardsData.length} cards!`);
  };

  const handleFinishFlashcardSession = async (stats: {
    totalReviewed: number;
    againCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
  }) => {
    if (!activeDeckId) return;
    await db.studyLogs.add({
      deckId: activeDeckId,
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        dueCardsCount={totalDueCardsCount}
        onOpenUpload={() => setCurrentView('home')}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && (
          <UploadZone
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
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

        {currentView === 'deck-detail' && activeDeck && (
          <DeckDetail
            deck={activeDeck}
            cards={activeCards}
            onBack={() => setCurrentView('decks')}
            onStudy={() => setCurrentView('study')}
            onQuiz={() => setCurrentView('quiz')}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onAddCard={handleAddCard}
          />
        )}

        {currentView === 'study' && activeDeck && (
          <FlashcardViewer
            deck={activeDeck}
            cards={activeCards}
            onFinishSession={handleFinishFlashcardSession}
            onUpdateCardSchedule={handleUpdateCard}
            onBack={() => setCurrentView('deck-detail')}
          />
        )}

        {currentView === 'quiz' && activeDeck && (
          <QuizSession
            deck={activeDeck}
            cards={activeCards}
            onFinishQuiz={handleFinishQuizSession}
            onBack={() => setCurrentView('deck-detail')}
          />
        )}

        {currentView === 'insights' && (
          <AnalyticsView
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="glass-panel-elevated px-4 py-3 rounded-2xl shadow-xl border border-indigo-500/30 text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
