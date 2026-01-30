export default function SavedCard({ note }) {
  return (
    <div className="saved-card">
      <h4>{note.title}</h4>
      <p>{note.content}</p>
    </div>
  );
}
