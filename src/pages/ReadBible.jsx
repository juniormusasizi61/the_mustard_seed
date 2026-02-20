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


import { useState, useEffect, useMemo } from "react";
import { getBibleForVersion } from "../data/bible";
import { useBibleApi } from "../hooks/useBibleApi";
import { useFavorites } from "../hooks/useFavorites";
import AlertModal, { shouldShowAlert } from "../components/common/AlertModal";
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
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showTestamentPicker, setShowTestamentPicker] = useState(false);
  const isPickerOpen = showChapterPicker || showBookPicker || showTestamentPicker;
  // selected bible version (translation id)
  const [selectedVersion, setSelectedVersion] = useState(() => {
    try { return localStorage.getItem('bible_version') || 'kjv'; } catch { return 'kjv'; }
  });

  const [pickerScrolled, setPickerScrolled] = useState(false);
  
  const { fetchChapter, loading, error } = useBibleApi();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { bookmark, saveBookmark } = useBookmark();

  // Get bible books based on selected version
  const bibleData = getBibleForVersion(selectedVersion);
  const currentOldTestament = bibleData.oldTestament;
  const currentNewTestament = bibleData.newTestament;
  const allCurrentBooks = bibleData.allBooks;

  // Group consecutive favorite verses (same book & chapter, consecutive verse numbers)
  const groupedFavorites = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];

    // Helper to get book order index
    const bookIndex = (name) => {
      const idx = allCurrentBooks.findIndex(b => b.book === name);
      return idx === -1 ? 9999 : idx;
    };

    // Sort favorites by book order, chapter, verse
    const sorted = [...favorites].sort((a, b) => {
      const bi = bookIndex(a.book) - bookIndex(b.book);
      if (bi !== 0) return bi;
      const ci = (a.chapter || 0) - (b.chapter || 0);
      if (ci !== 0) return ci;
      return (a.verse || a.verseNumber || 0) - (b.verse || b.verseNumber || 0);
    });

    const groups = [];
    for (const fav of sorted) {
      const vnum = fav.verse || fav.verseNumber || fav.verseNumber === 0 ? fav.verse || fav.verseNumber : fav.verse;
      if (groups.length === 0) {
        groups.push({ book: fav.book, chapter: fav.chapter, start: vnum, end: vnum, text: fav.text });
        continue;
      }
      const last = groups[groups.length - 1];
      if (fav.book === last.book && fav.chapter === last.chapter && Number(vnum) === Number(last.end) + 1) {
        // extend range
        last.end = Number(vnum);
      } else {
        groups.push({ book: fav.book, chapter: fav.chapter, start: Number(vnum), end: Number(vnum), text: fav.text });
      }
    }

    return groups;
  }, [favorites, allCurrentBooks]);

  // Word-limit for favorite preview depending on screen width (5-7 words)
  const [favWordLimit, setFavWordLimit] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 480;
    if (w <= 360) return 5;
    if (w <= 480) return 6;
    return 7;
  });

  useEffect(() => {
    const updateLimit = () => {
      const w = window.innerWidth;
      if (w <= 360) setFavWordLimit(5);
      else if (w <= 480) setFavWordLimit(6);
      else setFavWordLimit(7);
    };
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  const truncateWords = (text, limit) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '…';
  };
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
      if (e.key === 'bible_version' && e.newValue) {
        setSelectedVersion(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Disable background scroll when any picker is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isPickerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [isPickerOpen]);

  // Watch for scrolling in the read content area to update picker bar style
  useEffect(() => {
    const el = document.querySelector('.readbible-content');
    if (!el) return;
    const onScroll = () => {
      setPickerScrolled(el.scrollTop > 8);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    // initialize
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
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
        const version = localStorage.getItem('bible_version') || selectedVersion || 'kjv';
        const chapterData = await fetchChapter(selectedBook.book, selectedChapter, version);
        if (chapterData) {
          setCurrentChapter(chapterData);
          setActiveTab("verses");
          // Save bookmark
          saveBookmark(selectedBook, selectedChapter);
          // Scroll reading container to top so the chapter starts at top of view
          setTimeout(() => {
            const el = document.querySelector('.readbible-content');
            if (el && typeof el.scrollTo === 'function') {
              try { el.scrollTo({ top: 0, behavior: 'smooth' }); } catch { el.scrollTop = 0; }
            } else {
              try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0,0); }
            }
          }, 50);
        }
      };
      loadChapter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, selectedChapter]);

  // Re-fetch chapter when version changes
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      const reload = async () => {
        const chapterData = await fetchChapter(selectedBook.book, selectedChapter, selectedVersion || 'kjv');
        if (chapterData) setCurrentChapter(chapterData);
      };
      reload();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVersion]);

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
      const book = allCurrentBooks.find(b => b.book === bookmark.book.book);
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
      if (shouldShowAlert('added_favorite')) {
        setAlertModal({
          isOpen: true,
          title: 'Added to Favorites',
          message: `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verseNumber} has been added to your favorites.`,
          type: 'success',
          showDontShowAgain: true,
          modalId: 'added_favorite'
        });
      }
    }
  };

  const handleFavoriteClick = (fav) => {
    const book = allCurrentBooks.find(b => b.book === fav.book);
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
        if (shouldShowAlert('added_favorite')) {
          setAlertModal({
            isOpen: true,
            title: 'Added to Favorites',
            message: `${book} ${chapter}:${verse} has been added to your favorites.`,
            type: 'success',
            showDontShowAgain: true,
            modalId: 'added_favorite'
          });
        }
    }
  };

  const handleBackToBooks = () => {
    setActiveTab("books");
    setSelectedBook(null);
    setSelectedChapter(null);
  };

  // Back to books replaced by Book Picker in verses view

  // Removed back-to-chapters flow in favor of chapter picker

  // Navigation helpers for previous/next chapter
  const getAdjacentChapter = (direction) => {
    if (!selectedBook || !selectedChapter) return null;
    
    const currentBookIndex = allCurrentBooks.findIndex(b => b.book === selectedBook.book);
    
    if (direction === 'next') {
      // Check if there's a next chapter in current book
      if (selectedChapter < selectedBook.chapters) {
        return {
          book: selectedBook,
          chapter: selectedChapter + 1
        };
      }
      // Move to first chapter of next book
      if (currentBookIndex < allCurrentBooks.length - 1) {
        return {
          book: allCurrentBooks[currentBookIndex + 1],
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
        const prevBook = allCurrentBooks[currentBookIndex - 1];
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
      <div className="readbible-content" aria-hidden={isPickerOpen}>
      {/* Header with navigation */}
      <div className="readbible-header">
        {activeTab === "chapters" && (
          <button 
            className="back-button" 
            onClick={handleBackToBooks}
          >
            ← Back
          </button>
        )}
        <h1 className="readbible-title">
          {activeTab === "books" && "Read the Bible"}
          {activeTab === "chapters" && selectedBook?.book}
        </h1>
        <div style={{ marginLeft: 'auto' }}>
          {/* Bible version selection moved to Settings (Profile -> Settings) */}
        </div>
      </div>

      {/* Picker bar (sticky) - keeps dropdowns visible while scrolling */}
      {activeTab === "verses" && (
        <div className={`picker-bar ${pickerScrolled ? 'scrolled' : ''}`} role="toolbar">
          <div className="picker-row">
            <button
              className="testament-picker-btn"
              onClick={() => setShowTestamentPicker(true)}
              aria-haspopup="dialog"
              aria-expanded={showTestamentPicker}
            >
              {currentOldTestament.some(b => b.book === selectedBook?.book) ? 'Old Testament' : 'New Testament'} ▼
            </button>
            <button
              className="book-picker-btn"
              onClick={() => setShowBookPicker(true)}
              aria-haspopup="dialog"
              aria-expanded={showBookPicker}
            >
              {selectedBook?.book || 'Select Book'} ▼
            </button>
            <button
              className="chapter-picker-btn"
              onClick={() => setShowChapterPicker(true)}
              aria-haspopup="dialog"
              aria-expanded={showChapterPicker}
            >
              Ch {selectedChapter} ▼
            </button>
          </div>
        </div>
      )}

      {/* Show selected book & chapter on its own line under the header when viewing verses */}
      {activeTab === "verses" && (
        <div className="book-chapter-line">
          <span className="book-name-large">{selectedBook?.book}</span>
          <span className="chapter-number">Ch {selectedChapter}</span>
        </div>
      )}

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
                {currentOldTestament.map(book => (
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
                {currentNewTestament.map(book => (
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
                  {groupedFavorites.map((g) => (
                    <div key={`${g.book}-${g.chapter}-${g.start}-${g.end}`} className="favorite-item">
                      <div 
                        className="favorite-content"
                        onClick={() => handleFavoriteClick({ book: g.book, chapter: g.chapter })}
                      >
                        <strong className="favorite-reference">
                          {g.book} {g.chapter}:{g.start === g.end ? g.start : `${g.start}-${g.end}`}
                        </strong>
                        <p className="favorite-text" title={g.text}>{truncateWords(g.text, favWordLimit)}</p>
                      </div>
                      <button 
                        className="remove-favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          // remove all favorites in this range
                          const toRemove = favorites.filter(f => f.book === g.book && f.chapter === g.chapter && f.verse >= g.start && f.verse <= g.end);
                          toRemove.forEach(f => removeFavorite(f.id));
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
              {/* Offline Indicator */}
              {currentChapter.fromCache && (
                <div className="offline-indicator">
                  📖 Reading offline
                </div>
              )}
              
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

      {/* Chapter Picker Overlay */}
      {showChapterPicker && selectedBook && (
        <div className="chapter-picker-overlay" onClick={() => setShowChapterPicker(false)}>
          <div className="chapter-picker-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="chapter-picker-header">
              <h3>Select Chapter</h3>
              <button className="close-button" onClick={() => setShowChapterPicker(false)} aria-label="Close">×</button>
            </div>
            <div className="chapters-grid picker-grid">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapterNum) => (
                <div
                  key={chapterNum}
                  className={`chapter-item ${chapterNum === selectedChapter ? 'active' : ''}`}
                  onClick={() => {
                    setShowChapterPicker(false);
                    handleChapterSelect(chapterNum);
                  }}
                >
                  {chapterNum}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book Picker Overlay (current testament) */}
      {showBookPicker && selectedBook && (
        <div className="chapter-picker-overlay" onClick={() => setShowBookPicker(false)}>
          <div className="chapter-picker-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="chapter-picker-header">
              <h3>Select Book</h3>
              <button className="close-button" onClick={() => setShowBookPicker(false)} aria-label="Close">×</button>
            </div>
            <div className="books-grid">
              {(currentOldTestament.some(b => b.book === selectedBook.book) ? currentOldTestament : currentNewTestament).map((book) => (
                <div
                  key={book.book}
                  className={`book-item ${book.book === selectedBook.book ? 'active' : ''}`}
                  onClick={() => {
                    setShowBookPicker(false);
                    setSelectedBook(book);
                    setCurrentChapter(null);
                    setSelectedChapter(1);
                  }}
                >
                  <span className="book-name">{book.book}</span>
                  <span className="book-chapters">{book.chapters}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testament Picker Overlay */}
      {showTestamentPicker && (
        <div className="chapter-picker-overlay" onClick={() => setShowTestamentPicker(false)}>
          <div className="chapter-picker-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="chapter-picker-header">
              <h3>Select Testament</h3>
              <button className="close-button" onClick={() => setShowTestamentPicker(false)} aria-label="Close">×</button>
            </div>
            <div className="testament-options">
              {(() => {
                const currentIsOld = currentOldTestament.some(b => b.book === selectedBook?.book);
                const options = [
                  { label: 'Old Testament', isOld: true, icon: '📜', books: currentOldTestament.length },
                  { label: 'New Testament', isOld: false, icon: '✝️', books: currentNewTestament.length },
                ];
                return options.map(opt => (
                  <div
                    key={opt.label}
                    className={`testament-card ${opt.isOld ? 'old' : 'new'} ${currentIsOld === opt.isOld ? 'active' : ''}`}
                    onClick={() => {
                      const nextBook = opt.isOld ? currentOldTestament[0] : currentNewTestament[0];
                      setSelectedBook(nextBook);
                      setSelectedChapter(1);
                      setCurrentChapter(null);
                      setShowTestamentPicker(false);
                      setShowBookPicker(true);
                    }}
                  >
                    <div className="testament-icon" aria-hidden="true">{opt.icon}</div>
                    <div className="testament-info">
                      <span className="testament-label">{opt.label}</span>
                      <span className="testament-sub">{opt.books} books</span>
                    </div>
                  </div>
                ));
              })()}
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
        showDontShowAgain={alertModal.showDontShowAgain}
        modalId={alertModal.modalId}
      />
      </div>
    </div>
  );
}