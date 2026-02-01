import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserChats, deleteChat, updateChatTitle } from '../../services/chatService';
import { useNavigate } from 'react-router-dom';
import './ChatHistory.css';

export default function ChatHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (user) {
      loadChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const userChats = await getUserChats(user.uid);
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this chat?')) return;
    
    try {
      await deleteChat(chatId);
      setChats(chats.filter(c => c.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  const handleEdit = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async (chatId, e) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;
    
    try {
      await updateChatTitle(chatId, editTitle);
      setChats(chats.map(c => c.id === chatId ? { ...c, title: editTitle } : c));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Failed to update title');
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const handleChatClick = (chat) => {
    // Navigate to chat page with chat ID as state
    navigate('/chat', { state: { chatId: chat.id, messages: chat.messages } });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="chat-history-loading">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return (
      <div className="chat-history-empty">
        <div className="empty-icon">💬</div>
        <p>No chat history yet</p>
        <p className="empty-subtitle">Start a conversation in the Chat page</p>
      </div>
    );
  }

  return (
    <div className="chat-history-container">
      <h2 className="chat-history-title">Your Chat History</h2>
      <p className="chat-history-subtitle">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
      
      <div className="chat-history-list">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className="chat-history-card"
            onClick={() => handleChatClick(chat)}
          >
            <div className="chat-card-header">
              {editingId === chat.id ? (
                <div className="edit-title-container" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-title-input"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button onClick={(e) => handleSaveEdit(chat.id, e)} className="save-edit-btn">
                      ✓
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-edit-btn">
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="chat-card-title">{chat.title}</h3>
                  <div className="chat-card-actions">
                    <button 
                      onClick={(e) => handleEdit(chat, e)} 
                      className="edit-btn"
                      title="Edit title"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => handleDelete(chat.id, e)} 
                      className="delete-btn"
                      title="Delete chat"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="chat-card-info">
              <span className="chat-message-count">
                {chat.messages?.length || 0} messages
              </span>
              <span className="chat-timestamp">
                {formatDate(chat.updatedAt)}
              </span>
            </div>

            {chat.messages && chat.messages.length > 0 && (
              <div className="chat-preview">
                {chat.messages[0].content.slice(0, 100)}
                {chat.messages[0].content.length > 100 ? '...' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
