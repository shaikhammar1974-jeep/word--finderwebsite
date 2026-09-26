import { BLOG_POSTS } from '../data/blogData';
import { ALL_WORDS_ARRAY } from '../data/dictionaryEngine';

export const BASE_URL = 'https://5-letter-words.com';

export interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
  lastmod?: string;
}

export function generateSitemapUrls(): SitemapUrl[] {
  const today = '2026-03-26';
  const urls: SitemapUrl[] = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: 1.0, lastmod: today },
    { loc: `${BASE_URL}/5-letter-words`, changefreq: 'daily', priority: 0.95, lastmod: today },
    { loc: `${BASE_URL}/wordle-solver`, changefreq: 'daily', priority: 0.95, lastmod: today },
    { loc: `${BASE_URL}/anagram-solver`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/word-pattern`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${BASE_URL}/dictionary`, changefreq: 'weekly', priority: 0.85, lastmod: today },
    { loc: `${BASE_URL}/word-lists`, changefreq: 'weekly', priority: 0.85, lastmod: today },
    { loc: `${BASE_URL}/blog`, changefreq: 'weekly', priority: 0.8, lastmod: today },
  ];

  // Starting letters (A-Z)
  for (let i = 97; i <= 122; i++) {
    const char = String.fromCharCode(i);
    urls.push({
      loc: `${BASE_URL}/5-letter-words-starting-with-${char}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: today
    });
  }

  // Common ending letters
  ['a', 'd', 'e', 'g', 'h', 'k', 'l', 'm', 'n', 'o', 'r', 's', 't', 'w', 'y'].forEach(char => {
    urls.push({
      loc: `${BASE_URL}/5-letter-words-ending-in-${char}`,
      changefreq: 'weekly',
      priority: 0.75,
      lastmod: today
    });
  });

  // Intent-based SEO landing pages
  const intentSlugs = [
    '5-letter-words-without-vowels',
    '5-letter-words-without-e',
    '5-letter-words-ending-with-ed',
    '5-letter-words-starting-with-st',
    '5-letter-words-with-a-in-the-middle',
    '5-letter-words-with-a-and-e',
    '5-letter-words-containing-r',
    '5-letter-words-ending-in-ing'
  ];

  intentSlugs.forEach(slug => {
    urls.push({
      loc: `${BASE_URL}/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: today
    });
  });

  // Blog posts
  BLOG_POSTS.forEach(post => {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: 0.75,
      lastmod: post.publishedDate
    });
  });

  // Top curated words
  const sampleWords = ALL_WORDS_ARRAY.slice(0, 150);
  sampleWords.forEach(w => {
    urls.push({
      loc: `${BASE_URL}/word/${w}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: today
    });
  });

  return urls;
}

export function generateSitemapXml(): string {
  const urls = generateSitemapUrls();
  const xmlItems = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || '2026-03-26'}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(2)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml
`;
}
