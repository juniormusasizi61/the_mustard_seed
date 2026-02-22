# Google One Tap Sign-In Setup Guide

The OneTapSignIn function is not responding because it's missing the required configuration. Here's how to fix it:

## Why it's not working:
- No environment variables configured (no `.env` file)
- Missing Google Client ID
- Missing Firebase configuration

## Steps to fix:

### 1. Create Environment File
```bash
# Copy the example file
cp .env.example .env
```

### 2. Set up Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General tab
4. In "Your apps" section, add a web app
5. Copy the configuration values to your `.env` file

### 3. Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add your domains to authorized origins:
   - `http://localhost:5174` (for development)
   - Your production domain
6. Copy the Client ID to your `.env` file as `VITE_GOOGLE_CLIENT_ID`

### 4. Enable Authentication in Firebase
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Go to Sign-in method tab
4. Enable Google sign-in provider
5. Add your Google OAuth Client ID and secret

## Example .env file:
```env
VITE_FIREBASE_API_KEY=AIzaSyExample123lskjfksjfslkjfsExample
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

## Testing:
1. Restart your development server after creating `.env`
2. Visit the app - you should see the Google One Tap prompt
3. In development mode, you'll see error messages in the bottom-right if configuration is wrong

## Security Notes:
- Never commit the `.env` file to version control
- Use different Client IDs for development and production
- The `.env.example` file shows the required format without real credentials