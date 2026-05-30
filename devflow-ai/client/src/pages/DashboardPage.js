import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "./DashboardPage.css";

const statusColors = {
  planning: "#f59e0b",
  "in-progress": "#3b82f6",
  completed: "#10b981",
  "on-hold": "#ef4444",
};

const priorityBadge = {
  low: "badge-gray",
  medium: "badge-blue",
  high: "badge-orange",
  critical: "badge-red",
};

const statusBadge = {
  planning: "badge-orange",
  "in-progress": "badge-blue",
  completed: "badge-green",
  "on-hold": "badge-red",
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats
    ? Object.entries(stats.projectsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>{greeting}, {user?.name?.split(" ")[0]} 👋</h1>
          <p>Here's what's happening in your workspace today.</p>
        </div>
        <div className="header-actions">
          <Link to="/projects" className="btn-primary">+ New Project</Link>
          <Link to="/chat" className="btn-ai">🤖 Ask AI</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📁</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats.totalProjects || 0}</span>
            <span className="stat-label">Total Projects</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">🔄</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats.inProgressProjects || 0}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats.completedProjects || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🤖</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats.totalAIChats || 0}</span>
            <span className="stat-label">AI Messages</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Chart */}
        <div className="card chart-card">
          <h2>Projects by Status</h2>
          {chartData.every(d => d.value === 0) ? (
            <div className="empty-chart">
              <p>No projects yet. <Link to="/projects">Create one!</Link></p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={40}>
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1a2235", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9" }}
                  cursor={{ fill: "rgba(59,130,246,0.05)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={statusColors[entry.name] || "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Projects */}
        <div className="card recent-card">
          <div className="card-header">
            <h2>Recent Projects</h2>
            <Link to="/projects">View all →</Link>
          </div>
          {!stats?.recentProjects?.length ? (
            <div className="empty-state">
              <p>📁</p>
              <p>No projects yet.</p>
              <Link to="/projects" className="btn-primary" style={{ marginTop: "12px" }}>Create Project</Link>
            </div>
          ) : (
            <div className="recent-list">
              {stats.recentProjects.map((p) => (
                <div key={p._id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-title">{p.title}</span>
                    <div className="recent-meta">
                      <span className={`badge ${statusBadge[p.status]}`}>{p.status}</span>
                      <span className={`badge ${priorityBadge[p.priority]}`}>{p.priority}</span>
                    </div>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{p.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Banner */}
      <div className="ai-banner">
        <div className="ai-banner-text">
          <h3>🤖 DevFlow AI Assistant</h3>
          <p>Get instant help with code, debugging, architecture decisions, and more.</p>
        </div>
        <Link to="/chat" className="btn-primary">Start Chatting</Link>
      </div>
    </div>
  );
};

export default DashboardPage;
