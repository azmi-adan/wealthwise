
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email!";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("User Logged In:", formData);
      navigate("/dashboard"); // Redirect after successful login
    }
  };

  return (
    <div className="login-container">
      <div className="animated-bg"></div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>

        {/* EMAIL FIELD */}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* PASSWORD FIELD */}
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* FORGOT PASSWORD */}
        <p className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        {/* LOGIN BUTTON */}
        <button type="submit" className="login-btn">Login</button>

        {/* SIGNUP LINK */}
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
