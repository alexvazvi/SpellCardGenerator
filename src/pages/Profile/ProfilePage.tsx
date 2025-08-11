import React from 'react';
import PageContainer from '../../components/PageContainer';
import './ProfilePage.css';
import profileImage from '../../assets/profile.png';

const ProfilePage: React.FC = () => {
  // TODO: Fetch user data from an API
  const userData = {
    username: 'DungeonMaster_Al',
    email: 'alex.v@dndcreative.com',
    memberSince: '2023-08-15',
    avatarUrl: profileImage,
    subscriptionTier: 'Pro'
  };

  return (
    <PageContainer>
      <div className="profile-page">
        <div className="page-header">
          <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Gestiona tu cuenta y tus preferencias.</p>
      </div>
      <div className="profile-card spell-form-as-card">
        <div className="profile-header">
          <img src={userData.avatarUrl} alt="User Avatar" className="profile-avatar" />
          <h1 className="profile-username">{userData.username}</h1>
          <span className={`profile-tier-badge tier-${userData.subscriptionTier.toLowerCase()}`}>
            <i className="fas fa-gem"></i> {userData.subscriptionTier} Member
          </span>
        </div>
        
        <div className="profile-body">
          <h2 className="section-title">User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong className="info-label">Email:</strong>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-item">
              <strong className="info-label">Member Since:</strong>
              <span className="info-value">{new Date(userData.memberSince).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="todo-section">
            <h3 className="section-title">Development To-Do</h3>
            <ul className="todo-list">
              <li><i className="far fa-square"></i> Implement editable fields for username and email.</li>
              <li><i className="far fa-square"></i> Add functionality for avatar uploads.</li>
              <li><i className="far fa-square"></i> Connect to a real user database (e.g., Firebase Auth).</li>
              <li><i className="far fa-square"></i> Create a "Change Password" feature.</li>
            </ul>
          </div>
        </div>
        
        <div className="profile-footer">
          <button className="spell-form-button">Edit Profile</button>
        </div>
      </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
