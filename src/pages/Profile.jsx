import './profile.css';


const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar">👤</div>

        <h2>John Doe</h2>
        <p className="email">johndoe@email.com</p>

        <div className="stats">
          <div>
            <strong>12</strong>
            <span>Saved</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Notes</span>
          </div>
        </div>

        <div className="actions">
          <button>Edit Profile</button>
          <button className="danger">Logout</button>
        </div>
      </div>
    </div>
  );
  
};

export default Profile;
