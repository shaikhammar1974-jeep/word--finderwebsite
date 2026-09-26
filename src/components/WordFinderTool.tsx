import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, RotateCcw, Volume2, Copy, Check, ArrowUpDown, Sparkles, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { filterWords, sortWordList } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';
import { analytics } from '../utils/seo';

interface WordFinderToolProps {
  initialPattern?: string;
  initialStartsWith?: string;
  initialEndsWith?: string;
  initialInclude?: string;
  initialExclude?: string;
  onSelectWord: (word: string) => void;
  onNavigateCategory?: (path: string) => void;
}

export const WordFinderTool: React.FC<WordFinderToolProps> = ({
  initialPattern = '',
  initialStartsWith = '',
  initialEndsWith = '',
  initialInclude = '',
  initialExclude = '',
  onSelectWord,
  onNavigateCategory
}) => {
  // Tile state for the 5-tile known pattern
  const [tiles, setTiles] = useState<string[]>(() => {
    const arr = ['', '', '', '', ''];
    if (initialPattern) {
      const clean = initialPattern.replace(/\s+/g, '');
      for (let i = 0; i < 5 && i < clean.length; i++) {
        const ch = clean[i];
        if (ch !== '_' && ch !== '*' && ch !== '?' && ch !== '.') {
          arr[i] = ch.toUpperCase();
        }
      }
    }
    return arr;
  });

  const [includeLetters, setIncludeLetters] = useState(initialInclude);
  const [excludeLetters, setExcludeLetters] = useState(initialExclude);
  const [startsWith, setStartsWith] = useState(initialStartsWith);
  const [endsWith, setEndsWith] = useState(initialEndsWith);
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'scrabble' | 'vowels-desc'>('az');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const tileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Tile key handling
  const handleTileChange = (index: number, val: string) => {
    const char = val.slice(-1).replace(/[^a-zA-Z]/g, '').toUpperCase();
    const next = [...tiles];
    next[index] = char;
    setTiles(next);

    // Auto-advance to next tile
    if (char && index < 4) {
      tileRefs[index + 1].current?.focus();
    }
  };

  const handleTileKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !tiles[index] && index > 0) {
      tileRefs[index - 1].current?.focus();
    }
  };

  // Compile active pattern
  const currentPattern = tiles.map(t => (t ? t.toLowerCase() : '_')).join('');
  const hasActivePattern = tiles.some(t => t !== '');

  // Perform search and calculate execution time
  const { results, searchTimeMs } = useMemo(() => {
    const startTime = performance.now();
    const filtered = filterWords({
      pattern: hasActivePattern ? currentPattern : undefined,
      includeLetters,
      excludeLetters,
      startsWith: startsWith || undefined,
      endsWith: endsWith || undefined,
      sortBy
    });
    const endTime = performance.now();
    return {
      results: filtered,
      searchTimeMs: Math.max(0.1, Number((endTime - startTime).toFixed(1)))
    };
  }, [currentPattern, hasActivePattern, includeLetters, excludeLetters, startsWith, endsWith, sortBy]);

  // Log search to analytics on user input
  useEffect(() => {
    if (hasActivePattern || includeLetters || excludeLetters || startsWith || endsWith) {
      const timer = setTimeout(() => {
        analytics.track('word_search', `${currentPattern}|+${includeLetters}|-${excludeLetters}`, {
          count: results.length,
          pattern: currentPattern
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPattern, includeLetters, excludeLetters, startsWith, endsWith, results.length]);

  const handleClear = () => {
    setTiles(['', '', '', '', '']);
    setIncludeLetters('');
    setExcludeLetters('');
    setStartsWith('');
    setEndsWith('');
    tileRefs[0].current?.focus();
  };

  const handleCopy = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1800);
  };

  const handleSpeak = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Preset sample queries for quick user trial
  const samplePresets = [
    { label: '_ A _ _ E', pattern: [' ', 'A', ' ', ' ', 'E'], desc: 'Common A/E ending' },
    { label: 'S _ A _ E', pattern: ['S', ' ', 'A', ' ', 'E'], desc: 'Starts S, ends E' },
    { label: '_ R A _ _', pattern: [' ', 'R', 'A', ' ', ' '], desc: 'RA in middle' },
    { label: 'C _ _ _ T', pattern: ['C', ' ', ' ', ' ', 'T'], desc: 'Starts C, ends T' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden">
      {/* Tool Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Interactive 5 Letter Word Finder</h2>
              <p className="text-xs text-blue-100">Live search powered by positional indexing</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-blue-200 font-medium">Try:</span>
            {samplePresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTiles(preset.pattern.map(ch => ch.trim()));
                  setIncludeLetters('');
                  setExcludeLetters('');
                }}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/25 text-white font-mono font-semibold transition-colors cursor-pointer"
                title={preset.desc}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Row 1: 5-Tile Known Pattern */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>Known Letter Pattern</span>
              <span className="text-xs font-normal text-slate-500">(Type letters in specific positions)</span>
            </label>
            {hasActivePattern && (
              <button
                type="button"
                onClick={() => setTiles(['', '', '', '', ''])}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset tiles
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
            {[0, 1, 2, 3, 4].map((index) => {
              const val = tiles[index];
              return (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Pos {index + 1}
                  </span>
                  <input
                    ref={tileRefs[index]}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleTileChange(index, e.target.value)}
                    onKeyDown={(e) => handleTileKeyDown(index, e)}
                    placeholder="_"
                    className={`w-12 h-14 sm:w-16 sm:h-18 text-center text-2xl sm:text-3xl font-black rounded-xl border-2 uppercase transition-all shadow-xs focus:outline-none ${
                      val
                        ? 'border-blue-600 bg-blue-50/70 text-blue-800 focus:ring-4 focus:ring-blue-500/20'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 placeholder-slate-300'
                    }`}
                    aria-label={`Letter at position ${index + 1}`}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-500 mt-1 font-mono">
            Active Pattern: <strong className="text-blue-700 text-sm tracking-widest">{currentPattern.toUpperCase()}</strong>
          </p>
        </div>

        {/* Row 2: Secondary Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          {/* Include Letters */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Must Include Letters
            </label>
            <div className="relative">
              <input
                type="text"
                value={includeLetters}
                onChange={(e) => setIncludeLetters(e.target.value.replace(/[^a-zA-Z, ]/g, ''))}
                placeholder="e.g. R, A"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold uppercase text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {includeLetters && (
                <button
                  type="button"
                  onClick={() => setIncludeLetters('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  &times;
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Letters that must appear</p>
          </div>

          {/* Exclude Letters */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Exclude Letters
            </label>
            <div className="relative">
              <input
                type="text"
                value={excludeLetters}
                onChange={(e) => setExcludeLetters(e.target.value.replace(/[^a-zA-Z, ]/g, ''))}
                placeholder="e.g. T, L, M"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold uppercase text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
              {excludeLetters && (
                <button
                  type="button"
                  onClick={() => setExcludeLetters('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  &times;
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Letters that cannot appear</p>
          </div>

          {/* Starts With */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Starts With
            </label>
            <input
              type="text"
              maxLength={4}
              value={startsWith}
              onChange={(e) => setStartsWith(e.target.value.replace(/[^a-zA-Z]/g, ''))}
              placeholder="e.g. A or ST"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold uppercase text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">Prefix letters</p>
          </div>

          {/* Ends With */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ends With
            </label>
            <input
              type="text"
              maxLength={4}
              value={endsWith}
              onChange={(e) => setEndsWith(e.target.value.replace(/[^a-zA-Z]/g, ''))}
              placeholder="e.g. E or ED"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold uppercase text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">Suffix letters</p>
          </div>
        </div>

        {/* Buttons & Sort Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                tileRefs[0].current?.focus();
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Find Words
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center gap-1.5 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Clear All
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 text-xs font-semibold uppercase flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="az">A to Z (Alphabetical)</option>
              <option value="za">Z to A (Reverse)</option>
              <option value="scrabble">Scrabble Score (High to Low)</option>
              <option value="vowels-desc">Most Vowels First</option>
            </select>
          </div>
        </div>

        {/* Results Count & Benchmarking Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900 text-sm">{results.length}</span>
            <span>words found</span>
            {hasActivePattern && (
              <span className="hidden sm:inline bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
                matching {currentPattern.toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-slate-400">Search time: {searchTimeMs}ms</span>
        </div>

        {/* Word Grid Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {results.map((word) => {
              const score = calculateScrabbleScore(word);
              const isCopied = copiedWord === word;
              return (
                <div
                  key={word}
                  onClick={() => onSelectWord(word)}
                  className="group relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl p-2.5 transition-all cursor-pointer flex flex-col justify-between"
                  title={`View details & definition for ${word.toUpperCase()}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 uppercase font-mono tracking-wider">
                      {word}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 group-hover:bg-blue-100 group-hover:text-blue-700 text-slate-600 transition-colors"
                      title={`${score} Scrabble points`}
                    >
                      {score} pts
                    </span>
                  </div>

                  {/* Actions Bar on card */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-slate-400 text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(word, e)}
                      className="p-1 hover:text-blue-600 rounded transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleCopy(word, e)}
                      className="p-1 hover:text-emerald-600 rounded transition-colors"
                      title="Copy word"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <span className="text-[11px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Zero Result State with Actionable Guidance */
          <div className="p-8 text-center bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No matching 5-letter words found</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                Your combination of pattern tiles, required letters, and excluded letters is too restrictive.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 max-w-md mx-auto text-left space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-800">Helpful Suggestions to Find Words:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {excludeLetters && (
                  <li>
                    Try removing excluded letters (currently:{' '}
                    <strong className="text-rose-600 uppercase">{excludeLetters}</strong>)
                  </li>
                )}
                {includeLetters && (
                  <li>
                    Try with fewer required letters (currently:{' '}
                    <strong className="text-blue-600 uppercase">{includeLetters}</strong>)
                  </li>
                )}
                {hasActivePattern && (
                  <li>
                    Replace fixed pattern positions with wildcards (<code>_</code>)
                  </li>
                )}
                <li>Check for conflicting constraints (e.g. letter marked both include and exclude)</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-xs hover:bg-blue-700"
              >
                Reset All Filters
              </button>
              {excludeLetters && (
                <button
                  type="button"
                  onClick={() => setExcludeLetters('')}
                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50"
                >
                  Clear Excluded Letters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
