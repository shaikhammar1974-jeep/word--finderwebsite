import React, { useState } from 'react';
import { Volume2, Copy, Check, Sparkles, ArrowLeft, BookOpen, Shuffle, Grid, Hash, Share2 } from 'lucide-react';
import { getWordDetails } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';

interface WordDetailPageProps {
  word: string;
  onNavigate: (path: string) => void;
  onSelectWord: (word: string) => void;
}

export const WordDetailPage: React.FC<WordDetailPageProps> = ({ word, onNavigate, onSelectWord }) => {
  const [copied, setCopied] = useState(false);
  const details = getWordDetails(word);
  const uppercaseWord = word.toUpperCase();
  const firstLetter = word[0].toLowerCase();
  const lastLetter = word[word.length - 1].toLowerCase();

  const handleCopy = () => {
    navigator.clipboard?.writeText(word);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate('/5-letter-words')}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          5-Letter Words
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate(`/5-letter-words-starting-with-${firstLetter}`)}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Starting with {firstLetter.toUpperCase()}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-bold uppercase">{word}</span>
      </nav>

      {/* Main Word Header Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-blue-50/60 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              5-Letter Word Definition
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight flex items-baseline gap-4">
              <span>{uppercaseWord}</span>
              <span className="text-xl sm:text-2xl font-mono text-slate-400 font-normal italic">
                {details.pronunciation}
              </span>
            </h1>

            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
              <span className="font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded">
                {details.partOfSpeech}
              </span>
              <span>&bull;</span>
              <span>{details.syllables} {details.syllables === 1 ? 'syllable' : 'syllables'}</span>
              <span>&bull;</span>
              <span className="font-semibold text-blue-700">
                {details.scrabbleScore} Scrabble points
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSpeak}
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              title="Listen to pronunciation"
            >
              <Volume2 className="w-5 h-5" />
              <span className="hidden sm:inline">Listen</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              title="Copy word"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Word Definition & Example */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Definition:
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-medium leading-relaxed">
              {details.definition}
            </p>
          </div>

          {details.example && (
            <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Example in a Sentence:
              </h3>
              <p className="text-sm sm:text-base text-slate-700 italic">
                &ldquo;{details.example}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Word Anatomy Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Word Length
          </span>
          <span className="text-2xl font-black text-slate-900">5 Letters</span>
          <p className="text-[11px] text-slate-500 mt-1">Standard puzzle length</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Starting Letter
          </span>
          <button
            type="button"
            onClick={() => onNavigate(`/5-letter-words-starting-with-${firstLetter}`)}
            className="text-2xl font-black text-blue-600 hover:text-blue-800 uppercase flex items-center gap-1 cursor-pointer"
          >
            {firstLetter} &rarr;
          </button>
          <p className="text-[11px] text-slate-500 mt-1">Explore all words with {firstLetter.toUpperCase()}</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Ending Letter
          </span>
          <button
            type="button"
            onClick={() => onNavigate(`/5-letter-words-ending-in-${lastLetter}`)}
            className="text-2xl font-black text-blue-600 hover:text-blue-800 uppercase flex items-center gap-1 cursor-pointer"
          >
            {lastLetter} &rarr;
          </button>
          <p className="text-[11px] text-slate-500 mt-1">Explore all words ending in {lastLetter.toUpperCase()}</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Scrabble Value
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {details.scrabbleScore} Pts
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Standard English tile value</p>
        </div>
      </div>

      {/* Letter Breakdown: Vowels & Consonants */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Vowels &amp; Consonants Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Vowels in {uppercaseWord}:
            </span>
            <div className="flex items-center gap-2">
              {details.vowels.length > 0 ? (
                details.vowels.map((v, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-lg bg-blue-600 text-white font-mono font-bold text-lg flex items-center justify-center uppercase shadow-xs"
                  >
                    {v}
                  </span>
                ))
              ) : (
                <span className="text-sm font-medium text-slate-600">
                  No standard vowels (A, E, I, O, U)
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Consonants in {uppercaseWord}:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {details.consonants.map((c, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-lg bg-slate-800 text-white font-mono font-bold text-lg flex items-center justify-center uppercase shadow-xs"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Anagrams of This Word */}
      {details.anagrams.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Anagrams of {uppercaseWord} ({details.anagrams.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Valid 5-letter words formed by rearranging every letter of {uppercaseWord}:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {details.anagrams.map((an) => (
              <button
                key={an}
                type="button"
                onClick={() => onSelectWord(an)}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-mono font-bold text-base uppercase transition-all cursor-pointer"
              >
                {an}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5-Letter Words Similar to This Word (differ by 1 letter) */}
      {details.similarWords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              5-Letter Words Similar to {uppercaseWord} (1-Letter Difference)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Words that differ from {uppercaseWord} by only a single character:
          </p>
          <div className="flex flex-wrap gap-2">
            {details.similarWords.map((sim) => (
              <button
                key={sim}
                type="button"
                onClick={() => onSelectWord(sim)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-800 hover:text-blue-700 font-mono font-bold text-sm uppercase transition-all cursor-pointer"
              >
                {sim}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Words Containing Same Letters */}
      {details.sameLetterWords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Words Containing Similar Letter Combinations
          </h3>
          <div className="flex flex-wrap gap-2">
            {details.sameLetterWords.map((slw) => (
              <button
                key={slw}
                type="button"
                onClick={() => onSelectWord(slw)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs uppercase cursor-pointer"
              >
                {slw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Word Patterns For This Word */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Search Patterns Containing Letters of {uppercaseWord}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {details.patterns.map((pat) => (
            <button
              key={pat}
              type="button"
              onClick={() => onNavigate(`/word-pattern?pattern=${encodeURIComponent(pat)}`)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 font-mono font-bold text-xs text-slate-700 hover:text-indigo-800 text-center uppercase cursor-pointer transition-colors"
            >
              {pat}
            </button>
          ))}
        </div>
      </div>

      {/* Deep Internal Links */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Related 5-Letter Word Searches:
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <a
            href={`/5-letter-words-starting-with-${firstLetter}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/5-letter-words-starting-with-${firstLetter}`);
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 hover:border-blue-400 font-semibold"
          >
            5-letter words starting with {firstLetter.toUpperCase()}
          </a>

          <a
            href={`/5-letter-words-ending-in-${lastLetter}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/5-letter-words-ending-in-${lastLetter}`);
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 hover:border-blue-400 font-semibold"
          >
            5-letter words ending in {lastLetter.toUpperCase()}
          </a>

          <a
            href="/wordle-solver"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/wordle-solver');
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 hover:border-emerald-400 font-semibold"
          >
            Solve Wordle with {uppercaseWord}
          </a>

          <a
            href="/anagram-solver"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/anagram-solver');
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-purple-700 hover:border-purple-400 font-semibold"
          >
            Unscramble letters in {uppercaseWord}
          </a>
        </div>
      </div>
    </div>
  );
};
