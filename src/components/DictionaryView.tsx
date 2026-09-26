import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Volume2, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { searchDictionary, ALL_WORDS_ARRAY } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';

interface DictionaryViewProps {
  onSelectWord: (word: string) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({ onSelectWord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('a');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Results based on search or active letter
  const displayedWords = useMemo(() => {
    if (searchTerm.trim()) {
      return searchDictionary(searchTerm, 40);
    }
    // Filter by selected letter
    const matching = ALL_WORDS_ARRAY.filter(w => w.startsWith(selectedLetter));
    return matching.map(w => searchDictionary(w, 1)[0]).filter(Boolean);
  }, [searchTerm, selectedLetter]);

  const handleCopy = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1800);
  };

  const handleSpeak = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Verified English Lexicon
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            5-Letter Words Dictionary
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Search verified 5-letter English words with precise definitions, parts of speech, phonetic pronunciations, Scrabble scores, and example sentences.
          </p>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a 5-letter word (e.g. BADGE, CRANE, APPLE)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all uppercase"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* A-Z Alphabetical Filter Bar */}
        {!searchTerm && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Browse by Starting Letter:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedLetter === letter
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dictionary Results Count */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500">
        <span className="font-bold text-slate-800 text-sm">
          {displayedWords.length} Words {searchTerm ? `matching "${searchTerm}"` : `starting with "${selectedLetter.toUpperCase()}"`}
        </span>
        <span className="text-slate-400">Click any card to explore in-depth anagrams and patterns</span>
      </div>

      {/* Dictionary Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedWords.map((entry) => {
          const isCopied = copiedWord === entry.word;
          return (
            <div
              key={entry.word}
              onClick={() => onSelectWord(entry.word)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 uppercase font-mono tracking-wider">
                      {entry.word}
                    </h3>
                    <span className="text-xs font-mono text-slate-400 italic">
                      {entry.pronunciation}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {entry.partOfSpeech}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {entry.scrabbleScore} pts
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  {entry.definition}
                </p>

                {entry.example && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border-l-2 border-blue-400 mb-3">
                    &ldquo;{entry.example}&rdquo;
                  </p>
                )}
              </div>

              {/* Card Footer Breakdown */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    Vowels:{' '}
                    <strong className="text-slate-700 uppercase">
                      {entry.vowels.join(', ') || 'None'}
                    </strong>
                  </span>
                  <span>
                    Consonants:{' '}
                    <strong className="text-slate-700 uppercase">
                      {entry.consonants.join(', ')}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleSpeak(entry.word, e)}
                    className="p-1.5 hover:text-blue-600 rounded transition-colors"
                    title="Pronounce audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(entry.word, e)}
                    className="p-1.5 hover:text-emerald-600 rounded transition-colors"
                    title="Copy word"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <span className="text-blue-600 font-semibold ml-2 flex items-center group-hover:translate-x-0.5 transition-transform">
                    Page &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
