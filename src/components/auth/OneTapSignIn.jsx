import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';

const OneTapSignIn = () => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set; Google One Tap disabled.');
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        await signInWithCredential(auth, credential);
      } catch (err) {
        console.error('One Tap sign-in failed', err);
      }
    };

    const initialize = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Show the One Tap prompt
        window.google.accounts.id.prompt();
      }
    };

    // Load the Google Identity Services script if it's not present
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initialize;
      document.head.appendChild(script);

      return () => {
        try { document.head.removeChild(script); } catch (e) {}
      };
    } else {
      initialize();
    }
  }, []);

  return null;
};

export default OneTapSignIn;
