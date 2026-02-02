
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
  const [viewMode, setViewMode] = useState('grid');
  const [previewNote, setPreviewNote] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

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

  const startEdit = (note) => {
    setEditingNote(note.id);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
    setEditTags(note.tags ? note.tags.join(', ') : '');
  };

  const saveEdit = (noteId) => {
    const tags = editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleEdit(noteId, {
      title: editTitle,
      content: editContent,
      tags
    });
    setEditingNote(null);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
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
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
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
        </div>
      </div>

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
              <div className={viewMode === 'list' ? 'saved-list' : 'saved-grid'}>
                {groupNotes.map((note) => (
                  viewMode === 'list' ? (
                    <div key={note.id || Math.random()} className="saved-list-item">
                      {editingNote === note.id ? (
                        <div className="list-edit-form">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="list-edit-title"
                            placeholder="Note title"
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="list-edit-content"
                            placeholder="Note content"
                            rows={3}
                          />
                          <input
                            type="text"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            className="list-edit-tags"
                            placeholder="Tags (comma separated)"
                          />
                          <div className="list-edit-actions">
                            <button className="list-action-btn save" onClick={() => saveEdit(note.id)} title="Save">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20,6 9,17 4,12"/>
                              </svg>
                            </button>
                            <button className="list-action-btn cancel" onClick={cancelEdit} title="Cancel">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="list-item-content">
                            <h3 className="list-item-title">{note.title || "Untitled Note"}</h3>
                            <p className="list-item-preview">{note.content?.slice(0, 100)}...</p>
                            <div className="list-item-meta">
                              <span className="list-item-date">{new Date(note.savedAt).toLocaleDateString()}</span>
                              {note.tags && note.tags.length > 0 && (
                                <div className="list-item-tags">
                                  {note.tags.map((tag, i) => (
                                    <span key={i} className="tag">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="list-item-actions">
                            <button className="list-action-btn" onClick={() => handlePreview(note)} title="Preview">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            <button className="list-action-btn" onClick={() => startEdit(note)} title="Edit">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button className="list-action-btn" onClick={() => removeNote(note.id)} title="Delete">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <SavedCard 
                      key={note.id || Math.random()} 
                      note={note} 
                      onDelete={() => removeNote(note.id)} 
                      onPreview={handlePreview}
                      onEdit={(updatedNote) => handleEdit(note.id, updatedNote)}
                    />
                  )
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