import React, { Component } from "react";
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { Navigate } from "react-router-dom";
import "./index.css";

class LoginPage extends Component {
  state = {
    email: "",
    password: "",
    errorMsg: null,
    redirectTo: null,
    role: "member",
    isLoading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  switchRole = (role) => {
    this.setState({ role, errorMsg: null, email: "", password: "" });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = this.state;

    if (email === '' || password === '') {
      alert("Please enter the details");
      return;
    }

    this.setState({ isLoading: true });

    const endpoint = "http://localhost:3000/api/login/";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        const errorMsg = data.error_msg;
        this.setState({ errorMsg, isLoading: false });
        return;
      }

      const jwtToken = data.jwt_token;
      Cookies.set('jwt_token', jwtToken, { expires: 30, path: '/' });
      console.log("JWT token in cookie:", Cookies.get('jwt_token'));

      // 👇 decode the token and set role for App.js immediately
      const decoded = jwtDecode(jwtToken);
      this.props.setRole(decoded.role);

      this.setState({ redirectTo: "/dashboard", isLoading: false });

    } catch (err) {
      this.setState({ error: err.message, isLoading: false });
    }
  };

  render() {
    const { email, password, errorMsg, redirectTo, role, isLoading } = this.state;

    if (Cookies.get('jwt_token')) {
      return <Navigate to="/dashboard" replace />;
    }

    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="login-page">
        <div className="login-overlay" />
        <div className="login-card">
          <img src="/logo192.png" alt="Gym Logo" className="login-logo" />
          <h1 className="app-title">FitTrack Gym</h1>

          <div className="role-toggle">
            <button
              className={role === "admin" ? "active" : ""}
              onClick={() => this.switchRole("admin")}
            >
              Admin Login
            </button>
            <button
              className={role === "member" ? "active" : ""}
              onClick={() => this.switchRole("member")}
            >
              Member Login
            </button>
          </div>

          <form className="login-form" onSubmit={this.handleSubmit}>
            <h2>{role === "admin" ? "Admin" : "Member"} Login</h2>

            {errorMsg && <p className="error">{errorMsg}</p>}

            {isLoading ? (
              <p className="loader">Logging in...</p>
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={this.handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                  required
                />
                <button type="submit">Login</button>
                <p className="forgot-password">
                  Forgot password? <a href="/reset-password">Reset</a>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
