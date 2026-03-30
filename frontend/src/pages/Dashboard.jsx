import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PatientPortalDashboard from './PatientPortalDashboard';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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

    // Patient role gets the dedicated self-portal
    if (user?.role === 'patient') return <PatientPortalDashboard />;

    const isAdmin = user?.role === 'admin';

    // Format currency for charts
    const formatCurrency = (value) => `₹${value.toLocaleString()}`;

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
                {isAdmin && (
                    <>
                        <div className="stat-card">
                            <div className="stat-icon cyan">💰</div>
                            <div className="stat-info">
                                <h4>Monthly Revenue</h4>
                                <div className="stat-value">₹{(stats?.monthly_revenue || 0).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon green">📈</div>
                            <div className="stat-info">
                                <h4>Today's Revenue</h4>
                                <div className="stat-value">₹{(stats?.today_revenue || 0).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon yellow">🧾</div>
                            <div className="stat-info">
                                <h4>Pending Invoices</h4>
                                <div className="stat-value">{stats?.pending_invoices || 0}</div>
                            </div>
                        </div>
                    </>
                )}
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
                {user?.role === 'pharmacist' && (
                    <>
                        <div className="stat-card">
                            <div className="stat-icon red">💊</div>
                            <div className="stat-info">
                                <h4>Low Stock Medicines</h4>
                                <div className="stat-value">{stats?.low_stock_count || 0}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon yellow">📦</div>
                            <div className="stat-info">
                                <h4>Pending Orders</h4>
                                <div className="stat-value">{stats?.pending_orders_count || 0}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>


            {isAdmin && (
                <div className="grid-2" style={{ marginTop: '20px' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3>💰 6-Month Revenue Trend</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.revenue_trend || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                <RechartsTooltip 
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3>🏥 Patients by Department</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats?.department_stats || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(stats?.department_stats || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Appointment Status Breakdown */}
                    {(stats?.appointment_stats || []).length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3>📊 Appointment Status Breakdown</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={stats.appointment_stats}
                                        cx="50%" cy="50%"
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        stroke="none"
                                    >
                                        {stats.appointment_stats.map((_, index) => (
                                            <Cell key={`astatus-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f1f5f9' }} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* New Chart: Top Doctors */}
                    {(stats?.top_doctors || []).length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3>👨‍⚕️ Top 5 Doctors (by Appointments)</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart layout="vertical" data={stats.top_doctors} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={100} />
                                    <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f1f5f9' }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* New Chart: Patient Growth Trend */}
                    {(stats?.patient_trend || []).length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3>📈 Patient Registration Trend</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={stats.patient_trend}>
                                    <defs>
                                        <linearGradient id="colorPatient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f1f5f9' }} />
                                    <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#colorPatient)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            <div className="grid-2" style={{ marginTop: '20px' }}>
                <div className="card">
                    <div className="card-header">
                        <h3>📈 Weekly Appointment Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={stats?.weekly_trend || []}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}
                                tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f1f5f9' }} />
                            <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCount)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>📋 Upcoming Appointments</h3>
                    </div>
                    {stats?.recent_appointments?.length > 0 ? (
                        <div className="table-container">
                            <table style={{ margin: 0 }}>
                                <thead>
                                    <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {stats.recent_appointments.map((a, i) => (
                                        <tr key={i}>
                                            <td>{a.patient}</td>
                                            <td>{a.doctor}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{a.date} <br/> <small>{a.time}</small></td>
                                            <td><span className={`badge badge-${a.status === 'completed' ? 'success' : a.status === 'cancelled' ? 'danger' : 'info'}`}>{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '10px' }}>🗓️</div>
                            <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>No upcoming appointments</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
