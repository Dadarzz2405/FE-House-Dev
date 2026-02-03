import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../API/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [houses, setHouses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [formData, setFormData] = useState({
    house_id: '',
    points: '',
    reason: ''
  });
  const [alert, setAlert] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(null);
  const navigate = useNavigate();

  // ... existing useEffect and functions ...

  const handleLogoUpload = async (houseId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showAlert('Invalid file type. Please upload PNG, JPG, GIF, or WEBP', 'danger');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      showAlert('File too large. Maximum size is 5MB', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      setUploadingLogo(houseId);
      const response = await api.post(
        `/api/admin/house/${houseId}/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showAlert(response.data.message, 'success');
      
      // Update the house logo in state
      setHouses(prevHouses => 
        prevHouses.map(h => 
          h.id === houseId 
            ? { ...h, logo_url: response.data.url }
            : h
        )
      );
    } catch (error) {
      console.error('Error uploading logo:', error);
      showAlert(
        error.response?.data?.error || 'Failed to upload logo',
        'danger'
      );
    } finally {
      setUploadingLogo(null);
      event.target.value = ''; // Reset file input
    }
  };

  // ... rest of component ...

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-custom">
        <a href="#" className="navbar-brand">
          Admin Dashboard
        </a>
        <div className="navbar-right">
          <span className="navbar-text">
            Welcome, <strong>{currentUser?.name || 'Admin'}</strong>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* ... existing header and alert ... */}

        <div className="dashboard-grid">
          {/* ... existing Points Management card ... */}
          
          {/* ... existing Recent Transactions card ... */}

          {/* ✅ ADD THIS: Logo Management Section */}
          <div className="card-custom full-width">
            <h2 className="card-title">🖼️ Manage House Logos</h2>
            
            <table>
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>House</th>
                  <th style={{ width: '120px' }}>Current Logo</th>
                  <th>Upload New Logo</th>
                </tr>
              </thead>
              <tbody>
                {houses.map((house) => (
                  <tr key={house.id}>
                    <td>
                      <strong>{house.name}</strong>
                      <br />
                      <small style={{ color: '#999' }}>{house.points} points</small>
                    </td>
                    <td>
                      <img 
                        src={house.logo_url}
                        alt={house.name}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'contain',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '5px'
                        }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/80?text=${house.name}`;
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                          onChange={(e) => handleLogoUpload(house.id, e)}
                          disabled={uploadingLogo === house.id}
                          style={{ 
                            fontSize: '0.9rem',
                            padding: '0.5rem',
                            cursor: uploadingLogo === house.id ? 'not-allowed' : 'pointer'
                          }}
                        />
                        {uploadingLogo === house.id && (
                          <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                            Uploading...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <strong>📝 Instructions:</strong>
              <ul style={{ marginTop: '0.5rem', marginBottom: 0, lineHeight: '1.8' }}>
                <li>Supported formats: PNG, JPG, JPEG, GIF, WEBP</li>
                <li>Maximum file size: 5MB</li>
                <li>Recommended size: 500x500 pixels or larger</li>
                <li>Logo will be uploaded to Cloudinary and replace the existing one</li>
                <li>Changes are instant and permanent</li>
              </ul>
            </div>
          </div>

          {/* ... existing Current House Standings card ... */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;