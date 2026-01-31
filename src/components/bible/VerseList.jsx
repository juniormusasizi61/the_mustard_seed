
// export default function VerseList({ verses, onExplain }) {
//   return (
//     <div>
//       {verses.map((v) => (
//         <div key={v.verse} style={{ marginBottom: "12px" }}>
//           <strong>{v.verse}</strong>. {v.text}
//           <button
//             style={{ marginLeft: "10px" }}
//             onClick={() => onExplain(v)}
//           >
//             Explain
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// Improved VerseList component with better styling
export default function VerseList({ verses, onExplain }) {
  return (
    <div className="verse-list">
      {verses.map((v) => (
        <div key={v.verse} className="verse-card">
          <div className="verse-number">{v.verse}</div>
          <div className="verse-text">{v.text}</div>
          <button className="explain-btn" onClick={() => onExplain(v)}>Explain</button>
        </div>
      ))}
    </div>
  );
}