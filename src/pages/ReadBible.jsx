import { useState } from "react";
import { bible } from "../data/bible";
import BookCard from "../components/bible/BookCard";
import ChapterNavigator from "../components/bible/ChapterNavigator";
import VerseList from "../components/bible/VerseList";

export default function ReadBible() {
  const [selectedBook, setSelectedBook] = useState(bible[0]);
  const [chapterIndex, setChapterIndex] = useState(0);

  const chapter = selectedBook.chapters[chapterIndex];
  const isDesktop = window.innerWidth > 768;


  return (
    <div
     style={{
  display: "grid",
  gridTemplateColumns: "1fr",
  ...(isDesktop && { gridTemplateColumns: "1fr 2fr" }),
  
  gap: "20px",
}}

    >
      {/* Books List */}
      <div>
        {bible.map((b) => (
          <BookCard
            key={b.book}
            book={b}
            onSelect={() => {
              setSelectedBook(b);
              setChapterIndex(0);
            }}
          />
        ))}
      </div>

      {/* Reading Area */}
      <div>
        <ChapterNavigator
          chapter={chapter.chapter}
          onPrev={() =>
            setChapterIndex((i) => Math.max(i - 1, 0))
          }
          onNext={() =>
            setChapterIndex((i) =>
              Math.min(i + 1, selectedBook.chapters.length - 1)
            )
          }
        />

        <VerseList
          verses={chapter.verses}
          onExplain={(verse) =>
            alert(`Explain verse ${verse.verse}`)
          }
        />
      </div>
    </div>
  );
}
