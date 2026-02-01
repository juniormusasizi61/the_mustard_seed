# Firebase Setup Guide for The Mustard Seed

This guide will help you set up Firebase authentication and Firestore for your chat history feature.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In your Firebase project, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable the following sign-in methods:
   - **Email/Password**: Toggle to enable
   - **Google**: Toggle to enable, add your project support email

## Step 3: Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose a location (select one closest to your users)
4. Start in **production mode** or **test mode**
   - For development, test mode is easier
   - For production, set up proper security rules (see below)

## Step 4: Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon near "Project Overview")
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "The Mustard Seed Web")
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 5: Configure Your App

1. Create a `.env` file in the root of your project:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Step 6: Set Up Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat documents - users can only access their own chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/signup` and create a test account
3. Try chatting and verify messages are saved
4. Check your Firebase console to see the data in Firestore

## Features Implemented

### Authentication
- ✅ Email/Password signup and login
- ✅ Google OAuth login
- ✅ User session management
- ✅ Protected routes

### Chat History
- ✅ Automatic chat saving to Firestore
- ✅ Chat history view in Profile
- ✅ Load previous chats
- ✅ Edit chat titles
- ✅ Delete chats
- ✅ Real-time sync across devices

### User Interface
- ✅ New Chat button
- ✅ Chat history sidebar
- ✅ Login/Signup pages
- ✅ Profile with tabs
- ✅ User indicator in chat

## Troubleshooting

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're logged in
- Verify the userId matches in the database

### "Firebase: Error (auth/...)"
- Check if authentication methods are enabled
- Verify your .env file has correct credentials
- Make sure .env variables start with `VITE_`

### Chat history not showing
- Check browser console for errors
- Verify Firestore rules allow read access
- Make sure you're logged in

## Security Best Practices

1. **Never commit `.env` to git** - It's in `.gitignore` already
2. **Use proper Firestore rules** - The rules above ensure users can only access their own chats
3. **Enable App Check** (optional) - Protects your backend from abuse
4. **Set up billing alerts** - Monitor Firebase usage to avoid unexpected costs

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
