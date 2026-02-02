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
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
    fetchDashboardData();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/me');
      setCurrentUser(response.data);
      
      // Verify user is admin
      if (response.data.role !== 'admin') {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/dashboard');
      setHouses(response.data.houses);
      setRecentTransactions(response.data.recent_transactions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        showAlert('Failed to load dashboard data', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPoints = async (action) => {
    if (!formData.house_id || !formData.points || !formData.reason) {
      showAlert('Please fill in all fields', 'danger');
      return;
    }

    const points = parseInt(formData.points);
    if (isNaN(points) || points <= 0) {
      showAlert('Points must be a positive number', 'danger');
      return;
    }

    const houseName = houses.find(h => h.id === parseInt(formData.house_id))?.name;
    const confirmMsg = `Are you sure you want to ${action} ${points} points ${action === 'add' ? 'to' : 'from'} ${houseName}?\n\nReason: ${formData.reason}`;
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      const endpoint = action === 'add' 
        ? '/api/admin/points/add'
        : '/api/admin/points/deduct';

      const response = await api.post(endpoint, {
        house_id: parseInt(formData.house_id),
        points: points,
        reason: formData.reason
      });

      showAlert(response.data.message, 'success');
      setFormData({ house_id: '', points: '', reason: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error submitting points:', error);
      const errorMsg = error.response?.data?.error || 'Failed to update points';
      showAlert(errorMsg, 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      navigate('/login');
    }
  };

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

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
        {/* Header */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
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
                {houses.map(house => (
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
                placeholder="Enter points amount" 
                min="1"
                value={formData.points}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason" className="form-label">Reason</label>
              <textarea 
                className="form-control" 
                id="reason" 
                name="reason" 
                rows="3" 
                placeholder="Why are you adding/deducting points?"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="btn-grid">
              <button 
                type="button" 
                className="btn-add" 
                onClick={() => handleSubmitPoints('add')}
              >
                ➕ Add Points
              </button>
              <button 
                type="button" 
                className="btn-deduct" 
                onClick={() => handleSubmitPoints('deduct')}
              >
                ➖ Deduct Points
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card-custom">
            <h2 className="card-title">📜 Recent Transactions</h2>
            
            {recentTransactions.length > 0 ? (
              <div className="transactions-scroll">
                {recentTransactions.map(transaction => (
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
                      <span className={`rank-badge ${getRankClass(index)}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <strong>{house.name}</strong>
                      <br />
                      <small style={{ color: '#999' }}>{house.description}</small>
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