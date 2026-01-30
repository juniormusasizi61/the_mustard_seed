
export default function VerseList({ verses, onExplain }) {
  return (
    <div>
      {verses.map((v) => (
        <div key={v.verse} style={{ marginBottom: "12px" }}>
          <strong>{v.verse}</strong>. {v.text}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => onExplain(v)}
          >
            Explain
          </button>
        </div>
      ))}
    </div>
  );
}
