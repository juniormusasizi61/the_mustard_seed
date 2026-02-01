# Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Dependencies (Already Done ✅)
The Firebase package is already installed.

### Step 2: Set Up Firebase

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project" and follow the wizard

2. **Enable Authentication**
   - Go to Authentication → Get started
   - Enable "Email/Password" and "Google"

3. **Create Firestore Database**
   - Go to Firestore Database → Create database
   - Choose test mode for development

4. **Get Your Credentials**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" → Add Web app
   - Copy the config values

### Step 3: Configure Your App

1. **Create .env file**:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. **Add your Firebase credentials to .env**:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### Step 4: Add Firestore Security Rules

In Firebase Console → Firestore → Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Click "Publish"

### Step 5: Test It Out!

```bash
npm run dev
```

Then:
1. Go to `http://localhost:5173/signup`
2. Create an account
3. Start chatting - your messages will be saved!
4. Go to Profile → Chat History to see your chats
5. Click any chat to reload it

## That's It! 🎉

You now have:
- ✅ User authentication (email & Google)
- ✅ Persistent chat history
- ✅ ChatGPT-style interface
- ✅ Profile with chat management

## Need More Help?

See `FIREBASE_SETUP.md` for detailed instructions.
