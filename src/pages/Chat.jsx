// // import useSavedNotes from "../hooks/useSavedNotes";

// // const mockResponse = {
// //   title: "John 3 Explained",
// //   content: "John 3 teaches about being born again through faith in Christ.",
// // };

// // export default function Chat() {
// //   const { addNote } = useSavedNotes();

// //   return (
// //     <div>
// //       <h2>Ask Bible AI</h2>

// //       {/* AI response mock */}
// //       <div className="ai-response">
// //         <p>{mockResponse.content}</p>

// //         <button
// //           onClick={() => addNote(mockResponse)}
// //           className="save-btn"
// //         >
// //           Save
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

//       //New chat with state-driven messages and save functionality
// import { useState } from "react";
// import useSavedNotes from "../hooks/useSavedNotes";
// import "../components/chat/chat.css";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const { addNote } = useSavedNotes();

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       role: "user",
//       content: input,
//     };

//     const aiMessage = {
//       id: Date.now() + 1,
//       role: "ai",
//       content:
//         "This is a mock AI response explaining the Bible passage you asked about.",
//     };

//     setMessages((prev) => [...prev, userMessage, aiMessage]);
//     setInput("");
//   };

//   const saveLastAIResponse = () => {
//     const lastAI = [...messages].reverse().find((m) => m.role === "ai");
//     if (!lastAI) return;

//     addNote({
//       title: "Saved Bible Insight",
//       content: lastAI.content,
//     });
//   };

//   return (
//     <div className="chat-page">
//       <h2>Ask Bible AI</h2>

//       <div className="chat-history">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`chat-bubble ${msg.role}`}>
//             <p>{msg.content}</p>
//           </div>
//         ))}
//       </div>

