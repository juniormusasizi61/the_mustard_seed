import { useState } from 'react';

const API_BASE = 'https://bible-api.com';

function normalizeBookName(name){
  return String(name || '').toLowerCase().replace(/\./g,'').trim();
}

export function useBibleApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocalChapter = async (book, chapter, translation) => {
    try {
      const ver = String(translation || 'kjv').toLowerCase();
      const res = await fetch(`/offline/bibles/${ver}.json`);
      if (!res.ok) throw new Error('Local bible not available');
      const json = await res.json();
      const want = normalizeBookName(book);
      const bookObj = (json.books || []).find(b => normalizeBookName(b.name) === want || normalizeBookName(b.name).startsWith(want));
      if (!bookObj) throw new Error('Book not found in local bible');
      const chap = (bookObj.chapters || []).find(c => Number(c.chapter) === Number(chapter));
      if (!chap) throw new Error('Chapter not found in local bible');
      const verses = Object.entries(chap.verses || {}).map(([v, t]) => ({ verse: Number(v), text: String(t) }));
      return { chapter: Number(chapter), verses };
    } catch (e) {
      return null;
    }
  };

  // Fetch a specific chapter. Prefers local files when present (works offline).
  const fetchChapter = async (book, chapter, translation = 'kjv') => {
    setLoading(true);
    setError(null);

    try {
      // Try local first (works when offline and when local files are present)
      try {
        const local = await fetchLocalChapter(book, chapter, translation);
        if (local) return local;
      } catch(_){}

      // If not found locally, fall back to remote API
      const doFetch = async (trans) => {
        const res = await fetch(
          `${API_BASE}/${encodeURIComponent(book)}+${chapter}?translation=${encodeURIComponent(trans)}`
        );
        if (!res.ok) throw new Error('Failed to fetch chapter');
        return res.json();
      };

      try {
        const data = await doFetch(translation);
        return {
          chapter: Number(chapter),
          verses: (data.verses || []).map(v => ({ verse: v.verse, text: v.text.trim() }))
        };
      } catch (primaryErr) {
        // If primary translation failed and it's not KJV, try KJV as a graceful fallback
        if (translation && translation.toLowerCase() !== 'kjv') {
          try {
            const fallbackData = await doFetch('kjv');
            setError(null);
            return {
              chapter: Number(chapter),
              verses: (fallbackData.verses || []).map(v => ({ verse: v.verse, text: v.text.trim() }))
            };
          } catch (fallbackErr) {
            setError(fallbackErr.message || primaryErr.message);
            return null;
          }
        }
        setError(primaryErr.message);
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchChapter, loading, error };
}