import { useState, useEffect } from 'react';

const API_BASE = 'https://bible-api.com';

export function useBibleApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch a specific chapter
  const fetchChapter = async (book, chapter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE}/${encodeURIComponent(book)}+${chapter}?translation=kjv`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch chapter');
      }
      
      const data = await response.json();
      
      // Transform API response to match our data structure
      return {
        chapter: chapter,
        verses: data.verses.map(v => ({
          verse: v.verse,
          text: v.text.trim()
        }))
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchChapter, loading, error };
}
