export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export function updateSeo(config: SeoConfig) {
  // Update Title
  document.title = config.title;

  // Update Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', config.description);

  // Update Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', config.canonicalUrl);

  // Update OpenGraph
  setMetaProperty('og:title', config.title);
  setMetaProperty('og:description', config.description);
  setMetaProperty('og:url', config.canonicalUrl);
  setMetaProperty('og:type', config.ogType || 'website');
  if (config.ogImage) {
    setMetaProperty('og:image', config.ogImage);
  }

  // Update Twitter
  setMetaProperty('twitter:title', config.title);
  setMetaProperty('twitter:description', config.description);
  if (config.ogImage) {
    setMetaProperty('twitter:image', config.ogImage);
  }

  // Update JSON-LD structured data
  if (config.jsonLd) {
    let scriptTag = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(config.jsonLd);
  }
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (property.startsWith('og:')) {
      el.setAttribute('property', property);
    } else {
      el.setAttribute('name', property);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Analytics Tracker
export interface AnalyticsEvent {
  timestamp: string;
  type: string;
  label: string;
  metadata?: Record<string, any>;
}

class SearchAnalytics {
  private events: AnalyticsEvent[] = [];

  constructor() {
    try {
      const stored = localStorage.getItem('5lw_analytics');
      if (stored) {
        this.events = JSON.parse(stored).slice(-200);
      }
    } catch {
      // ignore
    }
  }

  track(type: string, label: string, metadata?: Record<string, any>) {
    const event: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      type,
      label,
      metadata
    };
    this.events.unshift(event);
    if (this.events.length > 200) {
      this.events = this.events.slice(0, 200);
    }
    try {
      localStorage.setItem('5lw_analytics', JSON.stringify(this.events));
    } catch {
      // ignore
    }

    // Also support Google Analytics gtag if installed
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', type, {
        event_label: label,
        ...metadata
      });
    }
  }

  getRecentSearches(limit = 10): AnalyticsEvent[] {
    return this.events.slice(0, limit);
  }

  getStats() {
    const total = this.events.length;
    const searches = this.events.filter(e => e.type === 'word_search').length;
    const wordle = this.events.filter(e => e.type === 'wordle_solve').length;
    const anagrams = this.events.filter(e => e.type === 'anagram_search').length;
    return { total, searches, wordle, anagrams };
  }
}

export const analytics = new SearchAnalytics();
