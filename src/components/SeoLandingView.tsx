import React, { useMemo, useState } from 'react';
import { Sparkles, ArrowRight, Volume2, Copy, Check, Filter } from 'lucide-react';
import { filterWords } from '../data/dictionaryEngine';
import { calculateScrabbleScore } from '../data/wordsData';
import { FaqSection, FaqItem } from './FaqSection';

interface SeoLandingViewProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSelectWord: (word: string) => void;
}

export const SeoLandingView: React.FC<SeoLandingViewProps> = ({ slug, onNavigate, onSelectWord }) => {
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  // Parse intent from slug
  const pageConfig = useMemo(() => {
    // Starting with X
    const startMatch = slug.match(/^5-letter-words-starting-with-([a-z])$/);
    if (startMatch) {
      const letter = startMatch[1];
      return {
        h1: `5 Letter Words Starting With ${letter.toUpperCase()}`,
        subtitle: `Find all verified five-letter English words that begin with the letter "${letter.toUpperCase()}". Perfect for Wordle, Scrabble, and anagram puzzles.`,
        filter: { startsWith: letter },
        categoryType: 'starting',
        currentKey: letter,
        faqs: [
          {
            question: `What are the most common 5 letter words starting with ${letter.toUpperCase()}?`,
            answer: `Popular words beginning with ${letter.toUpperCase()} include everyday vocabulary terms frequently featured in Wordle and word puzzles. Browse the full verified list below.`
          },
          {
            question: `How does starting with ${letter.toUpperCase()} help in Wordle?`,
            answer: `Testing words starting with ${letter.toUpperCase()} isolates critical initial consonants or vowels, narrowing down thousands of possibilities on early turns.`
          }
        ]
      };
    }

    // Ending with X
    const endMatch = slug.match(/^5-letter-words-ending-in-([a-z])$/);
    if (endMatch) {
      const letter = endMatch[1];
      return {
        h1: `5 Letter Words Ending With ${letter.toUpperCase()}`,
        subtitle: `Discover all valid 5-letter English words with "${letter.toUpperCase()}" as their final letter.`,
        filter: { endsWith: letter },
        categoryType: 'ending',
        currentKey: letter,
        faqs: [
          {
            question: `Why are words ending in ${letter.toUpperCase()} important?`,
            answer: `Terminal letters often dictate grammatical suffixes (-ED, -ER, -ES, -LY). Knowing words ending in ${letter.toUpperCase()} gives players rapid end-game deduction speed.`
          }
        ]
      };
    }

    // Without vowels
    if (slug === '5-letter-words-without-vowels') {
      return {
        h1: '5 Letter Words Without Vowels',
        subtitle: 'Explore rare and high-scoring 5-letter words that contain no standard vowels (A, E, I, O, U), utilizing "Y" or ancient Welsh phonetic roots.',
        filter: { vowelCount: 0 },
        categoryType: 'special',
        faqs: [
          {
            question: 'Can a 5-letter English word have zero vowels?',
            answer: 'Yes! Words like GLYPH, NYMPH, CRYPT, and LYNCH use "Y" as a vowel substitute, while Celtic loanwords like CRWTH and CWTCH contain no vowels whatsoever and are valid in Scrabble tournament lists.'
          },
          {
            question: 'Are words without vowels allowed in Wordle?',
            answer: 'Words like GLYPH, NYMPH, and CRYPT are fully valid Wordle answers and have appeared in official puzzle solutions.'
          }
        ]
      };
    }

    // Starting with ST
    if (slug === '5-letter-words-starting-with-st') {
      return {
        h1: '5 Letter Words Starting With "ST"',
        subtitle: 'A complete collection of five-letter words featuring the high-frequency "ST-" consonant blend.',
        filter: { startsWith: 'st' },
        categoryType: 'special',
        faqs: [
          {
            question: 'Why is ST- such a common word starter?',
            answer: 'The sibilant dental blend "ST-" is one of the most productive Germanic and Latin phonetic onsets in the English language, generating over 100 common five-letter terms like STAND, STARE, STONE, and STORM.'
          }
        ]
      };
    }

    // Ending with ED
    if (slug === '5-letter-words-ending-with-ed') {
      return {
        h1: '5 Letter Words Ending With "ED"',
        subtitle: 'Every valid 5-letter past-tense verb, adjective, and participle ending in "-ED".',
        filter: { endsWith: 'ed' },
        categoryType: 'special',
        faqs: [
          {
            question: 'How many 5 letter words end with ED?',
            answer: 'Over 80 common English words end in -ED, representing past-tense regular verb modifications such as BAKED, COPED, DARED, FIXED, HOPED, and VOTED.'
          }
        ]
      };
    }

    // Default 5-letter words landing
    return {
      h1: '5 Letter Words Directory & Full Word List',
      subtitle: 'The comprehensive collection of 5-letter English vocabulary words for game players, writers, and learners.',
      filter: {},
      categoryType: 'general',
      faqs: [
        {
          question: 'What is a 5 letter word?',
          answer: 'A 5-letter word is an English lexical unit composed of exactly five alphabetical characters, representing approximately 10% of standard English vocabulary.'
        },
        {
          question: 'How many 5 letter words exist in English?',
          answer: 'Standard collegiate dictionaries contain around 8,000 to 12,000 five-letter words, with roughly 2,500 words forming the core commonly used everyday vocabulary.'
        }
      ]
    };
  }, [slug]);

  // Query words
  const words = useMemo(() => {
    return filterWords(pageConfig.filter);
  }, [pageConfig]);

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

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated SEO Word List
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
            {pageConfig.h1}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
            {pageConfig.subtitle}
          </p>

          {/* Quick Sister Letters Bar */}
          {pageConfig.categoryType === 'starting' && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Switch Starting Letter:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {alphabet.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onNavigate(`/5-letter-words-starting-with-${l}`)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      pageConfig.currentKey === l
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {pageConfig.categoryType === 'ending' && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Switch Ending Letter:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['a', 'd', 'e', 'g', 'k', 'l', 'm', 'n', 'o', 'r', 's', 't', 'y'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onNavigate(`/5-letter-words-ending-in-${l}`)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      pageConfig.currentKey === l
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    -{l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Words Grid Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Matching Words ({words.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click any word to read full definitions, phonetic pronunciations, and anagram links.
            </p>
          </div>
        </div>

        {words.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-1">
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
                    <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 uppercase font-mono tracking-wider">
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
          <p className="text-sm text-slate-500 p-6 text-center">No words match this criteria.</p>
        )}
      </section>

      {/* Landing Page FAQ */}
      {pageConfig.faqs && pageConfig.faqs.length > 0 && (
        <FaqSection items={pageConfig.faqs} />
      )}
    </div>
  );
};
