import { useState } from "react";

const STORAGE_KEY = "bible_ai_saved_notes";

export default function useSavedNotes() {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveNote = (note) => {
    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { notes, saveNote };
}
