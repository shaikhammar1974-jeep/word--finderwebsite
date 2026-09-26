import React, { useState, useMemo, useRef } from 'react';
import { Grid, Sparkles, AlertCircle, HelpCircle, Check, Copy, Volume2, RotateCcw, Lightbulb } from 'lucide-react';
import { solveWordle } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';
import { analytics } from '../utils/seo';

interface WordleSolverToolProps {
  onSelectWord: (word: string) => void;
}

export const WordleSolverTool: React.FC<WordleSolverToolProps> = ({ onSelectWord }) => {
  // Green positions (exact letter match at slot 0..4)
  const [greenTiles, setGreenTiles] = useState<string[]>(['', '', '', '', '']);

  // Yellow letters: string of letters + optional excluded positions
  const [yellowLetters, setYellowLetters] = useState<string>('');

  // Gray letters: string of eliminated letters
  const [grayLetters, setGrayLetters] = useState<string>('');

  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const greenRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleGreenChange = (index: number, val: string) => {
    const char = val.slice(-1).replace(/[^a-zA-Z]/g, '').toUpperCase();
    const next = [...greenTiles];
    next[index] = char;
    setGreenTiles(next);

    if (char && index < 4) {
      greenRefs[index + 1].current?.focus();
    }
  };

  const handleGreenKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !greenTiles[index] && index > 0) {
      greenRefs[index - 1].current?.focus();
    }
  };

  // Convert inputs to solver
  const { words, bestGuesses } = useMemo(() => {
    const cleanYellow = yellowLetters.toLowerCase().replace(/[^a-z]/g, '').split('');
    const cleanGray = grayLetters.toLowerCase().replace(/[^a-z]/g, '').split('');

    const yellowConfig = cleanYellow.map(y => ({
      letter: y,
      notPositions: [] // generalized
    }));

    return solveWordle({
      green: greenTiles,
      yellow: yellowConfig,
      gray: cleanGray
    });
  }, [greenTiles, yellowLetters, grayLetters]);

  // Quick preset test
  const loadExample = () => {
    setGreenTiles(['', 'A', '', '', 'E']);
    setYellowLetters('R');
    setGrayLetters('TSL');
  };

  const handleClear = () => {
    setGreenTiles(['', '', '', '', '']);
    setYellowLetters('');
    setGrayLetters('');
    greenRefs[0].current?.focus();
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
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Interactive Tool Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 px-6 py-5 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <Grid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Wordle-Style Solver &amp; Assistant</h2>
              <p className="text-xs text-emerald-100">
                Enter Green, Yellow, and Gray letters to isolate valid puzzle solutions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadExample}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              Load Example (_A__E + R - TSL)
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Section 1: Green Letters (Exact Positions) */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block"></span>
              <label className="text-sm font-bold text-emerald-950">
                1. Green Letters (Correct Positions)
              </label>
              <span className="text-xs text-emerald-700 font-medium hidden sm:inline">
                Type letters in their confirmed slots
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
              {[0, 1, 2, 3, 4].map((index) => {
                const val = greenTiles[index];
                return (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-emerald-800/80 mb-1">
                      Slot {index + 1}
                    </span>
                    <input
                      ref={greenRefs[index]}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleGreenChange(index, e.target.value)}
                      onKeyDown={(e) => handleGreenKeyDown(index, e)}
                      placeholder="_"
                      className={`w-12 h-14 sm:w-16 sm:h-18 text-center text-2xl sm:text-3xl font-black rounded-xl border-2 uppercase transition-all shadow-xs focus:outline-none ${
                        val
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'border-emerald-300 bg-white text-slate-800 hover:border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder-slate-300'
                      }`}
                      aria-label={`Green letter at position ${index + 1}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Yellow Letters & Gray Letters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Yellow Letters */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block"></span>
                <label className="text-sm font-bold text-amber-950">
                  2. Yellow Letters (Misplaced)
                </label>
              </div>
              <p className="text-xs text-amber-800 mb-2">
                Letters that are in the word, but in different positions.
              </p>
              <input
                type="text"
                value={yellowLetters}
                onChange={(e) => setYellowLetters(e.target.value.replace(/[^a-zA-Z, ]/g, ''))}
                placeholder="e.g. R, O, A"
                className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-base font-bold uppercase text-amber-900 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Gray Letters */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-500 inline-block"></span>
                <label className="text-sm font-bold text-slate-900">
                  3. Gray Letters (Eliminated)
                </label>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Letters that turned dark gray and are not in the mystery word.
              </p>
              <input
                type="text"
                value={grayLetters}
                onChange={(e) => setGrayLetters(e.target.value.replace(/[^a-zA-Z, ]/g, ''))}
                placeholder="e.g. T, S, L, M, C"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-900 text-sm">
              {words.length} Possible Wordle {words.length === 1 ? 'Solution' : 'Solutions'}
            </span>
            {bestGuesses.length > 0 && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Optimal Next Guesses Calculated
              </span>
            )}
          </div>

          {/* Best Guesses Bar */}
          {bestGuesses.length > 0 && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                Recommended High-Probability Next Guesses:
              </div>
              <div className="flex flex-wrap gap-2">
                {bestGuesses.map((guess) => (
                  <button
                    key={guess}
                    type="button"
                    onClick={() => onSelectWord(guess)}
                    className="px-3 py-1.5 bg-white border border-emerald-300 hover:border-emerald-600 text-emerald-900 font-mono font-bold text-sm uppercase rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
                  >
                    {guess}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Word Results Grid */}
          {words.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {words.map((w) => {
                const score = calculateScrabbleScore(w);
                const isCopied = copiedWord === w;
                return (
                  <div
                    key={w}
                    onClick={() => onSelectWord(w)}
                    className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-xl p-2.5 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 uppercase font-mono tracking-wider">
                        {w}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                        {score} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-400 text-xs">
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(w, e)}
                        className="p-1 hover:text-emerald-600"
                        title="Pronounce"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(w, e)}
                        className="p-1 hover:text-emerald-600"
                        title="Copy"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-[11px] font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        View &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800">No Wordle matches found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check whether a letter is accidentally listed in both green and gray, or if the yellow letters contain conflicting placements.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg"
              >
                Clear Wordle Tiles
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Content Section (as specified in prompt) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            How to Use the Wordle Solver
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Solve any daily Wordle or 5-letter word puzzle in five quick steps. Our solver simulates information entropy to suggest words that test the most likely vowels and consonants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Enter Green Letters</h3>
              <p className="text-xs text-slate-600">
                Type letters that turned green into their exact slot positions (1 to 5).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center mb-3">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Add Yellow Letters</h3>
              <p className="text-xs text-slate-600">
                Enter misplaced letters that must appear somewhere else in the word.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-full bg-slate-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Add Gray Letters</h3>
              <p className="text-xs text-slate-600">
                Input eliminated letters that your previous guesses proved are not present.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Instant Results</h3>
              <p className="text-xs text-slate-600">
                Our algorithm processes candidate dictionary words and ranks the top recommendations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                5
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Review &amp; Guess</h3>
              <p className="text-xs text-slate-600">
                Select the word that maximizes distinct consonant coverage for your next guess.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
