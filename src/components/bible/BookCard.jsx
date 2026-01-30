// export default function BookCard({ book, onSelect }) {
//   return (
//     <div
//       onClick={() => onSelect(book)}
//       style={{
//         padding: "14px",
//         borderRadius: "12px",
//         background: "#f4f4f4",
//         cursor: "pointer",
//         marginBottom: "10px",
//       }}
//     >
//       {book.book}
//     </div>
//   );
// }

// Improved BookCard component with better styling
export default function BookCard({ book, onSelect, selected }) {
  return (
    <div
      className={`book-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(book)}
    >
      <div className="book-title">{book.book}</div>
      <div className="book-meta">{book.chapters.length} chapter{book.chapters.length > 1 ? "s" : ""}</div>
    </div>
  );
}