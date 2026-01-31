import { useState, useEffect } from 'react';

export function useBookmark() {
  const [bookmark, setBookmark] = useState(null);

  // Load bookmark from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bibleBookmark');
    if (saved) {
      try {
        setBookmark(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading bookmark:', e);
      }
    }
  }, []);

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
