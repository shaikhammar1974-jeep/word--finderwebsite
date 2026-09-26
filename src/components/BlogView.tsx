import React from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';

interface BlogViewProps {
  currentSlug?: string;
  onNavigate: (path: string) => void;
  onOpenWordFinder?: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ currentSlug, onNavigate, onOpenWordFinder }) => {
  // If viewing a specific article
  if (currentSlug) {
    const post = BLOG_POSTS.find(p => p.slug === currentSlug) || BLOG_POSTS[0];

    return (
      <article className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Word Game Articles
        </button>

        {/* Article Header Card */}
        <header className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              {post.author}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {post.publishedDate}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-slate-800 leading-relaxed space-y-6 text-base sm:text-lg shadow-sm">
          <div className="prose prose-slate max-w-none space-y-4">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-8 mb-4 tracking-tight">
                    {paragraph.replace('# ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-6 mb-3 tracking-tight">
                    {paragraph.replace('## ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={idx} className="text-lg sm:text-xl font-bold text-slate-800 mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 text-base">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-slate-700 leading-relaxed text-base sm:text-lg">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Call to action at bottom of article */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-blue-900 mb-1">
                Put These Strategies to Work Instantly
              </h4>
              <p className="text-xs text-blue-700">
                Test letter positions, patterns, and excluded consonants on our free finder.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-colors"
            >
              Launch Word Finder &rarr;
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Blog Hub / Archive
  return (
    <div className="space-y-8">
      {/* Blog Hero */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Word Game Strategy &amp; Linguistics Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            The 5-Letter Words Blog
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In-depth guides, mathematical game strategies, letter frequency studies, and linguistic breakdowns to improve your puzzle solving and vocabulary mastery.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all p-6 sm:p-7 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {post.tags[0]}
                </span>
                <span className="text-xs text-slate-400">{post.readTime}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                {post.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">{post.author}</span>
              <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article &rarr;
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
