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


import { useState, useEffect } from "react";
import { oldTestament, newTestament } from "../data/bible";
import { useBibleApi } from "../hooks/useBibleApi";
import { useFavorites } from "../hooks/useFavorites";
import AlertModal from "../components/common/AlertModal";
import { useBookmark } from "../hooks/useBookmark";
import "../components/readbible/readbible.css";

export default function ReadBible() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "organic"
  );
  const [activeTab, setActiveTab] = useState("books"); // books, chapters, verses
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [expandedTestament, setExpandedTestament] = useState({ old: false, new: false, favorites: false });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  
  const { fetchChapter, loading, error } = useBibleApi();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { bookmark, saveBookmark } = useBookmark();

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.body.classList.remove("organic", "brutalist");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for theme changes from other pages
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "theme" && e.newValue) {
        setTheme(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTestament = (testament) => {
    setExpandedTestament(prev => ({
      ...prev,
      [testament]: !prev[testament]
    }));
  };

  // Fetch chapter data when a chapter is selected
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      const loadChapter = async () => {
        const chapterData = await fetchChapter(selectedBook.book, selectedChapter);
        if (chapterData) {
          setCurrentChapter(chapterData);
          setActiveTab("verses");
          // Save bookmark
          saveBookmark(selectedBook, selectedChapter);
        }
      };
      loadChapter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, selectedChapter]);

  // Handle text selection for favorites
  useEffect(() => {
    const handleSelection = () => {
      if (activeTab !== "verses" || !currentChapter) return;
      
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 10) {
        // Find which verse was selected
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const verseElement = container.nodeType === 3 
          ? container.parentElement.closest('.verse-item')
          : container.closest('.verse-item');
        
        if (verseElement) {
          const verseNumber = verseElement.querySelector('.verse-number')?.textContent;
          if (verseNumber) {
            setSelectedText(text);
            setSelectedVerse({
              book: selectedBook.book,
              chapter: selectedChapter,
              verseNumber: parseInt(verseNumber),
              text: text
            });
            setShowAddFavorite(true);
          }
        }
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [activeTab, currentChapter, selectedBook, selectedChapter]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setActiveTab("chapters");
  };

  const handleChapterSelect = (chapterNum) => {
    setSelectedChapter(chapterNum);
  };

  const handleResumeReading = () => {
    if (bookmark) {
      const allBooks = [...oldTestament, ...newTestament];
      const book = allBooks.find(b => b.book === bookmark.book.book);
      if (book) {
        setSelectedBook(book);
        setSelectedChapter(bookmark.chapter);
      }
    }
  };

  const handleAddToFavorites = () => {
    if (selectedVerse) {
      addFavorite(selectedVerse);
      setShowAddFavorite(false);
      setSelectedVerse(null);
      // Clear selection
      window.getSelection().removeAllRanges();

      // Show success alert
      setAlertModal({
        isOpen: true,
        title: 'Added to Favorites',
        message: `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verseNumber} has been added to your favorites.`,
        type: 'success'
      });
    }
  };

  const handleFavoriteClick = (fav) => {
    const allBooks = [...oldTestament, ...newTestament];
    const book = allBooks.find(b => b.book === fav.book);
    if (book) {
      setSelectedBook(book);
      setSelectedChapter(fav.chapter);
    }
  };

  const toggleFavoriteForVerse = (verseObj) => {
    const { verse } = verseObj;
    const book = selectedBook?.book;
    const chapter = selectedChapter;
    if (!book || !chapter) return;

    if (isFavorite(book, chapter, verse)) {
      // Find favorite id and remove
      const fav = favorites.find(
        (f) => f.book === book && f.chapter === chapter && f.verse === verse
      );
      if (fav) removeFavorite(fav.id);
    } else {
      addFavorite({
        book,
        chapter,
        verseNumber: verse,
        text: verseObj.text,
      });

      // Show success alert
      setAlertModal({
        isOpen: true,
        title: 'Added to Favorites',
        message: `${book} ${chapter}:${verse} has been added to your favorites.`,
        type: 'success'
      });
    }
  };

  const handleBackToBooks = () => {
    setActiveTab("books");
    setSelectedBook(null);
    setSelectedChapter(null);
  };

  const handleBackToChapters = () => {
    setActiveTab("chapters");
    setSelectedChapter(null);
    setCurrentChapter(null);
  };

  // Navigation helpers for previous/next chapter
  const getAdjacentChapter = (direction) => {
    if (!selectedBook || !selectedChapter) return null;
    
    const allBooks = [...oldTestament, ...newTestament];
    const currentBookIndex = allBooks.findIndex(b => b.book === selectedBook.book);
    
    if (direction === 'next') {
      // Check if there's a next chapter in current book
      if (selectedChapter < selectedBook.chapters) {
        return {
          book: selectedBook,
          chapter: selectedChapter + 1
        };
      }
      // Move to first chapter of next book
      if (currentBookIndex < allBooks.length - 1) {
        return {
          book: allBooks[currentBookIndex + 1],
          chapter: 1
        };
      }
      return null; // Last chapter of Bible
    } else {
      // Check if there's a previous chapter in current book
      if (selectedChapter > 1) {
        return {
          book: selectedBook,
          chapter: selectedChapter - 1
        };
      }
      // Move to last chapter of previous book
      if (currentBookIndex > 0) {
        const prevBook = allBooks[currentBookIndex - 1];
        return {
          book: prevBook,
          chapter: prevBook.chapters
        };
      }
      return null; // First chapter of Bible
    }
  };

  const handleNavigateChapter = (direction) => {
    const adjacent = getAdjacentChapter(direction);
    if (adjacent) {
      setSelectedBook(adjacent.book);
      setSelectedChapter(adjacent.chapter);
    }
  };

  const prevChapter = selectedBook && selectedChapter ? getAdjacentChapter('prev') : null;
  const nextChapter = selectedBook && selectedChapter ? getAdjacentChapter('next') : null;

  return (
    <div className="readbible-mobile">
      {/* Header with navigation */}
      <div className="readbible-header">
        {activeTab !== "books" && (
          <button 
            className="back-button" 
            onClick={activeTab === "chapters" ? handleBackToBooks : handleBackToChapters}
          >
            ← Back
          </button>
        )}
        <h1 className="readbible-title">
          {activeTab === "books" && "Read the Bible"}
          {activeTab === "chapters" && selectedBook?.book}
          {activeTab === "verses" && `${selectedBook?.book} ${selectedChapter}`}
        </h1>
      </div>

      {/* Books Tab */}
      {activeTab === "books" && (
        <div className="tab-content books-tab">
          {/* Resume Reading Banner */}
          {bookmark && (
            <div className="resume-banner" onClick={handleResumeReading}>
              <div className="resume-content">
                <span className="resume-icon">📖</span>
                <div className="resume-text">
                  <strong>Continue Reading</strong>
                  <p>{bookmark.book.book} Chapter {bookmark.chapter}</p>
                </div>
              </div>
              <span className="resume-arrow">→</span>
            </div>
          )}

          <div className="testament-section">
            <div 
              className="testament-header"
              onClick={() => toggleTestament('old')}
            >
              <h2 className="testament-label">Old Testament</h2>
              <span className={`dropdown-arrow ${expandedTestament.old ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>
            {expandedTestament.old && (
              <div className="books-grid">
                {oldTestament.map((book) => (
                  <div
                    key={book.book}
                    className="book-item"
                    onClick={() => handleBookSelect(book)}
                  >
                    <span className="book-name">{book.book}</span>
                    <span className="book-chapters">{book.chapters}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="testament-section">
            <div 
              className="testament-header"
              onClick={() => toggleTestament('new')}
            >
              <h2 className="testament-label">New Testament</h2>
              <span className={`dropdown-arrow ${expandedTestament.new ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>
            {expandedTestament.new && (
              <div className="books-grid">
                {newTestament.map((book) => (
                  <div
                    key={book.book}
                    className="book-item"
                    onClick={() => handleBookSelect(book)}
                  >
                    <span className="book-name">{book.book}</span>
                    <span className="book-chapters">{book.chapters}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Section - Only show if there are favorites */}
          {favorites.length > 0 && (
            <div className="testament-section">
              <div 
                className="testament-header"
                onClick={() => toggleTestament('favorites')}
              >
                <h2 className="testament-label">
                  ⭐ Favorite Verses ({favorites.length})
                </h2>
                <span className={`dropdown-arrow ${expandedTestament.favorites ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              {expandedTestament.favorites && (
                <div className="favorites-list">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="favorite-item">
                      <div 
                        className="favorite-content"
                        onClick={() => handleFavoriteClick(fav)}
                      >
                        <strong className="favorite-reference">
                          {fav.book} {fav.chapter}:{fav.verse}
                        </strong>
                        <p className="favorite-text">{fav.text}</p>
                      </div>
                      <button 
                        className="remove-favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(fav.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chapters Tab */}
      {activeTab === "chapters" && selectedBook && (
        <div className="tab-content chapters-tab">
          <div className="chapters-grid">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapterNum) => (
              <div
                key={chapterNum}
                className="chapter-item"
                onClick={() => handleChapterSelect(chapterNum)}
              >
                {chapterNum}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verses Tab */}
      {activeTab === "verses" && (
        <div className="tab-content verses-tab">
          {loading && (
            <div className="loading-state">
              <p>Loading chapter...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Error loading chapter: {error}</p>
              <button onClick={() => handleChapterSelect(selectedChapter)}>Retry</button>
            </div>
          )}

          {currentChapter && !loading && (
            <div className="verses-layout">
              <div className="verses-container">
                {currentChapter.verses.map((verse) => {
                  const favActive = isFavorite(
                    selectedBook?.book,
                    selectedChapter,
                    verse.verse
                  );
                  return (
                    <div key={verse.verse} className="verse-item">
                      <span className="verse-number">{verse.verse}</span>
                      <span className="verse-text">{verse.text}</span>
                      <button
                        className={`fav-toggle-btn ${favActive ? "active" : ""}`}
                        title={favActive ? "Remove from favorites" : "Add to favorites"}
                        onClick={() => toggleFavoriteForVerse(verse)}
                      >
                        {favActive ? "★" : "☆"}
                      </button>
                    </div>
                  );
                })}

              {/* Chapter Navigation Buttons */}
              <div className="chapter-navigation-buttons">
                {prevChapter && (
                  <button 
                    className="nav-chapter-btn prev-btn"
                    onClick={() => handleNavigateChapter('prev')}
                  >
                    <span className="arrow">←</span>
                    <span className="btn-text">
                      <span className="book-name-short">{prevChapter.book.book}</span>
                      <span className="chapter-num">Ch {prevChapter.chapter}</span>
                    </span>
                  </button>
                )}
                
                {nextChapter && (
                  <button 
                    className="nav-chapter-btn next-btn"
                    onClick={() => handleNavigateChapter('next')}
                  >
                    <span className="btn-text">
                      <span className="book-name-short">{nextChapter.book.book}</span>
                      <span className="chapter-num">Ch {nextChapter.chapter}</span>
                    </span>
                    <span className="arrow">→</span>
                  </button>
                )}
              </div>
              </div>
              <aside className="favorites-sidebar">
                <div className="favorites-sidebar-header">
                  <span className="favorites-sidebar-title">⭐ Favorites</span>
                  <span className="favorites-count">{favorites.length}</span>
                </div>
                <div className="favorites-sidebar-list">
                  {favorites.filter((f) => f.book === selectedBook?.book && f.chapter === selectedChapter).length === 0 ? (
                    <p className="favorites-empty">No favorites in this chapter yet.</p>
                  ) : (
                    favorites
                      .filter((f) => f.book === selectedBook?.book && f.chapter === selectedChapter)
                      .map((fav) => (
                        <div key={fav.id} className="favorites-sidebar-item" onClick={() => handleFavoriteClick(fav)}>
                          <span className="fav-ref">{fav.book} {fav.chapter}:{fav.verse}</span>
                          <button
                            className="remove-fav-small"
                            onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
                            aria-label="Remove favorite"
                          >
                            ×
                          </button>
                          <p className="fav-text">{fav.text}</p>
                        </div>
                      ))
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      )}

      {/* Add to Favorites Modal */}
      {showAddFavorite && selectedVerse && (
        <div className="favorite-modal-overlay" onClick={() => setShowAddFavorite(false)}>
          <div className="favorite-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add to Favorites</h3>
            <div className="selected-verse-preview">
              <strong>{selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verseNumber}</strong>
              <p>"{selectedText}"</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddFavorite(false)}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleAddToFavorites}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal for actions */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal((m) => ({ ...m, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}