import React from 'react';
import { WordFinderTool } from './WordFinderTool';
import { AdPlaceholder } from './AdPlaceholder';
import { FaqSection, FaqItem } from './FaqSection';
import { Sparkles, Grid, Shuffle, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface HomepageViewProps {
  onSelectWord: (word: string) => void;
  onNavigate: (path: string) => void;
}

export const HomepageView: React.FC<HomepageViewProps> = ({ onSelectWord, onNavigate }) => {
  const homepageFaqs: FaqItem[] = [
    {
      question: 'What is a 5 letter word?',
      answer: 'A 5-letter word is an English lexical term composed of exactly five alphabetical letters. In standard modern English dictionaries, there are approximately 10,000 valid 5-letter words, with about 2,500 words forming the core vocabulary used in literature, conversation, and daily word games.'
    },
    {
      question: 'How do I find a 5 letter word with specific letters?',
      answer: 'Use our "Must Include Letters" filter box. Enter any letters you know are in the word (such as "R, A"). If you also know letters that are eliminated, enter them in the "Exclude Letters" box. The tool filters words matching both criteria simultaneously.'
    },
    {
      question: 'Can I find words with letters in specific positions?',
      answer: 'Yes! The 5-tile Known Pattern at the top allows you to type letters directly into slots 1 through 5. For example, typing "A" in slot 2 and "E" in slot 5 creates the pattern "_ A _ _ E", returning words like BADGE, BAKER, CABLE, DANCE, and LARGE.'
    },
    {
      question: 'How does the word pattern finder work?',
      answer: 'The pattern finder uses character-position index arrays. It compares your input pattern against indexed dictionary entries, instantly isolating words whose letters match the designated slot coordinates in less than two milliseconds.'
    },
    {
      question: 'Can this tool help with Wordle-style puzzles?',
      answer: 'Absolutely. We also offer a dedicated Wordle Solver (accessible via navigation) that specifically categorizes Green letters (confirmed slots), Yellow letters (misplaced), and Gray letters (eliminated), ranking top next-guess recommendations.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-4 pt-2 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          The Fast &amp; Accurate Word Deduction Engine
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          5 Letter Words Finder
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Find 5-letter words quickly using letters, patterns, and word positions. Perfect for word games, puzzles, and Wordle-style games.
        </p>
      </section>

      {/* Main Interactive Word Finder Tool immediately below H1 */}
      <section id="tool" aria-label="5 Letter Words Search Tool">
        <WordFinderTool onSelectWord={onSelectWord} onNavigateCategory={onNavigate} />
      </section>

      {/* Ad Placement Below Main Tool */}
      <AdPlaceholder format="banner" />

      {/* Quick Navigation Cards to Complementary Tools */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('/wordle-solver')}
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1 text-base">
              Wordle Solver
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Filter by Green, Yellow, and Gray tiles with top next-guess recommendations.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-4 flex items-center">
            Open Solver &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('/anagram-solver')}
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Shuffle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-1 text-base">
              Anagram Solver
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unscramble scrambled letters into high-scoring 5-letter vocabulary words.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 mt-4 flex items-center">
            Unscramble Letters &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('/word-pattern')}
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 text-base">
              Word Pattern Finder
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find words matching wildcard expressions like _A__E or S___E.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 mt-4 flex items-center">
            Search Patterns &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('/dictionary')}
          className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-1 text-base">
              5-Letter Dictionary
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse definitions, parts of speech, phonetics, and example sentences.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-4 flex items-center">
            Explore Lexicon &rarr;
          </span>
        </div>
      </section>

      {/* 500-800 Words of Genuinely Useful Editorial SEO Content */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="max-w-4xl space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Mastering 5-Letter Words: Search Strategies, Patterns &amp; Word Games
            </h2>
            <p>
              In recreational linguistics, word deduction games, and competitive Scrabble, <strong>5-letter words</strong> represent the ultimate proving ground. Long enough to accommodate intricate diphthongs and consonant blends, yet short enough for agile mental computation, five-letter terms form the foundation of games like Wordle, Jumble, and crosswords.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              How the 5-Letter Word Finder Works
            </h3>
            <p>
              Our tool operates on indexed positional character tables. Rather than performing a linear scan over thousands of text entries, our search engine evaluates multiple constraints concurrently:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-2 text-slate-700 text-base">
              <li>
                <strong>Positional Tile Matching:</strong> When you place a letter in a specific tile (such as slot 2 = <em>A</em> and slot 5 = <em>E</em>), the engine cross-references the positional index to isolate words following the template <code>_ A _ _ E</code>.
              </li>
              <li>
                <strong>Letter Inclusions &amp; Exclusions:</strong> You can specify characters that must appear anywhere in the word, while filtering out eliminated letters with zero latency.
              </li>
              <li>
                <strong>Prefix and Suffix Anchoring:</strong> Rapidly filter by starting blends (like <em>ST-</em>, <em>BR-</em>, <em>CL-</em>) or common suffixes (such as <em>-ED</em>, <em>-ER</em>, <em>-ING</em>).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Tactical Pattern Strategies for Word Puzzles
            </h3>
            <p>
              When faced with unknown puzzle letters, analyzing vowel and consonant positions yields rapid discoveries. For example, in English five-letter vocabulary:
            </p>
            <p className="mt-2">
              The letter <strong>E</strong> is the single most common vowel, appearing in nearly half of all standard 5-letter words. It frequently acts as a silent final marker (as in <em>CRANE</em>, <em>SLATE</em>, <em>SHARE</em>, <em>BADGE</em>), altering the pronunciation of the primary vowel.
            </p>
            <p className="mt-2">
              Similarly, starting consonants cluster heavily around <strong>S</strong>, <strong>C</strong>, <strong>T</strong>, <strong>B</strong>, and <strong>P</strong>. If your puzzle reveals that a word starts with <strong>S</strong> and contains <strong>A</strong> in the third slot (<code>S _ A _ E</code>), you can immediately test high-yield candidates like <em>SCALE</em>, <em>SHARE</em>, <em>SLATE</em>, <em>SPADE</em>, or <em>STARE</em>.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              How This Tool Helps With Daily Games &amp; Vocabulary
            </h3>
            <p>
              Whether you are an educator helping students recognize phonics patterns, an aspiring novelist seeking precise adjectives, or a competitive word puzzle player aiming to protect your win streak, Word Finder provides the authoritative reference dataset. Every term includes part-of-speech labeling, audio pronunciation, and direct links to rhyming, similar, and anagrammatic variants.
            </p>
          </div>
        </div>
      </section>

      {/* Structured FAQ Section */}
      <FaqSection items={homepageFaqs} />

      {/* Ad Placement Above Footer */}
      <AdPlaceholder format="banner" />
    </div>
  );
};
