import React, { useEffect, useState } from "react";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from "chart.js";
import "../Styles/Dashboard.css";

// Register chart elements
ChartJS.register(
  ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, BarElement, 
  PointElement, LineElement
);

const Dashboard = () => {
  const [savings, setSavings] = useState({ current: 0, goal: 0, history: [] });
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState({ total: 0 });

  // Fetch data from db.json
  useEffect(() => {
    fetch("http://localhost:3000/savings")
      .then((res) => res.json())
      .then((data) => setSavings(data || { current: 0, goal: 0, history: [] }))
      .catch((error) => console.error("Error fetching savings:", error));

    fetch("http://localhost:3000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data || []))
      .catch((error) => console.error("Error fetching transactions:", error));

    fetch("http://localhost:3000/income")
      .then((res) => res.json())
      .then((data) => setIncome(data || { total: 0 }))
      .catch((error) => console.error("Error fetching income:", error));
  }, []);

  if (!savings || transactions.length === 0 || !income) {
    return <p>Loading dashboard...</p>;
  }

  // Pie Chart: Expense Breakdown
  const pieData = {
    labels: transactions.map((t) => t.category),
    datasets: [
      {
        data: transactions.map((t) => t.amount),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  // Bar Chart: Savings vs Goal
  const barData = {
    labels: ["Current Savings", "Savings Goal"],
    datasets: [
      {
        label: "Amount ($)",
        data: [savings.current || 0, savings.goal || 0], // Ensure numbers
        backgroundColor: ["#4caf50", "#ff9800"],
      },
    ],
  };

  // Line Chart: Savings History
  const lineData = {
    labels: savings.history?.map((entry) => entry.date) || [],
    datasets: [
      {
        label: "Savings Growth",
        data: savings.history?.map((entry) => entry.amount) || [],
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Doughnut Chart: Income vs Expenses
  const totalExpenses = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const doughnutData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [income.total || 0, totalExpenses],
        backgroundColor: ["#2ecc71", "#e74c3c"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="charts">
        <div className="chart-card">
          <h3>Expense Breakdown</h3>
          <Pie data={pieData} />
        </div>

        <div className="chart-card">
          <h3>Savings vs Goal</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-card">
          <h3>Savings Growth Over Time</h3>
          <Line data={lineData} />
        </div>

        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
