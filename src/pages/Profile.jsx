
//improved profile page with logic for different features 
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useSavedNotes from "../hooks/useSavedNotes";
import { resetAllModalPreferences } from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";
import "./profile.css";

export default function Profile() {
  const { user, logout: firebaseLogout } = useAuth();
  const { notes } = useSavedNotes();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'settings'
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "organic"
  );
  const photoURL = user?.photoURL || null;
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [localUser, setLocalUser] = useState(() => {
    if (!user) return null;
    
    const stored = localStorage.getItem("user_profile");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore parse errors
      }
    }
    return {
      name: user?.displayName || "User",
      email: user?.email || "",
    };
  });

  useEffect(() => {
    document.body.classList.remove("organic", "brutalist");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "organic" ? "brutalist" : "organic"));
  };

  const handleResetPreferences = () => {
    resetAllModalPreferences();
    setAlertModal({
      isOpen: true,
      title: 'Preferences Reset',
      message: 'All "Don\'t show again" preferences have been reset. You will now see all confirmation dialogs.',
      type: 'success'
    });
  };

  const saveProfile = () => {
    localStorage.setItem("user_profile", JSON.stringify(localUser));
    setEditing(false);
  };

  const cancelEdit = () => {
    const stored = localStorage.getItem("user_profile");
    if (stored) setLocalUser(JSON.parse(stored));
    setEditing(false);
  };

  const logout = async () => {
    if (!confirm("Log out?")) return;
    
    if (user) {
      // Firebase logout
      try {
        await firebaseLogout();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    
    localStorage.removeItem("user_profile");
    window.location.href = "/";
  };

  return (
    <div className="container profile-page">
      <div className="page-title">
        <h1>Profile</h1>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="profile-card">
          {!user ? (
            // Show sign-up prompt for non-logged-in users
            <>
              <div className="avatar">👤</div>
              <h2>Welcome!</h2>
              <p className="email">Create an account to save your chat history and notes</p>
              
              <div className="actions">
                <button onClick={() => window.location.href = '/signup'}>
                  Sign Up
                </button>
                <button onClick={() => window.location.href = '/login'}>
                  Login
                </button>
              </div>
            </>
          ) : (
            // Show profile for logged-in users
            <>
              {photoURL ? (
                <img
                  className="avatar-img"
                  src={photoURL}
                  alt={(localUser?.name || user?.displayName || 'Profile') + ' avatar'}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="avatar">👤</div>
              )}

              {!editing ? (
                <>
                  <h2>{localUser?.name}</h2>
                  <p className="email">{localUser?.email}</p>

                  <div className="stats">
                    <div>
                      <strong>{notes.length}</strong>
                      <span>Saved</span>
                    </div>
                    <div>
                      <strong>{notes.length}</strong>
                      <span>Notes</span>
                    </div>
                  </div>

                  <div className="actions">
                    <button onClick={() => setEditing(true)}>Edit Profile</button>
                    <button className="danger" onClick={logout}>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gap: "8px", width: "100%", marginBottom: "12px" }}>
                    <label>
                      Name
                      <input
                        value={localUser?.name || ''}
                        onChange={(e) => setLocalUser((u) => ({ ...u, name: e.target.value }))}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        value={localUser?.email || ''}
                        onChange={(e) => setLocalUser((u) => ({ ...u, email: e.target.value }))}
                      />
                    </label>
                  </div>

                  <div className="actions">
                    <button onClick={saveProfile}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="settings-section">
          <div className="settings-card">
            <h3>Appearance</h3>
            <div className="setting-item">
              <div className="setting-info">
                <label>Theme</label>
                <p className="setting-description">Switch between Organic and Brutalist themes</p>
              </div>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'organic' ? '🌿 Organic' : '⬛ Brutalist'}
              </button>
            </div>
          </div>

          <div className="settings-card">
            <h3>Notifications & Dialogs</h3>
            <div className="setting-item">
              <div className="setting-info">
                <label>Reset Modal Preferences</label>
                <p className="setting-description">Clear all "Don't show again" preferences for confirmation dialogs</p>
              </div>
              <button className="reset-btn" onClick={handleResetPreferences}>
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}