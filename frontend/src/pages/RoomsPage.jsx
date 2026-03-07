import React, { useState, useEffect } from 'react';
import { roomAPI, departmentAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROOM_TYPES = {
    general: 'General Ward',
    private: 'Private Room',
    icu: 'ICU',
    operation: 'Operation Theater',
    emergency: 'Emergency',
};

const RoomsPage = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');

    const fetchRooms = () => {
        roomAPI.list({ type: typeFilter || undefined })
            .then(res => setRooms(res.data.results || res.data || []))
            .catch(() => toast.error('Failed to load rooms'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRooms();
        departmentAPI.list().then(r => setDepartments(r.data.results || r.data || [])).catch(() => { });
    }, []);

    useEffect(() => { fetchRooms(); }, [typeFilter]);

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    // Summary stats
    const totalBeds = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const occupiedBeds = rooms.reduce((sum, r) => sum + (r.occupied || 0), 0);
    const availableRooms = rooms.filter(r => r.is_available !== false && (r.occupied || 0) < (r.capacity || 1)).length;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Rooms & Beds</h1>
                    <p>Hospital room availability and occupancy overview</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-value">{rooms.length}</div>
                    <div className="stat-label">Total Rooms</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalBeds}</div>
                    <div className="stat-label">Total Beds</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{availableRooms}</div>
                    <div className="stat-label">Available Rooms</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{occupiedBeds}</div>
                    <div className="stat-label">Occupied Beds</div>
                </div>
            </div>

            {/* Filter */}
            <div style={{ marginBottom: 18 }}>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    style={{ padding: '9px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'inherit', minWidth: 180 }}>
                    <option value="">All Room Types</option>
                    {Object.entries(ROOM_TYPES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Room Cards */}
            {rooms.length === 0 ? (
                <div className="empty-state">
                    <h3>No rooms found</h3>
                    <p>No rooms match the selected filter</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Type</th>
                                <th>Department</th>
                                <th>Beds</th>
                                <th>Occupancy</th>
                                <th>Rate/Day</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => {
                                const occupancyPct = room.capacity > 0 ? Math.round((room.occupied / room.capacity) * 100) : 0;
                                const isAvailable = room.is_available !== false && room.occupied < room.capacity;
                                return (
                                    <tr key={room.id}>
                                        <td><strong>{room.room_number}</strong></td>
                                        <td>{ROOM_TYPES[room.room_type] || room.room_type}</td>
                                        <td>{room.department_name || '—'}</td>
                                        <td>{room.occupied} / {room.capacity}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div className="risk-meter" style={{ flex: 1, maxWidth: 100 }}>
                                                    <div className="risk-meter-fill" style={{
                                                        width: `${occupancyPct}%`,
                                                        background: occupancyPct >= 90 ? 'var(--danger)' : occupancyPct >= 60 ? 'var(--warning)' : 'var(--success)',
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{occupancyPct}%</span>
                                            </div>
                                        </td>
                                        <td>{parseFloat(room.rate_per_day) > 0 ? `Rs. ${room.rate_per_day}` : 'Free'}</td>
                                        <td>
                                            <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                                                {isAvailable ? 'Available' : 'Full'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
