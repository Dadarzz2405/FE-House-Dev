import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/axios";
import "./CaptainDashboard.css";

const CaptainDashboard = () => {
  const [houseData, setHouseData] = useState(null);
  const [members, setMembers] = useState([]);
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/me');
      setCurrentUser(response.data);
      if (response.data.role !== 'captain') {
        navigate('/login');
        return;
      }
      loadDashboardData();
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/api/captain/dashboard');
      setHouseData(response.data.house);
      setMembers(response.data.members);
      setMyAnnouncements(response.data.my_announcements);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      showAlert('Failed to load dashboard data', 'danger');
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await api.delete(`/api/captain/announcements/${announcementId}/delete`);
      showAlert('Announcement deleted successfully', 'success');
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showAlert(error.response?.data?.error || 'Failed to delete announcement', 'danger');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar-custom">
        <a href="#" className="navbar-brand">
          🎖️ Captain Dashboard
        </a>
        <div className="navbar-right">
          <span className="navbar-text">
            Welcome, <strong>{currentUser?.name || 'Captain'}</strong>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        {houseData && (
          <div className="house-banner">
            <h2>{houseData.name}</h2>
            <div className="house-points">{houseData.points}</div>
            <p>Total House Points</p>
            <p className="house-description">{houseData.description}</p>
          </div>
        )}

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <div className="dashboard-grid">
          <div className="card-custom">
            <h2 className="card-title">👥 House Members</h2>
            
            {members.length > 0 ? (
              <div className="members-grid">
                {members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">No members in your house yet</div>
            )}
          </div>

          <div className="card-custom">
            <h2 className="card-title">⚡ Quick Actions</h2>
            <button 
              onClick={() => navigate('/create-announcement')}
              className="btn-create"
            >
              📢 Create New Announcement
            </button>
            <p className="text-muted" style={{ marginTop: '1rem' }}>
              Create announcements to communicate with your house members and the entire school.
            </p>
          </div>

          <div className="card-custom full-width">
            <h2 className="card-title">📢 My Announcements</h2>
            
            {myAnnouncements.length > 0 ? (
              myAnnouncements.map((announcement) => (
                <div key={announcement.id} className="announcement-card">
                  <div className="announcement-header">
                    <div>
                      <div className="announcement-title">{announcement.title}</div>
                      <div className="announcement-date">
                        {new Date(announcement.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="announcement-content">{announcement.content}</div>
                  
                  {announcement.image_url && (
                    <div className="announcement-image-container">
                      <img 
                        src={announcement.image_url} 
                        alt="Announcement" 
                        className="announcement-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-content">
                You haven't posted any announcements yet
                <br />
                <button 
                  onClick={() => navigate('/create-announcement')}
                  className="btn-create" 
                  style={{ marginTop: '1rem' }}
                >
                  Create Your First Announcement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDashboard;