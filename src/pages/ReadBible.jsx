// import { useState } from "react";
// import { bible } from "../data/bible";
// import BookCard from "../components/bible/BookCard";
// import ChapterNavigator from "../components/bible/ChapterNavigator";
// import VerseList from "../components/bible/VerseList";

// export default function ReadBible() {
//   const [selectedBook, setSelectedBook] = useState(bible[0]);
//   const [chapterIndex, setChapterIndex] = useState(0);

//   const chapter = selectedBook.chapters[chapterIndex];
//   const isDesktop = window.innerWidth > 768;


//   return (
//     <div
//      style={{
//   display: "grid",
//   gridTemplateColumns: "1fr",
//   ...(isDesktop && { gridTemplateColumns: "1fr 2fr" }),
  
//   gap: "20px",
// }}

//     >
//       {/* Books List */}
//       <div>
//         {bible.map((b) => (
//           <BookCard
//             key={b.book}
//             book={b}
//             onSelect={() => {
//               setSelectedBook(b);
//               setChapterIndex(0);
//             }}
//           />
//         ))}
//       </div>

//       {/* Reading Area */}
//       <div>
//         <ChapterNavigator
//           chapter={chapter.chapter}
//           onPrev={() =>
//             setChapterIndex((i) => Math.max(i - 1, 0))
//           }
//           onNext={() =>
//             setChapterIndex((i) =>
//               Math.min(i + 1, selectedBook.chapters.length - 1)
//             )
//           }
//         />

//         <VerseList
//           verses={chapter.verses}
//           onExplain={(verse) =>
//             alert(`Explain verse ${verse.verse}`)
//           }
//         />
//       </div>
//     </div>
//   );
// }


//improved ReadBible page layout with responsive design
import { useState } from "react";
import { bible } from "../data/bible";
import BookCard from "../components/bible/BookCard";
import ChapterNavigator from "../components/bible/ChapterNavigator";
import VerseList from "../components/bible/VerseList";
import "../components/readbible/readbible.css";

export default function ReadBible() {
  const [selectedBook, setSelectedBook] = useState(bible[0]);
  const [chapterIndex, setChapterIndex] = useState(0);

  const chapter = selectedBook.chapters[chapterIndex];

  return (
    <div className="container readbible-page">
      <div className="page-title">
        <h1>Read the Bible</h1>
        <p className="page-subtitle">Browse books, chapters, and get quick explanations</p>
      </div>

      <div className="readbible-grid" style={{ gap: "20px" }}>
        <aside className="books-column">
          {bible.map((b) => (
            <BookCard
              key={b.book}
              book={b}
              selected={b.book === selectedBook.book}
              onSelect={() => {
                setSelectedBook(b);
                setChapterIndex(0);
              }}
            />
          ))}
        </aside>

        <section className="reading-column">
          <ChapterNavigator
            chapter={chapter.chapter}
            onPrev={() => setChapterIndex((i) => Math.max(i - 1, 0))}
            onNext={() =>
              setChapterIndex((i) => Math.min(i + 1, selectedBook.chapters.length - 1))
            }
          />

          <div className="chapter-card">
            <h3>
              {selectedBook.book} — Chapter {chapter.chapter}
            </h3>

            <VerseList
              verses={chapter.verses}
              onExplain={(verse) => alert(`Explain verse ${verse.verse}: ${verse.text}`)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}