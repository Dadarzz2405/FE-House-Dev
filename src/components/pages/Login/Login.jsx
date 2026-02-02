import { useState } from "react";
import axios from "axios";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "https://houses-web.onrender.com";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/login`,
        { username, password },
        {
          withCredentials: true, // ✅ REQUIRED for Flask-Login
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success && res.data.redirect) {
        // ✅ HARD redirect to backend-rendered Jinja page
        window.location.href = res.data.redirect;
      } else {
        setError("Login failed");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🏠 GDA Houses Login</h2>
        <p className="login-subtitle">Sign in to access your dashboard</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
