import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('bibleFavorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading favorites:', e);
        return [];
      }
    }
    return [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bibleFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (verse) => {
    const newFavorite = {
      id: Date.now(),
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verseNumber,
      text: verse.text,
      timestamp: new Date().toISOString()
    };

    setFavorites(prev => [newFavorite, ...prev]);
    return true;
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (book, chapter, verseNumber) => {
    return favorites.some(
      fav => fav.book === book && fav.chapter === chapter && fav.verse === verseNumber
    );
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}