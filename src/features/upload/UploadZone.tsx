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
        {/* Header */}
        <div className="text-center space-y-3 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lightBlue-100/70 text-navy-800 text-xs font-bold border border-lightBlue-200">
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
            <span>Zero Server Overhead • 100% In-Browser & Private</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            Upload Lecture Notes & PDFs
          </h2>
          <p className="text-navy-700/70 dark:text-zinc-300 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
            Drop your lecture slides, scanned notes, or paste text. Recall extracts content, runs OCR client-side, and generates flipable flashcards and quizzes instantly.
          </p>

          {/* Quick Sample Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Try Sample:</span>
            <button
              type="button"
              onClick={() => loadSample('neuro')}
              className="text-xs font-bold px-3.5 py-1.5 rounded-2xl bg-white dark:bg-navy-800 hover:bg-lightBlue-50 text-navy-800 dark:text-zinc-200 border border-lightBlue-200/80 shadow-soft transition-all"
            >
              🧠 Neuroscience Notes
            </button>
            <button
              type="button"
              onClick={() => loadSample('bio')}
              className="text-xs font-bold px-3.5 py-1.5 rounded-2xl bg-white dark:bg-navy-800 hover:bg-lightBlue-50 text-navy-800 dark:text-zinc-200 border border-lightBlue-200/80 shadow-soft transition-all"
            >
              🧬 Cell Biology Notes
            </button>
            <button
              type="button"
              onClick={() => loadSample('pdf')}
              className="text-xs font-bold px-3.5 py-1.5 rounded-2xl bg-white dark:bg-navy-800 hover:bg-lightBlue-50 text-navy-800 dark:text-zinc-200 border border-lightBlue-200/80 shadow-soft transition-all"
            >
              📄 Sample Lecture PDF
            </button>
          </div>
        </div>

        {/* Main Ingestion Container */}
        <div className="bg-white dark:bg-navy-850 rounded-4xl p-6 sm:p-8 space-y-6 shadow-soft border border-lightBlue-100 dark:border-navy-700">
          {/* Deck Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-zinc-400">
              Deck Title
            </label>
            <input
              type="text"
              placeholder="e.g., Cellular Neuroscience or Bioenergetics Quiz"
              value={deckTitle}
              onChange={e => setDeckTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-pageBg/60 dark:bg-navy-900 border border-lightBlue-200/80 dark:border-navy-700 text-navy-900 dark:text-white placeholder-navy-300 font-semibold focus:outline-none focus:ring-2 focus:ring-coral-400 transition-all"
            />
          </div>

          {/* Input Mode Tabs */}
          <div className="flex gap-2 p-1.5 bg-pageBg dark:bg-navy-900 rounded-2xl border border-lightBlue-200/60 dark:border-navy-800">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-navy-800 text-navy-900 dark:text-white shadow-soft'
                  : 'text-navy-600 dark:text-zinc-400 hover:text-navy-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-coral-500" />
              File Upload & OCR (PDF, Images, TXT)
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-navy-800 text-navy-900 dark:text-white shadow-soft'
                  : 'text-navy-600 dark:text-zinc-400 hover:text-navy-900'
              }`}
            >
              <Edit3 className="w-4 h-4 text-lightBlue-500" />
              Paste Lecture Notes
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
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-coral-400 bg-coral-50/50 dark:bg-navy-800 scale-[0.99]'
                  : 'border-lightBlue-200 dark:border-navy-700 hover:border-coral-300 bg-pageBg/40 dark:bg-navy-900/40'
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

              <div className="w-16 h-16 rounded-3xl bg-lightBlue-100 text-navy-800 flex items-center justify-center shadow-soft">
                <UploadCloud className="w-8 h-8 text-navy-900" />
              </div>

              <div>
                <p className="text-base sm:text-lg font-bold text-navy-900 dark:text-white">
                  Click to browse or drag and drop lecture files
                </p>
                <p className="text-xs sm:text-sm text-navy-600/70 dark:text-zinc-400 mt-1 font-medium">
                  Supports Digital & Scanned PDFs, Photos of notes (OCR), TXT, Markdown
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-navy-400 pt-2">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-navy-600" /> PDF & Text
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-coral-500" /> Camera OCR
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-lightBlue-600" /> Auto Scanned Detection
                </span>
              </div>
            </div>

            {/* Ingestion Files Progress List */}
            {filesProgress.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-navy-500 uppercase tracking-wider">
                  <span>Processed Files ({filesProgress.length})</span>
                  {previewText && (
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="text-navy-800 dark:text-lightBlue-300 hover:underline flex items-center gap-1 font-bold normal-case"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-coral-500" /> Preview / Edit Extracted Text ({previewText.split(/\s+/).length} words)
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {filesProgress.map(file => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-navy-800 border border-lightBlue-100 dark:border-navy-700 shadow-soft flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-lightBlue-100 text-navy-900 shrink-0">
                          {file.name.endsWith('.pdf') ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-navy-900 dark:text-zinc-200 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-navy-500 mt-0.5 font-medium">
                            <span>{(file.size / 1024).toFixed(0)} KB</span>
                            {file.pageCount && <span>• {file.pageCount} pages</span>}
                            {file.scannedPagesDetected ? (
                              <span className="text-yellow-600 font-bold">
                                • {file.scannedPagesDetected} OCR rasterized
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="w-36 text-right shrink-0">
                        {file.status === 'done' ? (
                          <div className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Ready
                          </div>
                        ) : file.status === 'error' ? (
                          <div className="flex items-center justify-end gap-1 text-xs font-bold text-coral-500">
                            <AlertCircle className="w-4 h-4" /> Error
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-navy-400 font-bold">
                              <span className="capitalize">{file.status}...</span>
                              <span>{file.progress}%</span>
                            </div>
                            <ProgressBar progress={file.progress} color="bg-coral-500" />
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
              className="w-full p-4 rounded-2xl bg-pageBg/60 dark:bg-navy-900 border border-lightBlue-200 dark:border-navy-700 text-navy-900 dark:text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-400 font-mono text-xs leading-relaxed"
            />
            <div className="flex justify-between text-xs text-navy-500 font-medium">
              <span>{pastedText ? `${pastedText.split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
              <span>Minimum ~30 words recommended</span>
            </div>
          </div>
        )}

        {/* Generation Settings Panel */}
        <div className="pt-4 border-t border-lightBlue-100 dark:border-navy-800 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-600 dark:text-zinc-400">
            <Sliders className="w-4 h-4 text-coral-500" /> Generation Engine Tuning
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Density Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-navy-900 dark:text-zinc-300">
                <span>Card Density (per section):</span>
                <span className="px-2.5 py-0.5 rounded-full bg-lightBlue-100 text-navy-900 font-extrabold text-xs">
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
                className="w-full accent-coral-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-navy-400">
                <span>Concise (2)</span>
                <span>Balanced (5)</span>
                <span>Exhaustive (10)</span>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-navy-900 dark:text-zinc-300">
                Target Difficulty:
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                      difficulty === d
                        ? 'bg-navy-900 text-white border-navy-900 shadow-soft'
                        : 'bg-pageBg dark:bg-navy-800 text-navy-700 dark:text-zinc-400 border-lightBlue-200/80 hover:bg-lightBlue-50'
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
            <div className="text-xs font-bold text-navy-900 dark:text-zinc-300">
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
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      active
                        ? 'bg-lightBlue-50/90 dark:bg-navy-800 border-navy-900 dark:border-lightBlue-400 shadow-soft'
                        : 'bg-pageBg/40 dark:bg-navy-900/40 border-lightBlue-200/70 dark:border-navy-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-navy-900 dark:text-zinc-100">
                        {item.label}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          active ? 'bg-navy-900 text-white' : 'border border-navy-300'
                        }`}
                      >
                        {active && '✓'}
                      </div>
                    </div>
                    <p className="text-[11px] text-navy-600/70 font-medium">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Smart Mode (WebLLM) Toggle */}
          <div className="p-4 rounded-3xl bg-lightBlue-50/70 dark:bg-navy-800 border border-lightBlue-200/80 dark:border-navy-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-coral-100 text-coral-600 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-navy-900 dark:text-zinc-100">
                    Smart Mode (WebGPU In-Browser AI)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellowPastel text-navy-900 font-extrabold uppercase">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-navy-600/70 dark:text-zinc-400 font-medium">
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
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-coral-500"></div>
            </label>
          </div>
        </div>

        {/* Generate Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-navy-500 font-medium">
            {readyToGenerate ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Content verified and ready for generation
              </span>
            ) : (
              <span>Upload lecture documents or paste notes above to continue</span>
            )}
          </div>

          <Button
            size="lg"
            variant="coral"
            disabled={!readyToGenerate || isGenerating}
            loading={isGenerating}
            onClick={handleStartGeneration}
            className="w-full sm:w-auto shadow-coral-soft px-8 text-white font-bold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Flipable Flashcards & Quizzes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

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
