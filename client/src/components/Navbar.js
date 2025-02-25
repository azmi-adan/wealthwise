
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">WealthWise</Link>
      </div>

      {/* Menu Icon for Mobile */}
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        <div className={isOpen ? "bar open" : "bar"}></div>
        <div className={isOpen ? "bar open" : "bar"}></div>
        <div className={isOpen ? "bar open" : "bar"}></div>
      </div>

      {/* Navigation Links */}
      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/savings">Savings</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li className="auth-dropdown">
          <span>Account ▾</span>
          <ul className="dropdown">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
