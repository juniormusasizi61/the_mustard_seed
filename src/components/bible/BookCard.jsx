export default function BookCard({ book, onSelect }) {
  return (
    <div
      onClick={() => onSelect(book)}
      style={{
        padding: "14px",
        borderRadius: "12px",
        background: "#f4f4f4",
        cursor: "pointer",
        marginBottom: "10px",
      }}
    >
      {book.book}
    </div>
  );
}
