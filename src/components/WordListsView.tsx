import React, { useState } from 'react';
import { Hash, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { ALL_WORDS_ARRAY } from '../data/dictionaryEngine';

interface WordListsViewProps {
  onNavigate: (path: string) => void;
  onSelectWord: (word: string) => void;
}

export const WordListsView: React.FC<WordListsViewProps> = ({ onNavigate, onSelectWord }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const startingLists = alphabet.map(l => ({
    name: `5 Letter Words Starting With ${l.toUpperCase()}`,
    path: `/5-letter-words-starting-with-${l}`,
    letter: l,
    count: ALL_WORDS_ARRAY.filter(w => w.startsWith(l)).length
  }));

  const endingLetters = ['a', 'd', 'e', 'g', 'k', 'l', 'm', 'n', 'o', 'r', 's', 't', 'y'];
  const endingLists = endingLetters.map(l => ({
    name: `5 Letter Words Ending With ${l.toUpperCase()}`,
    path: `/5-letter-words-ending-in-${l}`,
    letter: l,
    count: ALL_WORDS_ARRAY.filter(w => w.endsWith(l)).length
  }));

  const specialLists = [
    {
      title: '5 Letter Words Without Vowels',
      desc: 'Rare words using Y or Celtic phonetic roots like GLYPH, NYMPH, CRYPT, CRWTH',
      path: '/5-letter-words-without-vowels',
      badge: 'Puzzle Favorite'
    },
    {
      title: '5 Letter Words Ending in -ED',
      desc: 'Past tense verbs and participles like BAKED, COPED, DARED, FIXED, HOPED',
      path: '/5-letter-words-ending-with-ed',
      badge: 'Grammar'
    },
    {
      title: '5 Letter Words Starting With ST-',
      desc: 'High-frequency consonant blend words like STAND, STARE, STONE, STORM',
      path: '/5-letter-words-starting-with-st',
      badge: 'High Frequency'
    },
    {
      title: '5 Letter Words With A and E',
      desc: 'Vowel-rich words like BADGE, BAKER, CABLE, DANCE, EAGLE, LARGE',
      path: '/5-letter-words-with-a-and-e',
      badge: 'Vowel Power'
    },
    {
      title: '5 Letter Words Containing R',
      desc: 'Essential consonant connector words for word puzzles and Scrabble',
      path: '/5-letter-words-containing-r',
      badge: 'Popular'
    },
    {
      title: '5 Letter Words With A in the Middle',
      desc: 'Pattern _ _ A _ _ words like CRANE, BRAIN, HEART, CHAIR, SCALE',
      path: '/5-letter-words-with-a-in-the-middle',
      badge: 'Middle Anchor'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            Curated Lexical Indexes
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            5-Letter Word Lists &amp; Categorized Indexes
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Browse our complete directory of 5-letter word lists. Organized by starting letters, ending letters, vowel combinations, and gameplay strategies.
          </p>
        </div>
      </div>

      {/* Special Curated Collections */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Featured Word Lists &amp; Tactical Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialLists.map((item, i) => (
            <div
              key={i}
              onClick={() => onNavigate(item.path)}
              className="group bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-block mb-2">
                  {item.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>View Full Word List</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Starting Letters A-Z */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            5-Letter Words by Starting Letter (A to Z)
          </h2>
          <p className="text-xs text-slate-500">
            Select a letter to view all valid 5-letter words starting with that character.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {startingLists.map((item) => (
            <button
              key={item.letter}
              type="button"
              onClick={() => onNavigate(item.path)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-800 group-hover:text-blue-600 uppercase font-mono">
                  {item.letter}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {item.count} words
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Starts with {item.letter.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Ending Letters */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            5-Letter Words by Ending Letter
          </h2>
          <p className="text-xs text-slate-500">
            Explore words sorted by their terminal character.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {endingLists.map((item) => (
            <button
              key={item.letter}
              type="button"
              onClick={() => onNavigate(item.path)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-800 group-hover:text-blue-600 uppercase font-mono">
                  -{item.letter}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {item.count} words
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Ends in {item.letter.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
