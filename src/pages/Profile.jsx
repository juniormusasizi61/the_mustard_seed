// import './profile.css';


// const Profile = () => {
//   return (
//     <div className="profile-page">
//       <div className="profile-card">
//         <div className="avatar">👤</div>

//         <h2>John Doe</h2>
//         <p className="email">johndoe@email.com</p>

//         <div className="stats">
//           <div>
//             <strong>12</strong>
//             <span>Saved</span>
//           </div>
//           <div>
//             <strong>5</strong>
//             <span>Notes</span>
//           </div>
//         </div>

//         <div className="actions">
//           <button>Edit Profile</button>
//           <button className="danger">Logout</button>
//         </div>
//       </div>
//     </div>
//   );
  
// };

// export default Profile;


//improved profile page with logic for different features 
import { useState } from "react";
import useSavedNotes from "../hooks/useSavedNotes";
import "./profile.css";

export default function Profile() {
  const { notes } = useSavedNotes();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user_profile");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore parse errors
      }
    }
    return {
      name: "John Doe",
      email: "johndoe@email.com",
    };
  });

  const saveProfile = () => {
    localStorage.setItem("user_profile", JSON.stringify(user));
    setEditing(false);
  };

  const cancelEdit = () => {
    const stored = localStorage.getItem("user_profile");
    if (stored) setUser(JSON.parse(stored));
    setEditing(false);
  };

  const logout = () => {
    if (!confirm("Log out?")) return;
    localStorage.removeItem("user_profile");
    // optionally clear other session keys here
    window.location.href = "/";
  };

  return (
    <div className="container profile-page">
      <div className="page-title">
        <h1>Profile</h1>
      </div>

      <div className="profile-card">
        <div className="avatar">👤</div>

        {!editing ? (
          <>
            <h2>{user.name}</h2>
            <p className="email">{user.email}</p>

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
            <div style={{ display: "grid", gap: 8, width: "100%", marginBottom: 12 }}>
              <label>
                Name
                <input
                  value={user.name}
                  onChange={(e) => setUser((u) => ({ ...u, name: e.target.value }))}
                />
              </label>
              <label>
                Email
                <input
                  value={user.email}
                  onChange={(e) => setUser((u) => ({ ...u, email: e.target.value }))}
                />
              </label>
            </div>

            <div className="actions">
              <button onClick={saveProfile}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}