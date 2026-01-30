

// export default function SavedCard({ note, onDelete }) {
//   return (
//     <div className="saved-card">
//       <h4>{note.title}</h4>
//       <p>{note.content}</p>

//       <button onClick={onDelete} className="delete-btn">
//         Delete
//       </button>
//     </div>
//   );
// }

// Improved SavedCard component with better styling
export default function SavedCard({ note, onDelete }) {
  return (
    <article className="saved-card">
      <div className="saved-card-body">
        <h4 className="saved-title">{note.title || "Untitled"}</h4>
        <p className="saved-content">{note.content}</p>
      </div>

      <div className="saved-card-footer">
        <button className="delete-btn" onClick={onDelete} aria-label="Delete note">
          Delete
        </button>
      </div>
    </article>
  );
}