// import useSavedNotes from "../hooks/useSavedNotes";
// import SavedCard from "../components/saved/SavedCard";
// import "../components/saved/saved.css";

// export default function Saved() {
//   const { notes } = useSavedNotes();
//   //temporary sample saved data 
//    const demoNotes = [
//     {
//       title: "Meaning of John 3",
//       content: "John 3 explains the concept of being born again and God's love.",
//     },
//     {
//       title: "What is Repentance?",
//       content: "Repentance means turning away from sin and returning to God.",
//     },
//   ];

//   const displayNotes = notes.length > 0 ? notes : demoNotes;

//   return (
//     <div>
//       <h2 style={{ marginBottom: "16px" }}>Saved Notes</h2>

//       {displayNotes.length === 0 ? (
//         <p>No saved notes yet.</p>
//       ) : (
//         <div className="saved-grid">
//           {displayNotes.map((note, index) => (
//             <SavedCard key={index} note={note} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import "../components/saved/saved.css";
import useSavedNotes from "../hooks/useSavedNotes";
import SavedCard from "../components/saved/SavedCard";

export default function Saved() {
  const { notes, removeNote } = useSavedNotes();

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Saved Notes</h2>

      {notes.length === 0 ? (
        <p>No saved notes yet.</p>
      ) : (
        <div className="saved-grid">
          {notes.map((note, index) => (
            <SavedCard
              key={index}
              note={note}
              onDelete={() => removeNote(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
