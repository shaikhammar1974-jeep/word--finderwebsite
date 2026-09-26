import React from 'react';
import { FileText, Shield, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenSitemapModal: () => void;
  onOpenRobotsModal: () => void;
  onOpenSeoAuditModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSitemapModal,
  onOpenRobotsModal,
  onOpenSeoAuditModal
}) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const handleLink = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alphabetical Quick Jump Navigation */}
        <div className="pb-10 mb-10 border-b border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Browse 5-Letter Words by Starting Letter:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {alphabet.map((letter) => (
              <a
                key={letter}
                href={`/5-letter-words-starting-with-${letter}`}
                onClick={(e) => handleLink(`/5-letter-words-starting-with-${letter}`, e)}
                className="w-8 h-8 rounded-md bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-bold flex items-center justify-center transition-colors text-slate-200 uppercase"
                title={`5 letter words starting with ${letter.toUpperCase()}`}
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* 4 Columns of Deep Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Core Tools */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Word Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLink('/', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  5 Letter Word Finder
                </a>
              </li>
              <li>
                <a
                  href="/wordle-solver"
                  onClick={(e) => handleLink('/wordle-solver', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Wordle Solver Tool
                </a>
              </li>
              <li>
                <a
                  href="/anagram-solver"
                  onClick={(e) => handleLink('/anagram-solver', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Anagram Solver &amp; Unscrambler
                </a>
              </li>
              <li>
                <a
                  href="/word-pattern"
                  onClick={(e) => handleLink('/word-pattern', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Word Pattern Finder
                </a>
              </li>
              <li>
                <a
                  href="/dictionary"
                  onClick={(e) => handleLink('/dictionary', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Searchable 5-Letter Dictionary
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Word Lists & Filters */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Curated Word Lists
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/5-letter-words-without-vowels"
                  onClick={(e) => handleLink('/5-letter-words-without-vowels', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  5-Letter Words Without Vowels
                </a>
              </li>
              <li>
                <a
                  href="/5-letter-words-starting-with-st"
                  onClick={(e) => handleLink('/5-letter-words-starting-with-st', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Words Starting With &quot;ST&quot;
                </a>
              </li>
              <li>
                <a
                  href="/5-letter-words-ending-with-ed"
                  onClick={(e) => handleLink('/5-letter-words-ending-with-ed', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Words Ending in &quot;-ED&quot;
                </a>
              </li>
              <li>
                <a
                  href="/5-letter-words-with-a-and-e"
                  onClick={(e) => handleLink('/5-letter-words-with-a-and-e', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Words Containing &quot;A&quot; and &quot;E&quot;
                </a>
              </li>
              <li>
                <a
                  href="/word-lists"
                  onClick={(e) => handleLink('/word-lists', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Complete Word Lists Index
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Strategy & Knowledge */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Guides &amp; Articles
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/blog/what-are-5-letter-words"
                  onClick={(e) => handleLink('/blog/what-are-5-letter-words', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  What Are 5-Letter Words?
                </a>
              </li>
              <li>
                <a
                  href="/blog/wordle-solver-winning-strategies"
                  onClick={(e) => handleLink('/blog/wordle-solver-winning-strategies', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Optimal Wordle Strategy
                </a>
              </li>
              <li>
                <a
                  href="/blog/how-to-find-5-letter-words-quickly"
                  onClick={(e) => handleLink('/blog/how-to-find-5-letter-words-quickly', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Finding Words With Missing Letters
                </a>
              </li>
              <li>
                <a
                  href="/blog/5-letter-words-with-unusual-letters"
                  onClick={(e) => handleLink('/blog/5-letter-words-with-unusual-letters', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  Words With Q, X, Z &amp; J
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLink('/blog', e)}
                  className="hover:text-blue-400 transition-colors"
                >
                  All Word Game Blog Posts
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Technical SEO & Transparency */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Technical SEO
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenSitemapModal}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  XML Sitemap (sitemap.xml)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRobotsModal}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Robots.txt Specification
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSeoAuditModal}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left text-emerald-400 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live SEO Health Audit
                </button>
              </li>
              <li className="pt-2 text-xs text-slate-400 leading-normal">
                Structured Data: WebApplication, BreadcrumbList, DefinedTerm, FAQPage Schema.org compliant.
              </li>
            </ul>
          </div>
        </div>

        {/* Brand & Legal Disclaimer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              W
            </div>
            <span className="font-semibold text-slate-200">Word Finder</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <p className="text-center md:text-right max-w-xl text-slate-400">
            Word Finder is an independent educational vocabulary reference and word puzzle utility. It is not affiliated, sponsored, or endorsed by Wordle, The New York Times, Scrabble, or Hasbro.
          </p>
        </div>
      </div>
    </footer>
  );
};
