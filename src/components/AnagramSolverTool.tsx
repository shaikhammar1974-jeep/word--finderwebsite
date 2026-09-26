import React, { useState, useMemo } from 'react';
import { Shuffle, Sparkles, Copy, Check, Volume2, RotateCcw, HelpCircle } from 'lucide-react';
import { solveAnagram } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';

interface AnagramSolverToolProps {
  onSelectWord: (word: string) => void;
}

export const AnagramSolverTool: React.FC<AnagramSolverToolProps> = ({ onSelectWord }) => {
  const [letters, setLetters] = useState('TEARS');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const words = useMemo(() => {
    return solveAnagram(letters, 5);
  }, [letters]);

  const handleCopy = (w: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(w);
    setCopiedWord(w);
    setTimeout(() => setCopiedWord(null), 1800);
  };

  const handleSpeak = (w: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(w);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const presets = ['TEARS', 'CRANE', 'SLATE', 'ROAST', 'LEAST', 'SHARE', 'STARE'];

  return (
    <div className="space-y-8">
      {/* Tool Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 px-6 py-5 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">5-Letter Anagram Solver &amp; Unscrambler</h2>
              <p className="text-xs text-purple-100">
                Unscramble jumbled letter tiles into valid English dictionary words.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-200">Try:</span>
            {presets.slice(0, 4).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setLetters(p)}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/25 text-white font-mono font-bold cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Enter Letters to Unscramble:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={letters}
                onChange={(e) => setLetters(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                placeholder="e.g. TEARS"
                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-2xl font-black font-mono tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20 uppercase"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLetters('')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  Clear
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Showing valid 5-letter anagrams and permutations for{' '}
              <strong className="text-purple-700 font-mono font-bold uppercase">{letters || '...'}</strong>
            </p>
          </div>

          {/* Results Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-900 text-sm">
              {words.length} Anagram {words.length === 1 ? 'Word' : 'Words'} Found
            </span>
          </div>

          {/* Results Grid */}
          {words.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {words.map((w) => {
                const score = calculateScrabbleScore(w);
                const isCopied = copiedWord === w;
                return (
                  <div
                    key={w}
                    onClick={() => onSelectWord(w)}
                    className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-500 hover:shadow-md rounded-xl p-3 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-slate-900 group-hover:text-purple-700 uppercase font-mono tracking-wider">
                        {w}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                        {score} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-400 text-xs">
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(w, e)}
                        className="p-1 hover:text-purple-600"
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
                      <span className="text-[11px] font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-sm text-slate-600">
                No anagrams found. Try entering another set of letters like <strong>CRANE</strong> or <strong>SLATE</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Anagram Advice Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold text-slate-900">How to Win at Anagram Puzzles</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Anagram solving relies on recognizing common consonant blends and suffix/prefix anchors. When looking at letters like <strong>T-E-A-R-S</strong>, test frequent grammatical endings like <strong>-S</strong>, <strong>-ED</strong>, or <strong>-ER</strong>. Shifting vowels between the second and third positions will instantly reveal words like <em>STARE</em>, <em>RATES</em>, <em>TEARS</em>, <em>TARES</em>, and <em>ASTER</em>.
        </p>
      </section>
    </div>
  );
};
