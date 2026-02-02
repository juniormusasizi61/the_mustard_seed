
import { useEffect, useState } from "react";

const STORAGE_KEY = "bible_ai_saved_notes";

export default function useSavedNotes() {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    const noteWithTimestamp = {
      title: note.title || "Untitled Note",
      content: note.content || "",
      tags: note.tags || [],
      savedAt: new Date().toISOString(),
      id: Date.now() + Math.random()
    };
    setNotes((prev) => [noteWithTimestamp, ...prev]);
  };

  const removeNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const updateNote = (noteId, updatedNote) => {
    setNotes((prev) => prev.map((note) => 
      note.id === noteId ? { ...note, ...updatedNote } : note
    ));
  };

  const groupNotesByDate = (notes) => {
    const groups = {};
    
    notes.forEach(note => {
      const date = note.savedAt ? new Date(note.savedAt) : new Date();
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(note);
    });
    
    return groups;
  };

  const groupNotesByTags = (notes) => {
    const groups = {};
    
    notes.forEach(note => {
      const tags = note.tags || ['Untagged'];
      tags.forEach(tag => {
        if (!groups[tag]) {
          groups[tag] = [];
        }
        if (!groups[tag].find(n => n.id === note.id)) {
          groups[tag].push(note);
        }
      });
    });
    
    return groups;
  };

  return { notes, addNote, removeNote, updateNote, groupNotesByDate, groupNotesByTags };
}

