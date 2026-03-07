import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DepartmentsPage = () => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null);

    const fetchDepartments = () => {
        departmentAPI.list()
            .then(res => setDepartments(res.data.results || res.data))
            .catch(() => toast.error('Failed to load departments'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchDepartments(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            if (editId) {
                await departmentAPI.update(editId, form);
                toast.success('Department updated!');
            } else {
                await departmentAPI.create(form);
                toast.success('Department created!');
            }
            setShowModal(false);
            setForm({ name: '', description: '' });
            setEditId(null);
            setErrors({});
            fetchDepartments();
        } catch (err) {
            const msg = err.response?.data;
            if (typeof msg === 'string') {
                toast.error(msg);
            } else if (msg) {
                setErrors(msg);
                toast.error('Please check the form for errors');
            } else {
                toast.error('Operation failed');
            }
        }
    };

    const handleEdit = (dept) => {
        setForm({ name: dept.name, description: dept.description });
        setEditId(dept.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        try {
            await departmentAPI.delete(id);
            toast.success('Department deleted');
            fetchDepartments();
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div><h1>🏢 Departments</h1><p>Manage hospital departments</p></div>
                {user?.role === 'admin' && (
                    <button className="btn btn-primary" onClick={() => { setForm({ name: '', description: '' }); setEditId(null); setShowModal(true); }}>
                        + Add Department
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
                {departments.map(dept => (
                    <div key={dept.id} className="card">
                        <div className="card-header">
                            <h3>{dept.name}</h3>
                            <span className={`badge ${dept.is_active ? 'badge-success' : 'badge-danger'}`}>
                                {dept.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 12 }}>
                            {dept.description || 'No description'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                🛏️ {dept.room_count || 0} rooms
                            </span>
                            {user?.role === 'admin' && (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(dept)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editId ? 'Edit' : 'Add'} Department</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={errors.name ? 'input-error' : ''} />
                                {errors.name && <span className="error-msg">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={errors.description ? 'input-error' : ''} />
                                {errors.description && <span className="error-msg">{Array.isArray(errors.description) ? errors.description[0] : errors.description}</span>}
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsPage;
