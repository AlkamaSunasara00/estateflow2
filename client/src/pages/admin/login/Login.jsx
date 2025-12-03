import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import "../../../assets/css/admin/login.css";
import logo from "../../../assets/image/logo.png"

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      nav("/admin/manage-clients");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>


      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <div>
              <div className="login-title">
                Welcome back
              </div>
              <div>
                <p className="login-subtitle">Login to continue</p>
              </div>
            </div>
            <div className="login-icon">
              <img src={logo} alt="" />
            </div>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Email"
                  className="form-input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit" className="login-button" onClick={submitLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;