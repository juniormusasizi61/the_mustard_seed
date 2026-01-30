export default function ChapterNavigator({ chapter, onPrev, onNext }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      }}
    >
      <button onClick={onPrev}>◀</button>
      <strong>Chapter {chapter}</strong>
      <button onClick={onNext}>▶</button>
    </div>
  );
}
