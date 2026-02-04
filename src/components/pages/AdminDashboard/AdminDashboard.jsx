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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/me');
      setCurrentUser(response.data);
      loadDashboardData();
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setHouses(response.data.houses);
      setRecentTransactions(response.data.recent_transactions);
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    
    if (!formData.house_id || !formData.points || !formData.reason) {
      showAlert('Please fill all fields', 'danger');
      return;
    }

    if (parseInt(formData.points) <= 0) {
      showAlert('Points must be positive', 'danger');
      return;
    }

    if (!window.confirm(`Add ${formData.points} points to the selected house?`)) {
      return;
    }

    try {
      const response = await api.post('/api/admin/points/add', formData);
      showAlert(response.data.message, 'success');
      loadDashboardData();
      setFormData({ house_id: '', points: '', reason: '' });
    } catch (error) {
      console.error('Error adding points:', error);
      showAlert(error.response?.data?.error || 'Failed to add points', 'danger');
    }
  };

  const handleDeductPoints = async (e) => {
    e.preventDefault();
    
    if (!formData.house_id || !formData.points || !formData.reason) {
      showAlert('Please fill all fields', 'danger');
      return;
    }

    if (parseInt(formData.points) <= 0) {
      showAlert('Points must be positive', 'danger');
      return;
    }

    if (!window.confirm(`Deduct ${formData.points} points from the selected house?`)) {
      return;
    }

    try {
      const response = await api.post('/api/admin/points/deduct', formData);
      showAlert(response.data.message, 'success');
      loadDashboardData();
      setFormData({ house_id: '', points: '', reason: '' });
    } catch (error) {
      console.error('Error deducting points:', error);
      showAlert(error.response?.data?.error || 'Failed to deduct points', 'danger');
    }
  };

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
      {/* Navbar */}
      <nav className="navbar-custom">
        <a href="#" className="navbar-brand">
          🎯 Admin Dashboard
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
        {/* Header */}
        <div className="dashboard-header">
          <h1>🎯 Admin Dashboard</h1>
          <p>Manage house points and view standings</p>
        </div>

        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Points Management */}
          <div className="card-custom">
            <h2 className="card-title">📊 Points Management</h2>
            
            <form onSubmit={handleAddPoints}>
              <div className="form-group">
                <label htmlFor="house_id" className="form-label">Select House</label>
                <select
                  className="form-select"
                  id="house_id"
                  name="house_id"
                  value={formData.house_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose a house...</option>
                  {houses.map((house) => (
                    <option key={house.id} value={house.id}>
                      {house.name} ({house.points} points)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="points" className="form-label">Points Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id="points"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  placeholder="Enter points amount"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason" className="form-label">Reason</label>
                <textarea
                  className="form-control"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Why are you adding/deducting points?"
                  required
                />
              </div>

              <div className="btn-grid">
                <button type="button" className="btn-add" onClick={handleAddPoints}>
                  ➕ Add Points
                </button>
                <button type="button" className="btn-deduct" onClick={handleDeductPoints}>
                  ➖ Deduct Points
                </button>
              </div>
            </form>
          </div>

          {/* Recent Transactions */}
          <div className="card-custom">
            <h2 className="card-title">📜 Recent Transactions</h2>
            
            {recentTransactions.length > 0 ? (
              <div className="transactions-scroll">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-header">
                      <span className="transaction-house">{transaction.house.name}</span>
                      <span className={`transaction-points ${transaction.points_change > 0 ? 'positive' : 'negative'}`}>
                        {transaction.points_change > 0 ? '+' : ''}{transaction.points_change}
                      </span>
                    </div>
                    <div className="transaction-reason">{transaction.reason}</div>
                    <div className="transaction-meta">
                      by {transaction.admin.name} • {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-content">No transactions yet</p>
            )}
          </div>

          {/* Logo Management */}
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

          {/* Current House Standings */}
          <div className="card-custom full-width">
            <h2 className="card-title">🏆 Current House Standings</h2>
            
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>House Name</th>
                  <th style={{ width: '120px' }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {houses.map((house, index) => (
                  <tr key={house.id}>
                    <td>
                      <span className={`rank-badge rank-${index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : 'other'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <strong>{house.name}</strong>
                      <br />
                      <small className="text-muted">{house.description}</small>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1.2rem', color: '#667eea' }}>
                        {house.points}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;