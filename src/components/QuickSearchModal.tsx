import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Volume2, ArrowRight } from 'lucide-react';
import { searchDictionary } from '../data/dictionaryEngine';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord: (word: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose, onSelectWord }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return searchDictionary(query, 12);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any 5-letter word (e.g. CRANE, BADGE)..."
            className="flex-1 bg-transparent text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none uppercase"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {results.length > 0 ? (
            results.map((entry) => (
              <div
                key={entry.word}
                onClick={() => {
                  onSelectWord(entry.word);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-slate-900 group-hover:text-blue-600 uppercase">
                      {entry.word}
                    </span>
                    <span className="text-xs text-slate-400 font-mono italic">
                      {entry.pronunciation}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                      {entry.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {entry.definition}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          ) : query ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No dictionary entries match &quot;{query}&quot;.
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Start typing letters to search 5-letter vocabulary terms.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
