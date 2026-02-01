import useSavedNotes from "../hooks/useSavedNotes";
import "./profile.css";
import { useAuth } from "../context/AuthContext";

// Profile page component
export default function Profile() {
  const { notes } = useSavedNotes();
  const { user, logout } = useAuth();

  // Render profile page
  return (
    <div className="container profile-page">
      <div className="page-title">
        <h1>Profile</h1>
      </div>

      <div className="profile-card">
        <div className="avatar" style={{ overflow: "hidden", borderRadius: "50%" }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "User"} style={{ width: 72, height: 72 }} />
          ) : (
            <span>👤</span>
          )}
        </div>

        <h2>{user?.displayName || "User"}</h2>
        <p className="email">{user?.email || ""}</p>

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
          <button className="danger" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}