import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomepageView } from './components/HomepageView';
import { WordleSolverTool } from './components/WordleSolverTool';
import { AnagramSolverTool } from './components/AnagramSolverTool';
import { WordPatternTool } from './components/WordPatternTool';
import { DictionaryView } from './components/DictionaryView';
import { WordListsView } from './components/WordListsView';
import { WordDetailPage } from './components/WordDetailPage';
import { BlogView } from './components/BlogView';
import { SeoLandingView } from './components/SeoLandingView';
import { SitemapModal } from './components/SitemapModal';
import { RobotsModal } from './components/RobotsModal';
import { SeoAuditModal } from './components/SeoAuditModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { updateSeo, analytics } from './utils/seo';
import { BASE_URL } from './utils/sitemap';
import { getWordDetails } from './data/dictionaryEngine';
import { BLOG_POSTS } from './data/blogData';

export default function App() {
  // Current route state parsed from window.location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Modal States
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [isRobotsOpen, setIsRobotsOpen] = useState(false);
  const [isSeoAuditOpen, setIsSeoAuditOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // SEO details for audit modal
  const [currentMetaTitle, setCurrentMetaTitle] = useState('');
  const [currentMetaDescription, setCurrentMetaDescription] = useState('');
  const [currentCanonicalUrl, setCurrentCanonicalUrl] = useState('');

  // Handle browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Central Navigation Handler
  const navigateTo = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      analytics.track('page_view', path);
    }
  };

  // Synchronize Technical SEO metadata on route change
  useEffect(() => {
    const cleanPath = currentPath.toLowerCase().replace(/\/$/, '') || '/';
    let title = 'Word Finder - 5 Letter Words, Wordle Solver & Patterns';
    let description = 'Find 5-letter words quickly using letters, patterns, and word positions. Free Wordle solver, anagram tool, dictionary definitions, and word lists.';
    const canonical = `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
    let jsonLd: any = null;

    if (cleanPath === '/' || cleanPath === '/5-letter-words') {
      title = 'Word Finder - 5 Letter Words, Wordle Solver & Patterns';
      description = 'Find 5-letter words quickly using letters, patterns, and word positions. Free Wordle solver, anagram tool, dictionary definitions, and word lists.';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Word Finder',
        url: canonical,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        description
      };
    } else if (cleanPath === '/wordle-solver') {
      title = 'Wordle Solver - Find Possible Words From Your Letters | Word Finder';
      description = 'Enter your Green, Yellow, and Gray letter tiles to instantly deduce valid Wordle answers and calculated optimal next guesses.';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Wordle Solver - Word Finder',
        url: canonical,
        description
      };
    } else if (cleanPath === '/anagram-solver') {
      title = 'Anagram Solver - Unscramble Letters Into Words | Word Finder';
      description = 'Unscramble letters to find high-scoring 5-letter English words and anagrams. Perfect for Scrabble and Jumble puzzles.';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Anagram Solver - Word Finder',
        url: canonical,
        description
      };
    } else if (cleanPath === '/word-pattern') {
      title = 'Word Pattern Finder - Find Words Matching Any Pattern | Word Finder';
      description = 'Search five-letter words matching slot patterns like _A__E or S___E. Rapid positional wildcard deduction engine.';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Word Pattern Finder - Word Finder',
        url: canonical,
        description
      };
    } else if (cleanPath === '/dictionary') {
      title = '5-Letter Words Dictionary - Definitions, Pronunciations & Examples | Word Finder';
      description = 'Searchable 5-letter English dictionary with phonetic pronunciations, parts of speech, Scrabble values, and sample sentences.';
    } else if (cleanPath === '/word-lists') {
      title = '5 Letter Word Lists - Comprehensive Starting, Ending & Pattern Indexes | Word Finder';
      description = 'Browse categorized 5-letter word lists organized by starting letters, ending letters, vowel combinations, and gameplay strategies.';
    } else if (cleanPath.startsWith('/word/')) {
      const targetWord = cleanPath.replace('/word/', '');
      const details = getWordDetails(targetWord);
      title = `${targetWord.toUpperCase()} - Definition, Meaning & 5 Letter Word Information | Word Finder`;
      description = `${targetWord.toUpperCase()} is a 5-letter ${details.partOfSpeech}. Meaning: ${details.definition.slice(0, 110)}...`;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: targetWord.toUpperCase(),
        description: details.definition,
        inDefinedTermSet: 'Word Finder Dictionary',
        termCode: targetWord.toLowerCase()
      };
    } else if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '');
      const post = BLOG_POSTS.find(p => p.slug === slug);
      if (post) {
        title = `${post.title} | Word Finder`;
        description = post.metaDescription;
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.metaDescription,
          author: {
            '@type': 'Person',
            name: post.author
          },
          datePublished: post.publishedDate
        };
      }
    } else if (cleanPath === '/blog') {
      title = 'Word Game Strategy, Linguistics & Wordle Guides | Blog';
      description = 'Articles and guides on Wordle strategy, word pattern solvers, letter frequencies, and vocabulary expansion.';
    } else if (cleanPath.startsWith('/5-letter-words-starting-with-')) {
      const char = cleanPath.replace('/5-letter-words-starting-with-', '').toUpperCase();
      title = `5 Letter Words Starting With ${char} - Word Finder & List`;
      description = `Complete list of 5-letter words starting with ${char}. Filter by known positions, anagrams, and Scrabble values.`;
    } else if (cleanPath.startsWith('/5-letter-words-ending-in-')) {
      const char = cleanPath.replace('/5-letter-words-ending-in-', '').toUpperCase();
      title = `5 Letter Words Ending In ${char} - Word Finder & List`;
      description = `Find every 5-letter English word ending in ${char}. Perfect for Wordle endgames and crossword solving.`;
    } else if (cleanPath === '/5-letter-words-without-vowels') {
      title = '5 Letter Words Without Vowels - Words With No Vowels List';
      description = 'Discover rare 5-letter words with no standard vowels like GLYPH, NYMPH, CRYPT, and CRWTH for Scrabble and Wordle.';
    } else if (cleanPath === '/5-letter-words-starting-with-st') {
      title = '5 Letter Words Starting With ST - High Frequency Word List';
      description = 'Explore five-letter words beginning with ST like STAND, STARE, STONE, and STORM.';
    } else if (cleanPath === '/5-letter-words-ending-with-ed') {
      title = '5 Letter Words Ending With ED - Past Tense & Adjectives';
      description = 'Comprehensive list of five-letter words ending in -ED including BAKED, COPED, DARED, and FIXED.';
    }

    setCurrentMetaTitle(title);
    setCurrentMetaDescription(description);
    setCurrentCanonicalUrl(canonical);

    updateSeo({
      title,
      description,
      canonicalUrl: canonical,
      jsonLd
    });
  }, [currentPath]);

  // Handle word selection across all components
  const handleSelectWord = (word: string) => {
    navigateTo(`/word/${word.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    const clean = currentPath.toLowerCase().replace(/\/$/, '') || '/';

    // 1. Homepage & Root alias
    if (clean === '/' || clean === '/5-letter-words') {
      return <HomepageView onSelectWord={handleSelectWord} onNavigate={navigateTo} />;
    }

    // 2. Wordle Solver
    if (clean === '/wordle-solver') {
      return (
        <div className="space-y-6">
          <div className="max-w-4xl mx-auto text-center space-y-2 pt-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Wordle Solver
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Find possible 5-letter words from your Green, Yellow, and Gray letters.
            </p>
          </div>
          <WordleSolverTool onSelectWord={handleSelectWord} />
        </div>
      );
    }

    // 3. Anagram Solver
    if (clean === '/anagram-solver') {
      return (
        <div className="space-y-6">
          <div className="max-w-4xl mx-auto text-center space-y-2 pt-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Anagram Solver
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Unscramble letters into valid 5-letter words and puzzle answers.
            </p>
          </div>
          <AnagramSolverTool onSelectWord={handleSelectWord} />
        </div>
      );
    }

    // 4. Word Pattern Finder
    if (clean === '/word-pattern') {
      return (
        <div className="space-y-6">
          <div className="max-w-4xl mx-auto text-center space-y-2 pt-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Word Pattern Finder
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Find words matching any slot template using wildcards.
            </p>
          </div>
          <WordPatternTool onSelectWord={handleSelectWord} />
        </div>
      );
    }

    // 5. Dictionary
    if (clean === '/dictionary') {
      return <DictionaryView onSelectWord={handleSelectWord} />;
    }

    // 6. Word Lists Hub
    if (clean === '/word-lists') {
      return <WordListsView onNavigate={navigateTo} onSelectWord={handleSelectWord} />;
    }

    // 7. Individual Word Detail Page
    if (clean.startsWith('/word/')) {
      const word = clean.replace('/word/', '');
      return <WordDetailPage word={word} onNavigate={navigateTo} onSelectWord={handleSelectWord} />;
    }

    // 8. Blog & Article Reader
    if (clean.startsWith('/blog/')) {
      const slug = clean.replace('/blog/', '');
      return <BlogView currentSlug={slug} onNavigate={navigateTo} />;
    }
    if (clean === '/blog') {
      return <BlogView onNavigate={navigateTo} />;
    }

    // 9. SEO Programmatic Landing Pages
    // (Starting with, Ending with, No vowels, Starting with ST, etc.)
    const isSeoSlug =
      clean.startsWith('/5-letter-words-starting-with-') ||
      clean.startsWith('/5-letter-words-ending-in-') ||
      clean.startsWith('/5-letter-words-with-') ||
      clean.startsWith('/5-letter-words-without-');

    if (isSeoSlug) {
      const slug = clean.replace(/^\//, '');
      return <SeoLandingView slug={slug} onNavigate={navigateTo} onSelectWord={handleSelectWord} />;
    }

    // Fallback: Default to Homepage
    return <HomepageView onSelectWord={handleSelectWord} onNavigate={navigateTo} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenSitemapModal={() => setIsSitemapOpen(true)}
        onOpenRobotsModal={() => setIsRobotsOpen(true)}
        onOpenSeoAuditModal={() => setIsSeoAuditOpen(true)}
      />

      {/* Technical Modals */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onNavigate={navigateTo}
      />

      <RobotsModal
        isOpen={isRobotsOpen}
        onClose={() => setIsRobotsOpen(false)}
      />

      <SeoAuditModal
        isOpen={isSeoAuditOpen}
        onClose={() => setIsSeoAuditOpen(false)}
        currentTitle={currentMetaTitle}
        currentDescription={currentMetaDescription}
        currentCanonical={currentCanonicalUrl}
        currentPath={currentPath}
      />

      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onSelectWord={handleSelectWord}
      />
    </div>
  );
}
