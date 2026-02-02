import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post('/api/login', { 
        username, 
        password 
      });

      const data = res.data;

      // ✅ role-based routing handled in React
      if (data.role === "admin") {
        navigate("/admindb");
      } else if (data.role === "captain") {
        navigate("/captaindb");
      } else {
        setError("Unknown user role");
      }
    } catch (err) {
      console.error("Login failed:", err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.error || "Invalid username or password");
      } else if (err.request) {
        // No response received
        setError("Cannot connect to server. Please check your connection.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={styles.testCredentials}>
          <p style={styles.testTitle}>Test Credentials:</p>
          <p style={styles.testText}>Admin: admin / tes123</p>
          <p style={styles.testText}>Captain: ghuraab / tes123</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  loginBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '28px'
  },
  errorBox: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #fcc'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#555',
    fontSize: '14px'
  },
  input: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none'
  },
  button: {
    padding: '14px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'background-color 0.3s'
  },
  testCredentials: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    borderLeft: '4px solid #667eea'
  },
  testTitle: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
    fontSize: '14px'
  },
  testText: {
    margin: '4px 0',
    fontSize: '13px',
    color: '#666',
    fontFamily: 'monospace'
  }
};

export default Login;