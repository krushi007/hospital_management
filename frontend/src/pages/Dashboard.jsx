import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.getStats()
            .then(res => setStats(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Welcome, {user?.first_name}! 👋</h1>
                    <p>Here's your hospital overview for today</p>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div className="stat-info">
                        <h4>Total Patients</h4>
                        <div className="stat-value">{stats?.total_patients || 0}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">👨‍⚕️</div>
                    <div className="stat-info">
                        <h4>Active Doctors</h4>
                        <div className="stat-value">{stats?.total_doctors || 0}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon yellow">📅</div>
                    <div className="stat-info">
                        <h4>Today's Appointments</h4>
                        <div className="stat-value">{stats?.today_appointments || 0}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon cyan">💰</div>
                    <div className="stat-info">
                        <h4>Monthly Revenue</h4>
                        <div className="stat-value">₹{(stats?.monthly_revenue || 0).toLocaleString()}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red">🛏️</div>
                    <div className="stat-info">
                        <h4>Bed Occupancy</h4>
                        <div className="stat-value">{stats?.occupancy_rate || 0}%</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div className="stat-info">
                        <h4>Completed Today</h4>
                        <div className="stat-value">{stats?.completed_today || 0}</div>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>📈 Weekly Appointment Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={stats?.weekly_trend || []}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12}
                                tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                            <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCount)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>📋 Upcoming Appointments</h3>
                    </div>
                    {stats?.recent_appointments?.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {stats.recent_appointments.map((a, i) => (
                                        <tr key={i}>
                                            <td>{a.patient}</td>
                                            <td>{a.doctor}</td>
                                            <td>{a.date} {a.time}</td>
                                            <td><span className={`badge badge-${a.status === 'completed' ? 'success' : a.status === 'cancelled' ? 'danger' : 'info'}`}>{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state"><h3>No upcoming appointments</h3></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
