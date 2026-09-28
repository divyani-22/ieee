import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Cpu,
  Layers,
  FileCode,
  Edit3,
  Trash2,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Button } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { ProgressBar } from '../../components/ProgressBar';
import { CardType, GenerationConfig, IngestionFileProgress } from '../../types';
import { processIngestionFile } from '../../services/ingestion';
import { SAMPLE_NEUROSCIENCE_TEXT, SAMPLE_BIOLOGY_TEXT } from '../../samples/sampleDecks';

export interface UploadZoneProps {
  onGenerate: (
    title: string,
    extractedText: string,
    config: GenerationConfig,
    sourceType: 'pdf' | 'image' | 'text' | 'markdown' | 'multi'
  ) => Promise<void>;
  isGenerating: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [filesProgress, setFilesProgress] = useState<IngestionFileProgress[]>([]);
  const [previewText, setPreviewText] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Generation Settings
  const [density, setDensity] = useState<number>(5);
  const [selectedTypes, setSelectedTypes] = useState<CardType[]>([
    'definition',
    'cloze',
    'mcq',
    'true-false',
  ]);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [smartMode, setSmartMode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (!deckTitle) {
      const baseName = fileArray[0].name.replace(/\.[^/.]+$/, '');
      setDeckTitle(baseName.replace(/[-_]/g, ' '));
    }

    const newProgressList: IngestionFileProgress[] = fileArray.map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'queued',
      progress: 0,
      extractedText: '',
    }));

    setFilesProgress(prev => [...prev, ...newProgressList]);

    let combinedAccumulatedText = previewText;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const progItem = newProgressList[i];

      try {
        const text = await processIngestionFile(file, update => {
          setFilesProgress(curr =>
            curr.map(p => (p.id === progItem.id ? { ...p, ...update } : p))
          );
        });

        combinedAccumulatedText = (combinedAccumulatedText + '\n\n' + text).trim();
        setPreviewText(combinedAccumulatedText);
      } catch (err: any) {
        setFilesProgress(curr =>
          curr.map(p =>
            p.id === progItem.id
              ? { ...p, status: 'error', error: err.message || 'Processing failed' }
              : p
          )
        );
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const loadSample = (type: 'neuro' | 'bio' | 'pdf') => {
    if (type === 'neuro') {
      setDeckTitle('Neuroscience & Action Potentials');
      setPastedText(SAMPLE_NEUROSCIENCE_TEXT);
      setPreviewText(SAMPLE_NEUROSCIENCE_TEXT);
      setActiveTab('paste');
    } else if (type === 'bio') {
      setDeckTitle('Cellular Energetics & Genetics');
      setPastedText(SAMPLE_BIOLOGY_TEXT);
      setPreviewText(SAMPLE_BIOLOGY_TEXT);
      setActiveTab('paste');
    } else if (type === 'pdf') {
      fetch('/samples/sample-lecture.pdf')
        .then(res => res.blob())
        .then(blob => {
          const testFile = new File([blob], 'sample-lecture.pdf', { type: 'application/pdf' });
          handleFiles([testFile]);
        })
        .catch(err => console.error('Sample fetch error:', err));
    }
  };

  const toggleType = (t: CardType) => {
    setSelectedTypes(prev =>
      prev.includes(t) ? (prev.length > 1 ? prev.filter(x => x !== t) : prev) : [...prev, t]
    );
  };

  const readyToGenerate =
    (activeTab === 'upload' && previewText.trim().length > 30) ||
    (activeTab === 'paste' && pastedText.trim().length > 30);

  const handleStartGeneration = () => {
    const textToUse = activeTab === 'paste' ? pastedText : previewText;
    const titleToUse = deckTitle.trim() || 'Lecture Study Deck';
    const sourceType =
      activeTab === 'paste' ? 'text' : filesProgress.length > 1 ? 'multi' : 'pdf';

    onGenerate(
      titleToUse,
      textToUse,
      {
        density,
        cardTypes: selectedTypes,
        difficulty,
        useSmartMode: smartMode,
      },
      sourceType
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Server Overhead • Completely In-Browser & Private</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Turn Lecture Material into{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Mastery Decks
          </span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Drop your lecture slides, scanned book pages, or notes. Recall automatically extracts text, runs OCR in a Web Worker, and crafts high-retention flashcards and quizzes without sending your data anywhere.
        </p>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-medium text-zinc-400">Quick Test:</span>
          <button
            type="button"
            onClick={() => loadSample('neuro')}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-100 hover:bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            🧠 Neuroscience Notes
          </button>
          <button
            type="button"
            onClick={() => loadSample('bio')}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-100 hover:bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            🧬 Cell Biology Markdown
          </button>
          <button
            type="button"
            onClick={() => loadSample('pdf')}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-100 hover:bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            📄 Sample PDF Document
          </button>
        </div>
      </div>

      {/* Main Ingestion Container */}
      <GlassCard elevated className="p-6 sm:p-8 space-y-6">
        {/* Deck Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Deck Title
          </label>
          <input
            type="text"
            placeholder="e.g., Computer Architecture Lecture 3 or Organic Chemistry Quiz"
            value={deckTitle}
            onChange={e => setDeckTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
          />
        </div>

        {/* Input Mode Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            File Upload & OCR (PDF, Images, TXT)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Paste Raw Lecture Notes
          </button>
        </div>

        {/* Mode 1: File Dropzone */}
        {activeTab === 'upload' ? (
          <div className="space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md"
                className="hidden"
                onChange={e => e.target.files && handleFiles(e.target.files)}
              />

              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  Click to browse or drag and drop lecture files
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Supports Digital & Scanned PDFs, Photos of notes (OCR), TXT, Markdown
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> PDF & Text
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" /> Camera OCR
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Auto Scanned Detection
                </span>
              </div>
            </div>

            {/* Ingestion Files Progress List */}
            {filesProgress.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span>Processed Files ({filesProgress.length})</span>
                  {previewText && (
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 normal-case"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Preview / Edit Extracted Text ({previewText.split(/\s+/).length} words)
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {filesProgress.map(file => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                          {file.name.endsWith('.pdf') ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                            <span>{(file.size / 1024).toFixed(0)} KB</span>
                            {file.pageCount && <span>• {file.pageCount} pages</span>}
                            {file.scannedPagesDetected ? (
                              <span className="text-amber-500 font-medium">
                                • {file.scannedPagesDetected} OCR rasterized
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="w-36 text-right shrink-0">
                        {file.status === 'done' ? (
                          <div className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Ready
                          </div>
                        ) : file.status === 'error' ? (
                          <div className="flex items-center justify-end gap-1 text-xs font-medium text-rose-500">
                            <AlertCircle className="w-4 h-4" /> Error
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400">
                              <span className="capitalize">{file.status}...</span>
                              <span>{file.progress}%</span>
                            </div>
                            <ProgressBar progress={file.progress} color="bg-indigo-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mode 2: Paste Text */
          <div className="space-y-3">
            <textarea
              rows={8}
              placeholder="Paste lecture notes, study guides, chapter transcripts, or markdown here..."
              value={pastedText}
              onChange={e => {
                setPastedText(e.target.value);
                setPreviewText(e.target.value);
              }}
              className="w-full p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs leading-relaxed"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{pastedText ? `${pastedText.split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
              <span>Minimum ~30 words recommended</span>
            </div>
          </div>
        )}

        {/* Generation Settings Panel */}
        <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Sliders className="w-4 h-4 text-indigo-500" /> Generation Engine Tuning
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Density Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <span>Card Density (per section):</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  {density} cards / section
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={density}
                onChange={e => setDensity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Concise (2)</span>
                <span>Balanced (5)</span>
                <span>Exhaustive (10)</span>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Target Difficulty:
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                      difficulty === d
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card Types Selection */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Interactive Card Modes to Synthesize:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { type: 'definition' as CardType, label: 'Definitions', desc: '"X is defined as Y"' },
                { type: 'cloze' as CardType, label: 'Cloze Fill', desc: 'Syntactic blanks' },
                { type: 'mcq' as CardType, label: '4-Choice MCQ', desc: 'Smart distractors' },
                { type: 'true-false' as CardType, label: 'True / False', desc: 'Fact vs altered premise' },
              ].map(item => {
                const active = selectedTypes.includes(item.type);
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => toggleType(item.type)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500'
                        : 'bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {item.label}
                      </span>
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                          active ? 'bg-indigo-600 text-white' : 'border border-zinc-400'
                        }`}
                      >
                        {active && '✓'}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Smart Mode (WebLLM) Toggle */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Smart Mode (WebGPU In-Browser AI)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold uppercase">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Uses device GPU for semantic depth. Gracefully falls back to instant local NLP if unavailable.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smartMode}
                onChange={e => setSmartMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Generate Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            {readyToGenerate ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Content verified and ready for generation
              </span>
            ) : (
              <span>Upload lecture documents or paste notes above to continue</span>
            )}
          </div>

          <Button
            size="lg"
            variant="primary"
            disabled={!readyToGenerate || isGenerating}
            loading={isGenerating}
            onClick={handleStartGeneration}
            className="w-full sm:w-auto shadow-lg shadow-indigo-500/25 px-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Flashcards & Quizzes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </GlassCard>

      {/* Extracted Text Preview / Edit Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel-elevated w-full max-w-2xl rounded-3xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-500" />
                Preview & Edit Extracted Document Text
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              >
                Done
              </button>
            </div>

            <textarea
              rows={14}
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto flex-1 text-zinc-800 dark:text-zinc-200"
            />

            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>{previewText.split(/\s+/).filter(Boolean).length} words ready</span>
              <Button size="sm" variant="primary" onClick={() => setIsPreviewOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
