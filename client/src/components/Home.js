import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* DYNAMIC BACKGROUND */}
      <div className="animated-bg"></div>

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="fade-in">Master Your Finances</h1>
        <p className="fade-in">Track expenses, set goals, and take control of your money.</p>
        <Link to="/signup" className="cta-button">Join WiseWealth</Link>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2 className="fade-in">Why Choose WiseWealth?</h2>
        <div className="feature-cards">
          <div className="feature-card slide-in">
            <div className="feature-icon">💳</div>
            <h3>Track Expenses</h3>
            <p>Log and categorize your spending effortlessly.</p>
          </div>
          <div className="feature-card slide-in">
            <div className="feature-icon">🎯</div>
            <h3>Set Savings Goals</h3>
            <p>Define financial goals and monitor progress.</p>
          </div>
          <div className="feature-card slide-in">
            <div className="feature-icon">📊</div>
            <h3>Stay in Control</h3>
            <p>Visualize where your money goes each month.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
