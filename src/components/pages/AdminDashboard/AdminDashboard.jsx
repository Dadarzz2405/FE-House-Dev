import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHouses(data.houses);
        setRecentTransactions(data.recent_transactions);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

    if (parseInt(formData.points) <= 0) {
      showAlert('Points must be a positive number', 'danger');
      return;
    }

    const houseName = houses.find(h => h.id === parseInt(formData.house_id))?.name;
    const confirmMsg = `Are you sure you want to ${action} ${formData.points} points ${action === 'add' ? 'to' : 'from'} ${houseName}?\n\nReason: ${formData.reason}`;
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      const endpoint = action === 'add' 
        ? `${API_URL}/api/admin/points/add`
        : `${API_URL}/api/admin/points/deduct`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(data.message, 'success');
        setFormData({ house_id: '', points: '', reason: '' });
        fetchDashboardData();
      } else {
        showAlert(data.error || 'Failed to update points', 'danger');
      }
    } catch (error) {
      console.error('Error submitting points:', error);
      showAlert('An error occurred', 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
  };

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
