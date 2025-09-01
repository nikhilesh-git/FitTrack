import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import "./index.css";

class ResetPasswordPage extends Component {
  state = {
    password: "",
    confirmPassword: "",
    successMsg: null,
    errorMsg: null,
    isLoading: false,
    redirectTo: null,
    email:""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword,email } = this.state;

    if (password === "" || confirmPassword === "" ||email==="") {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    this.setState({ isLoading: true, errorMsg: null, successMsg: null });

    const endpoint = `${process.env.REACT_APP_API_URL}/api/reset-password/`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,password }),
      });

      const data = await response.json();
      console.log("Reset password response:", data);

      if (!response.ok) {
        this.setState({ errorMsg: data.error_msg || "Something went wrong", isLoading: false });
        return;
      }

      this.setState({
        successMsg: "Password has been reset successfully!",
        isLoading: false,
      });

      setTimeout(() => {
        this.setState({ redirectTo: "/login" });
      }, 3000);

    } catch (err) {
      this.setState({ errorMsg: err.message, isLoading: false });
    }
  };

  returnToLoginPage=()=>{
    this.setState({ redirectTo: "/login" });
  }

  render() {
    const { password, confirmPassword, successMsg, errorMsg, isLoading, redirectTo,email } = this.state;

    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="login-page">
        <div className="login-overlay" />

        <div className="login-card">
          {/* Back to Login Button */}
          <button className="back-to-login" onClick={this.returnToLoginPage}>← Back to Login</button>

          <img src="/logo192.png" alt="Gym Logo" className="login-logo" />
          <h1 className="app-title">FitTrack Gym</h1>

          <form className="login-form" onSubmit={this.handleSubmit}>
            <h2>Reset Password</h2>

            {errorMsg && <p className="error">{errorMsg}</p>}
            {successMsg && <p className="success">{successMsg}</p>}

            {isLoading ? (
              <p className="loader">Updating password...</p>
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={this.handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={this.handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                  required
                />
                <button type="submit">Update Password</button>
              </>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default ResetPasswordPage;
