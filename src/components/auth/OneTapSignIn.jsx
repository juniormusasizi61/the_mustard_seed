import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';

const OneTapSignIn = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Check if environment variables are configured
    if (!clientId || clientId === 'your-google-client-id-here.apps.googleusercontent.com') {
      console.warn('Google One Tap: VITE_GOOGLE_CLIENT_ID not configured. Set up your .env file with valid credentials.');
      setError('Google One Tap sign-in is not configured. Please check environment variables.');
      return;
    }

    // Check if Firebase is configured
    const firebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                               import.meta.env.VITE_FIREBASE_API_KEY !== 'your-firebase-api-key-here';
    
    if (!firebaseConfigured) {
      console.warn('Google One Tap: Firebase not configured properly.');
      setError('Firebase authentication is not configured.');
      return;
    }

    setIsConfigured(true);

    const handleCredentialResponse = async (response) => {
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        const result = await signInWithCredential(auth, credential);
        console.log('Google One Tap sign-in successful:', result.user.email);
      } catch (err) {
        console.error('One Tap sign-in failed:', err);
        setError('Failed to sign in with Google. Please try again.');
      }
    };

    const initialize = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Show the One Tap prompt
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log('Google One Tap prompt not shown:', notification.getNotDisplayedReason() || notification.getSkippedReason());
            }
          });
        } catch (err) {
          console.error('Failed to initialize Google One Tap:', err);
          setError('Failed to initialize Google One Tap.');
        }
      }
    };

    // Load the Google Identity Services script if it's not present
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initialize;
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        setError('Failed to load Google sign-in service.');
      };
      document.head.appendChild(script);

      return () => {
        try { 
          document.head.removeChild(script); 
        } catch (e) {
          // Script may have been removed already
        }
      };
    } else {
      initialize();
    }
  }, []);

  // Development helper - show configuration status in development mode
  if (import.meta.env.DEV && !isConfigured && error) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#ff6b6b',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <strong>Dev Note:</strong> {error}
        <br />
        <small>Create .env file from .env.example</small>
      </div>
    );
  }

  return null;
};

export default OneTapSignIn;
