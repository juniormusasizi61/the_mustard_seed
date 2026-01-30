// export default function ChapterNavigator({ chapter, onPrev, onNext }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "12px",
//       }}
//     >
//       <button onClick={onPrev}>◀</button>
//       <strong>Chapter {chapter}</strong>
//       <button onClick={onNext}>▶</button>
//     </div>
//   );
// }

// Improved ChapterNavigator component with better styling
export default function ChapterNavigator({ chapter, onPrev, onNext }) {
  return (
    <div className="chapter-nav">
      <button className="nav-btn" onClick={onPrev} aria-label="Previous chapter">◀</button>
      <div className="nav-title">Chapter {chapter}</div>
      <button className="nav-btn" onClick={onNext} aria-label="Next chapter">▶</button>
    </div>
  );
}