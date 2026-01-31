
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
    setNotes((prev) => [note, ...prev]);
  };

  const removeNote = (index) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  return { notes, addNote, removeNote };
}

