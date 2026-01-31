
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


//improved saved notes page with better layout and delete confirmation
import useSavedNotes from "../hooks/useSavedNotes";
import SavedCard from "../components/saved/SavedCard";
import "../components/saved/saved.css";

export default function Saved() {
  const { notes, removeNote } = useSavedNotes();

  return (
    <div className="container saved-page">
      <div className="page-title">
        <h1>Saved Notes</h1>
        <p className="page-subtitle">Your collected insights and highlights</p>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state saved-empty">
          <div className="empty-icon">📚</div>
          <div className="empty-text">You haven't saved any notes yet.</div>
        </div>
      ) : (
        <div className="saved-grid">
          {notes.map((note, i) => (
            <SavedCard key={i} note={note} onDelete={() => removeNote(i)} />
          ))}
        </div>
      )}
    </div>
  );
}