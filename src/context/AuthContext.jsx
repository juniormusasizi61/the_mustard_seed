import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import OneTapSignIn from '../components/auth/OneTapSignIn';
// lightweight local id generator (avoids extra dependency)
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // If there is no authenticated user, ensure local-only data is fresh for a new visitor.
      if (!currentUser) {
        try {
          const instance = localStorage.getItem('app_instance_id');
          if (!instance) {
            // First time on this browser profile — clear any legacy local-only data
            clearLocalOnlyData();
            localStorage.setItem('app_instance_id', generateLocalId());
          }
        } catch (e) {
          // ignore localStorage errors
          void e;
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return userCredential;
  };

  // Sign in with email and password
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign out
  const logout = async () => {
    // Clear local-only data when a user signs out so the next person on this browser starts fresh
    try { clearLocalOnlyData(); localStorage.removeItem('app_instance_id'); } catch (e) { void e; }
    return signOut(auth);
  };

  // Remove local-only keys so a new visitor doesn't see previous user's data
  function clearLocalOnlyData() {
    try {
      const keysToRemove = [
        'bibleFavorites',
        'bible_ai_saved_notes',
        'bible_version',
        'bibleBookmark',
        'theme',
        'user_profile'
      ];

      keysToRemove.forEach(k => localStorage.removeItem(k));

      // remove any dontShow_* modal flags
      Object.keys(localStorage).forEach(k => {
        if (k && k.startsWith('dontShow_')) localStorage.removeItem(k);
      });
    } catch (e) { void e; }
  }

  // Allow manual reset from UI
  const resetLocalData = () => {
    clearLocalOnlyData();
    try { localStorage.setItem('app_instance_id', generateLocalId()); } catch (e) { void e; }
    // dispatch a storage event in case other tabs need to react
    try { window.dispatchEvent(new StorageEvent('storage', { key: 'app_instance_id', newValue: localStorage.getItem('app_instance_id') })); } catch (e) { void e; }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetLocalData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <>
          {!user && <OneTapSignIn />}
          {children}
        </>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
