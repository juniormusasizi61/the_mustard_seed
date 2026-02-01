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
import useSavedNotes from "../hooks/useSavedNotes";
import "../components/chat/chat.css";

export default function Chat() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "organic"
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);
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

  const toggleTheme = () => {
    setTheme((t) => (t === "organic" ? "brutalist" : "organic"));
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

  const userMsg = {
    id: Date.now(),
    role: "user",
    content: input.trim(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  adjustTextareaHeight();

  setIsProcessing(true);

  const backendUrl = import.meta.env.VITE_RAG_API_URL || "https://verilia-1.onrender.com";
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
      <div className="header">
        

        <button className="theme-toggle" onClick={toggleTheme}>
          <svg className="theme-icon" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </div>

      <div className="page-title">
        <h1>AI Bible Study</h1>
        <p className="page-subtitle">Ask questions about scripture, theology, and faith</p>
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

    </div>
  );
}