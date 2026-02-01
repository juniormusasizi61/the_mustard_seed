import { useState } from 'react';

export function useBookmark() {
  const [bookmark, setBookmark] = useState(() => {
    const saved = localStorage.getItem('bibleBookmark');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading bookmark:', e);
        return null;
      }
    }
    return null;
  });

  const saveBookmark = (book, chapter) => {
    const newBookmark = {
      book,
      chapter,
      timestamp: new Date().toISOString()
    };
    
    setBookmark(newBookmark);
    localStorage.setItem('bibleBookmark', JSON.stringify(newBookmark));
  };

  const clearBookmark = () => {
    setBookmark(null);
    localStorage.removeItem('bibleBookmark');
  };

  return { bookmark, saveBookmark, clearBookmark };
}