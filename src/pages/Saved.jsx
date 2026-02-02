
// import "../components/saved/saved.css";
// import useSavedNotes from "../hooks/useSavedNotes";
// import SavedCard from "../components/saved/SavedCard";

// export default function Saved() {
//   const { notes, removeNote } = useSavedNotes();

//   return (
//     <div>
//       <h2 style={{ marginBottom: "16px" }}>Saved Notes</h2>

//       {notes.length === 0 ? (
//         <p>No saved notes yet.</p>
//       ) : (
//         <div className="saved-grid">
//           {notes.map((note, index) => (
//             <SavedCard
//               key={index}
//               note={note}
//               onDelete={() => removeNote(index)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import useSavedNotes from "../hooks/useSavedNotes";
import SavedCard from "../components/saved/SavedCard";
import "../components/saved/saved.css";

export default function Saved() {
  const { notes, addNote, removeNote, updateNote, groupNotesByDate, groupNotesByTags } = useSavedNotes();
  const [sortBy, setSortBy] = useState('date');
  const [groupBy, setGroupBy] = useState('date');
  const [previewNote, setPreviewNote] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  const groupedNotes = groupBy === 'tags' ? groupNotesByTags(sortedNotes) : groupNotesByDate(sortedNotes);

  const handlePreview = (note) => {
    setPreviewNote(note);
  };

  const handleEdit = (noteId, updatedNote) => {
    updateNote(noteId, updatedNote);
  };

  const handleAddNote = () => {
    const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    addNote({
      title: newTitle || "Untitled Note",
      content: newContent,
      tags
    });
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowAddForm(false);
  };

  const closePreview = () => {
    setPreviewNote(null);
  };

  const cancelAdd = () => {
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowAddForm(false);
  };

  return (
      <div className="saved-page">
        <div className="page-title">
          <h1>Saved Notes</h1>
          <p className="page-subtitle">Your collected insights and highlights</p>
        </div>

      <div className="saved-header">
        <div className="saved-controls">
          <label className="sort-label">
            Group by:
            <select 
              value={groupBy} 
              onChange={(e) => setGroupBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date</option>
              <option value="tags">Tags</option>
            </select>
          </label>
          <label className="sort-label">
            Sort by:
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date Saved</option>
              <option value="title">Title</option>
            </select>
          </label>
        </div>
      </div>

      <button 
        className="add-note-btn" 
        onClick={() => setShowAddForm(true)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Note
      </button>

      {showAddForm && (
        <div className="add-note-modal">
          <div className="add-note-form">
            <h3>Add New Note</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title"
              className="edit-title-input"
            />
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="edit-tags-input"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Note content"
              className="edit-content-textarea"
              rows={8}
            />
            <div className="edit-actions">
              <button onClick={handleAddNote} className="save-btn">Save Note</button>
              <button onClick={cancelAdd} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {notes.length === 0 && !showAddForm ? (
        <div className="empty-state saved-empty">
          <div className="empty-icon">📚</div>
          <div className="empty-text">You haven't saved any notes yet.</div>
        </div>
      ) : notes.length > 0 ? (
        <div className="saved-content">
          {Object.entries(groupedNotes).map(([groupName, groupNotes]) => (
            <div key={groupName} className="saved-date-group">
              <div className="date-group-header">{groupName}</div>
              <div className="saved-grid">
                {groupNotes.map((note) => (
                  <SavedCard 
                    key={note.id || Math.random()} 
                    note={note} 
                    onDelete={() => removeNote(note.id)} 
                    onPreview={handlePreview}
                    onEdit={(updatedNote) => handleEdit(note.id, updatedNote)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {previewNote && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h2>{previewNote.title || "Untitled Note"}</h2>
              <button className="close-preview" onClick={closePreview}>×</button>
            </div>
            <div className="preview-body">
              {previewNote.content}
            </div>
          </div>
        </div>
      )}
    </div>)
}