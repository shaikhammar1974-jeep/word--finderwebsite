import React, { useState, useMemo } from 'react';
import { Grid, Sparkles, Copy, Check, Volume2, RotateCcw } from 'lucide-react';
import { filterWords } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';

interface WordPatternToolProps {
  onSelectWord: (word: string) => void;
}

export const WordPatternTool: React.FC<WordPatternToolProps> = ({ onSelectWord }) => {
  const [patternInput, setPatternInput] = useState('_ A _ _ _');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const popularPatterns = [
    { pattern: '_ A _ _ _', label: '_ A _ _ _', desc: 'Vowel A in 2nd slot' },
    { pattern: 'S _ _ _ E', label: 'S _ _ _ E', desc: 'Starts S, ends E' },
    { pattern: '_ R A _ _', label: '_ R A _ _', desc: 'RA in middle' },
    { pattern: 'C _ _ _ T', label: 'C _ _ _ T', desc: 'Starts C, ends T' },
    { pattern: '_ A _ _ E', label: '_ A _ _ E', desc: 'A in 2nd, E in 5th' },
    { pattern: 'S T _ _ _', label: 'S T _ _ _', desc: 'Starts with ST-' },
    { pattern: '_ _ _ E D', label: '_ _ _ E D', desc: 'Ends in -ED' },
    { pattern: '_ _ I N G', label: '_ _ I N G', desc: 'Ends in -ING' },
  ];

  const words = useMemo(() => {
    return filterWords({ pattern: patternInput });
  }, [patternInput]);

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

  return (
    <div className="space-y-8">
      {/* Tool Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 px-6 py-5 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <Grid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">5-Letter Word Pattern Finder</h2>
              <p className="text-xs text-blue-100">
                Search words matching any blank slot pattern using underscore (_) or asterisk (*).
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Popular Pattern Preset Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Popular Pattern Presets:
            </label>
            <div className="flex flex-wrap gap-2">
              {popularPatterns.map((p) => {
                const isActive = patternInput.replace(/\s+/g, '') === p.pattern.replace(/\s+/g, '');
                return (
                  <button
                    key={p.pattern}
                    type="button"
                    onClick={() => setPatternInput(p.pattern)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                    title={p.desc}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pattern Input Box */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Enter 5-Slot Pattern (Use _ for blanks):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={patternInput}
                onChange={(e) => setPatternInput(e.target.value.toUpperCase())}
                placeholder="e.g. S _ A _ E"
                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-2xl font-black font-mono tracking-widest text-blue-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 uppercase"
              />
              <button
                type="button"
                onClick={() => setPatternInput('_ _ _ _ _')}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                Reset Pattern
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Example formats: <code>_ A _ _ E</code> or <code>S _ _ _ E</code> or <code>_ R A _ _</code>
            </p>
          </div>

          {/* Results Summary */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-900 text-sm">
              {words.length} Words Matching Pattern{' '}
              <strong className="text-blue-700 font-mono">{patternInput.toUpperCase()}</strong>
            </span>
          </div>

          {/* Results Grid */}
          {words.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {words.map((w) => {
                const score = calculateScrabbleScore(w);
                const isCopied = copiedWord === w;
                return (
                  <div
                    key={w}
                    onClick={() => onSelectWord(w)}
                    className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl p-3 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-slate-900 group-hover:text-blue-700 uppercase font-mono tracking-wider">
                        {w}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {score} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-400 text-xs">
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(w, e)}
                        className="p-1 hover:text-blue-600"
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
                      <span className="text-[11px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
                No words match this pattern. Try replacing letters with blanks (<code>_</code>).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
