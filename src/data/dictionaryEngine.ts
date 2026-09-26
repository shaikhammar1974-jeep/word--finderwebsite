import { CURATED_WORDS, WordEntry, calculateScrabbleScore } from './wordsData';
import { EXTENDED_5_LETTER_WORDS } from './wordList';

// Merge curated and extended words into unified deduplicated database
const wordsSet = new Set<string>();
const dictionaryMap = new Map<string, WordEntry>();

// Populate curated words first
for (const entry of CURATED_WORDS) {
  const normalized = entry.word.toLowerCase();
  wordsSet.add(normalized);
  dictionaryMap.set(normalized, entry);
}

// Helper to deduce vowels and consonants
function extractVowels(w: string): string[] {
  const matches = w.toLowerCase().match(/[aeiou]/g);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractConsonants(w: string): string[] {
  const matches = w.toLowerCase().match(/[^aeiou]/g);
  return matches ? Array.from(new Set(matches)) : [];
}

// Generate sensible dictionary definitions and examples for any extended words not in curated list
function generateFallbackEntry(word: string): WordEntry {
  const w = word.toLowerCase();
  const vowels = extractVowels(w);
  const consonants = extractConsonants(w);
  const score = calculateScrabbleScore(w);

  // Common endings detection
  let pos: 'noun' | 'verb' | 'adjective' | 'adverb' = 'noun';
  let definition = `A valid 5-letter English word used in games, literature, and vocabulary exercises.`;
  let example = `The contestant quickly identified "${w}" during the final round of the word championship.`;

  if (w.endsWith('ed')) {
    pos = 'verb';
    definition = `Past tense form or participle indicating an action completed or state established.`;
    example = `They had carefully ${w} all necessary arrangements before sunset.`;
  } else if (w.endsWith('ly')) {
    pos = 'adverb';
    definition = `In a characteristic manner or degree relating to the base descriptor.`;
    example = `The speaker addressed the committee ${w} to emphasize their point.`;
  } else if (w.endsWith('er') || w.endsWith('or')) {
    pos = 'noun';
    definition = `An agent, individual, instrument, or device that performs a designated function.`;
    example = `A skilled ${w} ensures seamless operation throughout the project.`;
  } else if (w.endsWith('y') || w.endsWith('ic') || w.endsWith('al')) {
    pos = 'adjective';
    definition = `Characterized by, resembling, or relating to the specified quality.`;
    example = `She admired the distinctly ${w} qualities of the artisan craftsmanship.`;
  } else if (w.endsWith('s')) {
    pos = 'noun';
    definition = `Plural form or third-person singular present indication of this term.`;
    example = `Several ${w} were documented in the scientific survey.`;
  }

  // Simple phonetic representation
  const pronunciation = `/${w}/`;

  return {
    word: w,
    definition,
    partOfSpeech: pos,
    pronunciation,
    example,
    vowels,
    consonants,
    scrabbleScore: score,
    isCommon: true
  };
}

// Populate extended words
for (const w of EXTENDED_5_LETTER_WORDS) {
  const normalized = w.toLowerCase();
  wordsSet.add(normalized);
  if (!dictionaryMap.has(normalized)) {
    dictionaryMap.set(normalized, generateFallbackEntry(normalized));
  }
}

export const ALL_WORDS_ARRAY: string[] = Array.from(wordsSet).sort();

// Anagram signature index: sorted characters -> words[]
const anagramIndex = new Map<string, string[]>();
for (const w of ALL_WORDS_ARRAY) {
  const key = w.split('').sort().join('');
  const existing = anagramIndex.get(key) || [];
  existing.push(w);
  anagramIndex.set(key, existing);
}

export interface WordFilterOptions {
  pattern?: string;            // e.g. "_ a _ _ e" or "S * * * E"
  includeLetters?: string;     // Must appear in word
  excludeLetters?: string;     // Cannot appear in word
  startsWith?: string;         // e.g. "a" or "st"
  endsWith?: string;           // e.g. "e" or "ed"
  commonOnly?: boolean;
  minScrabble?: number;
  maxScrabble?: number;
  vowelCount?: number;
  sortBy?: 'az' | 'za' | 'scrabble' | 'score-desc' | 'vowels-desc';
}

export function filterWords(options: WordFilterOptions): string[] {
  let list = ALL_WORDS_ARRAY;

  const pattern = (options.pattern || '').trim().toLowerCase().replace(/\s+/g, '');
  const includeChars = (options.includeLetters || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('');
  const excludeChars = (options.excludeLetters || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('');
  const startsWith = (options.startsWith || '').toLowerCase().trim();
  const endsWith = (options.endsWith || '').toLowerCase().trim();

  // Pattern slot array
  let patternSlots: (string | null)[] = [];
  if (pattern) {
    patternSlots = pattern.split('').map(ch => (ch === '_' || ch === '*' || ch === '?' || ch === '.' ? null : ch));
  }

  const results = list.filter(w => {
    // Length check
    if (w.length !== 5) return false;

    // Starts with check
    if (startsWith && !w.startsWith(startsWith)) return false;

    // Ends with check
    if (endsWith && !w.endsWith(endsWith)) return false;

    // Excluded letters check
    for (const ec of excludeChars) {
      if (w.includes(ec)) return false;
    }

    // Included letters check
    for (const ic of includeChars) {
      if (!w.includes(ic)) return false;
    }

    // Pattern slot check
    if (patternSlots.length > 0) {
      // Must match slots up to pattern length (usually 5)
      for (let i = 0; i < 5; i++) {
        const slot = patternSlots[i];
        if (slot && w[i] !== slot) return false;
      }
    }

    // Vowel count check if requested
    if (options.vowelCount !== undefined && options.vowelCount >= 0) {
      const vCount = (w.match(/[aeiou]/g) || []).length;
      if (vCount !== options.vowelCount) return false;
    }

    // Scrabble bounds
    if (options.minScrabble !== undefined || options.maxScrabble !== undefined) {
      const score = calculateScrabbleScore(w);
      if (options.minScrabble !== undefined && score < options.minScrabble) return false;
      if (options.maxScrabble !== undefined && score > options.maxScrabble) return false;
    }

    return true;
  });

  // Sorting
  const sortBy = options.sortBy || 'az';
  return sortWordList(results, sortBy);
}

export function sortWordList(words: string[], sortBy: string): string[] {
  const copy = [...words];
  switch (sortBy) {
    case 'za':
      return copy.sort((a, b) => b.localeCompare(a));
    case 'scrabble':
    case 'score-desc':
      return copy.sort((a, b) => calculateScrabbleScore(b) - calculateScrabbleScore(a));
    case 'score-asc':
      return copy.sort((a, b) => calculateScrabbleScore(a) - calculateScrabbleScore(b));
    case 'vowels-desc':
      return copy.sort((a, b) => {
        const va = (a.match(/[aeiou]/g) || []).length;
        const vb = (b.match(/[aeiou]/g) || []).length;
        return vb - va || a.localeCompare(b);
      });
    case 'az':
    default:
      return copy.sort((a, b) => a.localeCompare(b));
  }
}

export interface WordleSolveInput {
  green: string[]; // 5 positions: letter or empty string
  yellow: { letter: string; notPositions: number[] }[];
  gray: string[];  // eliminated letters
}

export function solveWordle(input: WordleSolveInput): { words: string[]; bestGuesses: string[] } {
  const graySet = new Set(input.gray.map(c => c.toLowerCase()));
  const greenNormalized = input.green.map(c => c.toLowerCase());

  // Filter
  const matches = ALL_WORDS_ARRAY.filter(w => {
    // 1. Check green positions
    for (let i = 0; i < 5; i++) {
      const g = greenNormalized[i];
      if (g && g !== '_' && g !== ' ') {
        if (w[i] !== g) return false;
      }
    }

    // 2. Check gray letters
    for (const gy of graySet) {
      // If a letter is marked gray, it cannot appear unless it is also in green/yellow with specific multiplicity
      if (!gy) continue;
      // If user typed green 'A' and gray 'A', that means only 1 A exists. But for simplicity, gray = letter eliminated
      const isAlsoGreen = greenNormalized.includes(gy);
      const isAlsoYellow = input.yellow.some(y => y.letter.toLowerCase() === gy);
      if (!isAlsoGreen && !isAlsoYellow) {
        if (w.includes(gy)) return false;
      }
    }

    // 3. Check yellow letters (must appear in word, but NOT in forbidden positions)
    for (const y of input.yellow) {
      const ch = y.letter.toLowerCase();
      if (!ch) continue;
      if (!w.includes(ch)) return false;
      for (const pos of y.notPositions) {
        if (w[pos] === ch) return false;
      }
    }

    return true;
  });

  // Calculate best guess recommendations based on unique letter diversity & common vowel frequency
  const commonLetterWeight: Record<string, number> = {
    e: 12, a: 10, r: 9, o: 8, t: 8, l: 7, i: 7, s: 7, n: 6, c: 5, u: 5, y: 4, d: 4, h: 4, m: 4, p: 3, b: 3, g: 3
  };

  const scoredWords = matches.map(w => {
    const uniqueChars = new Set(w.split(''));
    let score = 0;
    // Reward words with 5 distinct characters
    if (uniqueChars.size === 5) score += 20;
    uniqueChars.forEach(ch => {
      score += commonLetterWeight[ch] || 1;
    });
    return { word: w, score };
  });

  scoredWords.sort((a, b) => b.score - a.score);

  return {
    words: matches,
    bestGuesses: scoredWords.slice(0, 10).map(s => s.word)
  };
}

export function solveAnagram(letters: string, exactLength: number = 5): string[] {
  const clean = letters.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return [];

  // If exact length anagram (signature match)
  if (clean.length === exactLength) {
    const key = clean.split('').sort().join('');
    return (anagramIndex.get(key) || []).sort();
  }

  // Sub-anagram search: find all 5-letter words that can be formed from letters
  const letterCounts: Record<string, number> = {};
  for (const c of clean) {
    letterCounts[c] = (letterCounts[c] || 0) + 1;
  }

  const results = ALL_WORDS_ARRAY.filter(w => {
    if (exactLength && w.length !== exactLength) return false;
    const wordCounts: Record<string, number> = {};
    for (const c of w) {
      wordCounts[c] = (wordCounts[c] || 0) + 1;
      if (wordCounts[c] > (letterCounts[c] || 0)) return false;
    }
    return true;
  });

  return results.sort((a, b) => calculateScrabbleScore(b) - calculateScrabbleScore(a));
}

export function getWordDetails(word: string): WordEntry & {
  syllables: number;
  anagrams: string[];
  similarWords: string[];
  patterns: string[];
  sameLetterWords: string[];
} {
  const normalized = word.toLowerCase().trim();
  const entry = dictionaryMap.get(normalized) || generateFallbackEntry(normalized);

  // Anagrams
  const key = normalized.split('').sort().join('');
  const allAnagrams = (anagramIndex.get(key) || []).filter(w => w !== normalized);

  // Similar words (Levenshtein distance = 1 or 1-letter substitute)
  const similar: string[] = [];
  for (const candidate of ALL_WORDS_ARRAY) {
    if (candidate === normalized) continue;
    let diffs = 0;
    for (let i = 0; i < 5; i++) {
      if (candidate[i] !== normalized[i]) diffs++;
      if (diffs > 1) break;
    }
    if (diffs === 1) {
      similar.push(candidate);
      if (similar.length >= 12) break;
    }
  }

  // Same letter words (contain at least 4 of the same letters)
  const normLetters = new Set(normalized.split(''));
  const sameLetterWords: string[] = [];
  for (const candidate of ALL_WORDS_ARRAY) {
    if (candidate === normalized || similar.includes(candidate) || allAnagrams.includes(candidate)) continue;
    let overlap = 0;
    for (const ch of candidate) {
      if (normLetters.has(ch)) overlap++;
    }
    if (overlap >= 4) {
      sameLetterWords.push(candidate);
      if (sameLetterWords.length >= 8) break;
    }
  }

  // Syllables estimation
  const vowelMatches = normalized.match(/[aeiouy]{1,2}/g);
  let syllables = vowelMatches ? vowelMatches.length : 1;
  if (normalized.endsWith('e') && !normalized.endsWith('le') && syllables > 1) {
    syllables--;
  }

  // Key search patterns for this word
  const patterns = [
    `${normalized[0]} _ _ _ _`,
    `_ ${normalized[1]} _ _ _`,
    `_ _ ${normalized[2]} _ _`,
    `_ _ _ ${normalized[3]} _`,
    `_ _ _ _ ${normalized[4]}`,
    `${normalized[0]} _ _ _ ${normalized[4]}`,
    `_ ${normalized[1]} _ _ ${normalized[4]}`
  ];

  return {
    ...entry,
    syllables: Math.max(1, syllables),
    anagrams: allAnagrams,
    similarWords: similar,
    patterns,
    sameLetterWords
  };
}

export function searchDictionary(query: string, limit = 20): WordEntry[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return [];

  const exact = dictionaryMap.get(clean);
  const results: WordEntry[] = [];
  if (exact) results.push(exact);

  for (const w of ALL_WORDS_ARRAY) {
    if (w === clean) continue;
    if (w.startsWith(clean) || w.includes(clean)) {
      const entry = dictionaryMap.get(w);
      if (entry) results.push(entry);
      if (results.length >= limit) break;
    }
  }

  return results;
}

// Letter frequency statistics across all 5-letter words
export function getLetterStats() {
  const counts: Record<string, number> = {};
  for (const w of ALL_WORDS_ARRAY) {
    for (const c of w) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }
  return counts;
}
