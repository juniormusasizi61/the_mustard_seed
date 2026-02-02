import { useState } from "react";

export default function SavedCard({ note, onDelete, onPreview, onEdit }) {
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title || '');
  const [editContent, setEditContent] = useState(note.content || '');
  const [editTags, setEditTags] = useState((note.tags || []).join(', '));

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPreviewText = (content) => {
    if (!content) return '';
    return content.length > 120 ? content.slice(0, 120) + '...' : content;
  };

  const handleSaveEdit = () => {
    const tags = editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onEdit({ title: editTitle, content: editContent, tags });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
    setEditTags((note.tags || []).join(', '));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="saved-card editing">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Note title"
            className="edit-title-input"
          />
          <input
            type="text"
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="edit-tags-input"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Note content"
            className="edit-content-textarea"
            rows={6}
          />
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="save-btn">Save</button>
            <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="saved-card" onClick={() => onPreview && onPreview(note)}>
      <div className="saved-card-header">
        <h3 className="saved-title">{note.title || "Untitled Note"}</h3>
        <span className="saved-timestamp">{formatDate(note.savedAt)}</span>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="saved-tags">
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="saved-card-body">
        <div className="saved-preview">
          {getPreviewText(note.content)}
        </div>
      </div>

      <div className="saved-card-footer">
        <button 
          className="edit-btn" 
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          title="Edit note"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button 
          className="preview-btn" 
          onClick={(e) => {
            e.stopPropagation();
            setShowPreview(!showPreview);
          }}
          title={showPreview ? 'Hide preview' : 'Show preview'}
        >
          {showPreview ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <path d="M1 1l22 22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
        <button 
          className="delete-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }} 
          title="Delete note"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>

      {showPreview && (
        <div className="saved-full-preview">
          <div className="preview-content">
            {note.content}
          </div>
        </div>
      )}
    </article>
  );
}