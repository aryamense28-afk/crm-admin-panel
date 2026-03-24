// src/components/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Reports.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [filter, setFilter] = useState("monthly");

  // Example data: You can fetch this from API
  const revenueData = {
    monthly: [5000, 7000, 6000, 8000, 9000, 7500, 9500, 8500, 10000, 11000, 12000, 13000],
    quarterly: [18000, 22000, 25000, 28000],
    yearly: [100000, 120000, 140000],
  };

  const growthData = {
    monthly: [5, 8, 6, 9, 10, 7, 11, 8, 12, 13, 15, 16],
    quarterly: [10, 15, 20, 25],
    yearly: [20, 25, 30],
  };

  const labels = {
    monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    quarterly: ["Q1", "Q2", "Q3", "Q4"],
    yearly: ["2021", "2022", "2023"],
  };

  const revenueChartData = {
    labels: labels[filter],
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueData[filter],
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  const growthChartData = {
    labels: labels[filter],
    datasets: [
      {
        label: "Growth (%)",
        data: growthData[filter],
        borderColor: "#22c55e",
        backgroundColor: "#22c55e44",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const salesDistributionData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Sales Distribution",
        data: [40000, 25000, 15000, 10000],
        backgroundColor: ["#6366f1", "#3b82f6", "#60a5fa", "#93c5fd"],
        hoverOffset: 10,
      },
    ],
  };

  const totalRevenue = revenueData[filter].reduce((a, b) => a + b, 0);
  const avgGrowth = Math.round(
    growthData[filter].reduce((a, b) => a + b, 0) / growthData[filter].length
  );

  return (
    <div className="reports-container">
      <div className="reports-content">
        
        <h2>📊 Reports & Analytics</h2>
        <p className="reports-subtitle">Track your business performance and growth metrics</p>

        {/* Filter Section */}
        <div className="filter-section">
          <button
            onClick={() => setFilter("monthly")}
            className={`filter-btn ${filter === "monthly" ? "active" : ""}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilter("quarterly")}
            className={`filter-btn ${filter === "quarterly" ? "active" : ""}`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setFilter("yearly")}
            className={`filter-btn ${filter === "yearly" ? "active" : ""}`}
          >
            Yearly
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <h3>Total Revenue</h3>
            <div className="stat-value">₹ {totalRevenue.toLocaleString()}</div>
            <div className="stat-trend">
              ↑ 12.5% from last {filter}
            </div>
          </div>
          
          <div className="stat-card growth">
            <div className="stat-icon">📈</div>
            <h3>Average Growth</h3>
            <div className="stat-value">{avgGrowth}%</div>
            <div className="stat-trend">
              ↑ 2.3% from last {filter}
            </div>
          </div>
          
          <div className="stat-card product">
            <div className="stat-icon">🏆</div>
            <h3>Top Product</h3>
            <div className="stat-value">Product A</div>
            <div className="stat-trend">
              ₹40,000 in sales
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h4>Revenue Chart</h4>
              <span className="chart-period">{filter} view</span>
            </div>
            <div className="chart-wrapper">
              <Bar data={revenueChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h4>Growth Chart</h4>
              <span className="chart-period">{filter} view</span>
            </div>
            <div className="chart-wrapper">
              <Line data={growthChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h4>Sales Distribution</h4>
              <span className="chart-period">by product</span>
            </div>
            <div className="chart-wrapper">
              <Pie data={salesDistributionData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <h3>Key Insights</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Best Month</div>
              <div className="summary-number">December</div>
              <span className="summary-percent">↑ 15%</span>
            </div>
            <div className="summary-item">
              <div className="summary-label">Growth Rate</div>
              <div className="summary-number">{avgGrowth}%</div>
              <span className="summary-percent">↑ 2%</span>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Orders</div>
              <div className="summary-number">1,247</div>
              <span className="summary-percent">↑ 8%</span>
            </div>
            <div className="summary-item">
              <div className="summary-label">Conversion</div>
              <div className="summary-number">3.2%</div>
              <span className="summary-percent">↑ 0.5%</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button className="export-btn">
          <i>📥</i> Export Report
        </button>

      </div>
    </div>
  );
};

export default Reports;