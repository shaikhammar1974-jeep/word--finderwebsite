import React, { useState } from 'react';
import { Search, Menu, X, Sparkles, BookOpen, Shuffle, Grid, Hash, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuickSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenQuickSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '5 Letter Words', path: '/5-letter-words', icon: Sparkles },
    { label: 'Word Finder', path: '/', icon: Search },
    { label: 'Wordle Solver', path: '/wordle-solver', icon: Grid },
    { label: 'Word Lists', path: '/word-lists', icon: Hash },
    { label: 'Anagrams', path: '/anagram-solver', icon: Shuffle },
    { label: 'Word Patterns', path: '/word-pattern', icon: Grid },
    { label: 'Dictionary', path: '/dictionary', icon: BookOpen },
    { label: 'Blog', path: '/blog', icon: HelpCircle },
  ];

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              W
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-1">
                Word<span className="text-blue-600">Finder</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide -mt-1 hidden sm:block">
                Find the Right Word, Fast.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(link.path, e)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Quick Action Button & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenQuickSearch) {
                  onOpenQuickSearch();
                } else {
                  onNavigate('/dictionary');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Search dictionary"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Search Word</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Finder Tool
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white/98 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(link.path, e)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => handleLinkClick('/', e)}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-bold text-center text-sm shadow-sm"
            >
              Launch 5 Letter Word Finder
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
