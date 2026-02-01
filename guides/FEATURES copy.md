# Feature Overview

## 🎯 What You Can Do Now

### 1. User Authentication

**Sign Up**
- Navigate to `/signup`
- Create account with email/password
- Or use Google OAuth for instant signup
- Automatically redirects to chat

**Login**
- Navigate to `/login`
- Enter credentials
- Or use Google OAuth
- Stays logged in across sessions

**Logout**
- Go to Profile page
- Click "Logout" button
- Clears session and returns to home

---

### 2. Chat Experience

**Start New Chat**
- Click "New Chat" button in header
- Creates fresh conversation
- Auto-saves to Firebase (if logged in)

**Send Messages**
- Type your Bible question
- Press Enter or click Send
- AI responds with biblical insights
- All messages auto-saved

**View Chat History**
- Click history icon in header
- See recent conversations in sidebar
- Click any chat to load it
- Seamlessly switch between chats

**Save AI Responses**
- Click "Save" button under any AI message
- Saves to your notes collection
- Access from Saved page

---

### 3. Profile & History Management

**Profile Tab**
- View your account info
- Edit name and email
- See stats (saved notes count)
- Logout option

**Chat History Tab**
- View all your conversations
- Shows title, date, message count
- Preview first message
- Edit, delete, or open any chat

**Chat Management**
- ✏️ Edit: Click pencil to rename chat
- 🗑️ Delete: Remove unwanted conversations
- 📂 Open: Click card to load in Chat page
- 🔍 Preview: See first message snippet

---

### 4. Data Sync

**Automatic Saving**
- Every message saved to Firestore
- Works in real-time
- No manual save needed
- Syncs across devices

**Chat Titles**
- Auto-generated from first message
- Can be edited anytime
- Helps identify conversations
- Truncated if too long

**Timestamps**
- Tracks creation time
- Shows last update
- Displays relative time (e.g., "2h ago")
- Sorts by most recent

---

## 🎨 UI Features

### Theme Support
Both organic (dark/green) and brutalist (light/bold) themes fully supported for:
- Auth pages (Login/Signup)
- Chat interface
- Profile tabs
- Chat history

### Responsive Design
- Works on mobile and desktop
- Touch-friendly buttons
- Adaptive layouts
- Readable on all screens

### Visual Feedback
- Toast notifications for actions
- Loading states during processing
- Error messages when needed
- Active state indicators

---

## 🔐 Security & Privacy

**User Isolation**
- Each user only sees their own chats
- Firestore rules enforce privacy
- Auth required for history features
- Secure credential storage

**Guest Mode**
- Can chat without login
- Messages not saved
- Prompt to login for history
- No data collection

**Data Protection**
- Firebase credentials in .env
- Not committed to git
- Secure authentication
- Encrypted data transmission

---

## 💡 Tips & Tricks

1. **Quick Chat Switch**: Use the history sidebar to quickly jump between conversations without leaving the chat page

2. **Organize Chats**: Rename chats with descriptive titles to easily find them later

3. **Save Important Responses**: Click "Save" on AI messages you want to reference later in the Saved page

4. **Clean Up**: Delete old or test chats to keep your history organized

5. **Cross-Device**: Login from any device to access your full chat history

6. **Google Sign-In**: Use Google OAuth for fastest setup - no password to remember!

---

## 🚀 Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Esc**: Close chat history sidebar (when open)

---

## 📱 Supported Features

✅ Email/Password Authentication
✅ Google OAuth
✅ Real-time message saving
✅ Chat history persistence
✅ Cross-device sync
✅ Chat title editing
✅ Chat deletion
✅ Recent chats sidebar
✅ Profile management
✅ Theme switching
✅ Responsive design
✅ Toast notifications
✅ Error handling
✅ Loading states

---

## 🎓 Use Cases

**Bible Study Groups**
- Save group discussion topics
- Share insights later
- Review past studies

**Personal Devotion**
- Track your spiritual journey
- Revisit meaningful conversations
- Build a personal archive

**Scripture Research**
- Keep organized by topic
- Quick reference to past queries
- Build a knowledge base

**Teaching Preparation**
- Prepare lessons
- Save relevant explanations
- Access from anywhere

Enjoy your enhanced Bible study experience! 📖✨