//       {messages.some((m) => m.role === "ai") && (
//         <button className="save-btn" onClick={saveLastAIResponse}>
//           Save Insight
//         </button>
//       )}

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask a Bible question..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }


    //improved chat UI design with theme toggle and suggestions
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createChat, updateChatMessages, getRecentChats, getChat, deleteChat } from "../services/chatService";
import useSavedNotes from "../hooks/useSavedNotes";
import ConfirmModal, { shouldShowModal } from "../components/common/ConfirmModal";
import "../components/chat/chat.css";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const [theme] = useState(() => localStorage.getItem("theme") || "organic");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    modalId: ''
  });
  const textareaRef = useRef(null);
  const { addNote, notes } = useSavedNotes();

  useEffect(() => {
    document.body.classList.remove("organic", "brutalist");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // adjust height on mount if needed
    adjustTextareaHeight();
  }, []);

  // Load recent chats when user is logged in
  useEffect(() => {
    if (user) {
      loadRecentChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load chat from navigation state (when coming from profile)
  useEffect(() => {
    if (location.state?.chatId) {
      loadChatById(location.state.chatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Auto-save messages to Firebase when they change
  useEffect(() => {
    if (user && currentChatId && messages.length > 0) {
      saveMessagesToFirebase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentChatId, user]);

  const loadChatById = async (chatId) => {
    try {
      const chat = await getChat(chatId);
      setCurrentChatId(chat.id);
      setMessages(chat.messages || []);
      showToast("Chat loaded");
    } catch (error) {
      console.error("Error loading chat:", error);
      showToast("Failed to load chat");
    }
  };

  const loadRecentChats = async () => {
    if (!user) return;
    try {
      const chats = await getRecentChats(user.uid, 10);
      setRecentChats(chats);
    } catch (error) {
      console.error("Error loading recent chats:", error);
    }
  };

  const saveMessagesToFirebase = async () => {
    if (!user || !currentChatId) return;
    try {
      await updateChatMessages(currentChatId, messages);
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const startNewChat = async () => {
    if (!user) {
      showToast("Please login to save chat history");
      setMessages([]);
      setCurrentChatId(null);
      return;
    }

    try {
      const newChat = await createChat(user.uid);
      setCurrentChatId(newChat.id);
      setMessages([]);
      await loadRecentChats();
      showToast("New chat started");
    } catch (error) {
      console.error("Error creating new chat:", error);
      showToast("Failed to create new chat");
    }
  };

  const loadChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setShowChatHistory(false);
    showToast("Chat loaded");
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent loading chat when clicking delete
    
    // Check if user has disabled this modal
    const modalId = 'delete_chat';
    if (!shouldShowModal(modalId)) {
      // Proceed directly with deletion
      await performDelete(chatId);
      return;
    }
    
    // Show confirmation modal
    setConfirmModal({
      isOpen: true,
      title: 'Delete Chat',
      message: 'Delete this chat? This cannot be undone.',
      modalId: modalId,
      onConfirm: () => performDelete(chatId)
    });
  };

  const performDelete = async (chatId) => {
    try {
      await deleteChat(chatId);
      
      // If deleting current chat, clear messages
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
      
      // Reload chat list
      await loadRecentChats();
      showToast("Chat deleted");
    } catch (error) {
      console.error("Error deleting chat:", error);
      showToast("Failed to delete chat");
    }
  };

  // Group chats by date
  const groupChatsByDate = (chats) => {
    const groups = {};
    
    chats.forEach(chat => {
      const date = chat.updatedAt?.toDate?.();
      let groupKey;
      
      if (date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const chatDate = new Date(date);
        chatDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        
        if (chatDate.getTime() === today.getTime()) {
          groupKey = 'Today';
        } else if (chatDate.getTime() === yesterday.getTime()) {
          groupKey = 'Yesterday';
        } else if (chatDate.getFullYear() === today.getFullYear()) {
          groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        } else {
          groupKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
      } else {
        groupKey = 'Recent';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(chat);
    });
    
    return groups;
  };


  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  // const sendMessage = async () => {
  //   if (!input.trim() || isProcessing) return;

  //   const userMsg = {
  //     id: Date.now(),
  //     role: "user",
  //     content: input.trim(),
  //   };

  //   setMessages((prev) => [...prev, userMsg]);
  //   setInput("");
  //   adjustTextareaHeight();

  //   // show typing indicator
  //   setIsProcessing(true);

  //   // Simulate async AI call; replace with real API call later.
  //   try {
  //     await new Promise((res) => setTimeout(res, 800));
  //     const assistantMsg = {
  //       id: Date.now() + 1,
  //       role: "assistant",
  //       content:
  //         "This is a mock AI response explaining the Bible passage you asked about. Replace this with your real AI call.",
  //     };
  //     setMessages((prev) => [...prev, assistantMsg]);
  //   } catch {
  //     const errMsg = {
  //       id: Date.now() + 2,
  //       role: "assistant",
  //       content: "Sorry, I couldn't reach the AI. Please try again.",
  //     };
  //     setMessages((prev) => [...prev, errMsg]);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };


  //This replaces the simulated AI call with a real backend RAG API call
  const sendMessage = async () => {
  if (!input.trim() || isProcessing) return;

  // Create new chat if not exists and user is logged in
  if (user && !currentChatId) {
    try {
      const newChat = await createChat(user.uid);
      setCurrentChatId(newChat.id);
      await loadRecentChats();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }

  const userMsg = {
    id: Date.now(),
    role: "user",
    content: input.trim(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  adjustTextareaHeight();

  setIsProcessing(true);

  const backendUrl = import.meta.env.VITE_RAG_API_URL || "https://verilia-final.onrender.com/chat";
  const apiKey = import.meta.env.VITE_RAG_API_KEY;
  // Prepare conversation history excluding user messages for context
  try {
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        question: userMsg.content,
        history: [...messages, userMsg], // include latest user message in context
      }),
    });
    // Handle non-2xx responses
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || `HTTP ${resp.status}`);
    }
    // Parse response
    const data = await resp.json();

    // Map your backend response to assistant text. Common keys tried here:
    const assistantText =
      data.answer || data.content || data.text || (Array.isArray(data.content) ? data.content.join("\n") : null) || "No response.";

    const assistantMsg = {
      id: Date.now() + 1,
      role: "assistant",
      content: assistantText,
    };

    // Append assistant message
    setMessages((prev) => [...prev, assistantMsg]);
  } catch (err) {
    console.error("RAG error:", err);
    const errMsg = {
      id: Date.now() + 2,
      role: "assistant",
      content: "Sorry, I couldn't reach the AI. Please try again.",
    };
    setMessages((prev) => [...prev, errMsg]);
  } finally {
    setIsProcessing(false);
  }
};


  // Helper to quickly set input and send
  const askQuestion = (q) => {
    setInput(q);
    // small delay so textarea updates visually, then send
    setTimeout(() => sendMessage(true), 120);
  };

  // Toast helper
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  };

  // Save AI message helper
  const saveAIMessage = (msg) => {
    if (!msg || !msg.content) return;
    const exists = notes.some((n) => n.content === msg.content);
    if (exists) {
      showToast("Already saved");
      return;
    }
    const title = msg.content.split("\n")[0].slice(0, 80) || "Saved Insight";
    addNote({
      title,
      content: msg.content,
    });
    showToast("Saved");
  };

  // Save last AI response helper
  const saveLastAIResponse = () => {
    const lastAI = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAI) {
      showToast("No AI response to save");
      return;
    }
    saveAIMessage(lastAI);
  };

  // Main render
      return (
    <div className="container chat-page">
      {/* Floating History Button */}
      <button 
        className="fab-history-btn" 
        onClick={() => setShowChatHistory(!showChatHistory)}
        title="Chat history"
        aria-label="Toggle chat history"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>

      {/* Backdrop Overlay */}
      {showChatHistory && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setShowChatHistory(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat History Sidebar */}
      {showChatHistory && (
        <div className="chat-history-sidebar">
          <div className="sidebar-header">
            <h3>Recent Chats</h3>
            <button 
              className="close-sidebar-btn"
              onClick={() => setShowChatHistory(false)}
              aria-label="Close sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          {/* New Chat Button in Sidebar */}
          <button className="sidebar-new-chat-btn" onClick={() => { startNewChat(); setShowChatHistory(false); }} title="Start new chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>New Chat</span>
          </button>
          
          {recentChats.length > 0 ? (
            <div className="chat-history-list">
            {Object.entries(groupChatsByDate(recentChats)).map(([dateGroup, chats]) => (
              <div key={dateGroup} className="chat-date-group">
                <div className="date-group-header">{dateGroup}</div>
                {chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChat(chat)}
                  >
                    <div className="chat-item-content">
                      <div className="chat-title">{chat.title}</div>
                      <div className="chat-date">
                        {chat.updatedAt?.toDate?.()?.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        }) || 'Recent'}
                      </div>
                    </div>
                    <button 
                      className="delete-chat-btn"
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      aria-label="Delete chat"
                      title="Delete chat"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          ) : (
            <div className="empty-history">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No chat history yet</p>
              <span>Start a conversation to see it here</span>
            </div>
          )}
        </div>
      )}

      <div className="page-title">
        <h1>AI Bible Study</h1>
        <p className="page-subtitle">
          Ask questions about scripture, theology, and faith
          {user && <span className="user-indicator"> • Logged in as {user.displayName || user.email}</span>}
          {!user && <span className="user-indicator"> • Login to save chat history</span>}
        </p>
      </div>

      <div className="suggestions">
        <div className="suggestion-label">Try asking:</div>
        <div className="suggestion-chips">
          <div className="suggestion-chip" onClick={() => askQuestion("What does this verse mean?")}>
            What does this verse mean?
          </div>
          <div className="suggestion-chip" onClick={() => askQuestion("Explain the context")}>
            Explain the context
          </div>
          <div className="suggestion-chip" onClick={() => askQuestion("Show me related verses")}>
            Show related verses
          </div>
        </div>
      </div>

      <div className="chat-container" id="chatContainer">
        {messages.length === 0 && (
          <div className="empty-state" id="emptyState">
            <div className="empty-icon">💬</div>
            <div className="empty-text">Start a conversation about scripture, ask theological questions, or explore the Bible together.</div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role === "user" ? "user" : "assistant"}`}>
            <div className="message-text">{msg.content}</div>
            
            {msg.role === "assistant" && (
              <div style={{ marginTop: 8 }}>
                <button className="save-btn" onClick={() => saveAIMessage(msg)}>Save</button>
              </div>
            )}

          </div>
        ))}

        {isProcessing && (
          <div className="typing-indicator" id="typingIndicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        )}
      </div>

      {messages.some((m) => m.role === "assistant") && (
        <button className="save-btn" onClick={saveLastAIResponse}>Save Last AI Response</button>
      )}

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder="Ask about any scripture or topic..."
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
        </div>
        <button className="send-button" id="sendButton" onClick={() => sendMessage()} disabled={isProcessing || !input.trim()}>
          <svg className="send-icon" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      
      {toast && <div className="toast">{toast}</div>}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        modalId={confirmModal.modalId}
        showDontShowAgain={true}
      />

    </div>
  );
}
