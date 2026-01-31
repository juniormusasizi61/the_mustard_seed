import { useState } from 'react';

const API_BASE = 'https://bible-api.com';

export function useSimilarVerses() {
  const [searching, setSearching] = useState(false);
  const [similarVerses, setSimilarVerses] = useState([]);

  // Search for similar verses based on selected text
  const searchSimilarVerses = async (searchText) => {
    setSearching(true);
    setSimilarVerses([]);
    
    try {
      // Extract key words from the selected text (simple approach)
      const keywords = extractKeywords(searchText);
      
      // Search using the API's search functionality
      const response = await fetch(
        `${API_BASE}/${keywords}?translation=kjv`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search verses');
      }
      
      const data = await response.json();
      
      // Format the results
      if (data.verses) {
        setSimilarVerses(data.verses.map(v => ({
          reference: v.book_name + ' ' + v.chapter + ':' + v.verse,
          text: v.text.trim()
        })));
      }
      
      return similarVerses;
    } catch (err) {
      console.error('Error searching verses:', err);
      return [];
    } finally {
      setSearching(false);
    }
  };

  // Simple keyword extraction (remove common words)
  const extractKeywords = (text) => {
    const commonWords = ['the', 'and', 'of', 'to', 'in', 'a', 'is', 'that', 'for', 'it', 'with', 'as', 'was', 'his', 'he', 'i', 'be', 'not', 'but', 'they', 'you', 'are', 'have', 'from', 'or', 'had', 'by', 'this', 'at', 'all'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Return first significant word for search
    return words[0] || text.split(' ')[0];
  };

  return { searchSimilarVerses, searching, similarVerses };
}
