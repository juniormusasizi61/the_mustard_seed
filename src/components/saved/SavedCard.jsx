

export default function SavedCard({ note, onDelete }) {
  return (
    <div className="saved-card">
      <h4>{note.title}</h4>
      <p>{note.content}</p>

      <button onClick={onDelete} className="delete-btn">
        Delete
      </button>
    </div>
  );
}
