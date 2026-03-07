import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { patientAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const PatientsPage = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        email: '', first_name: '', last_name: '', phone: '',
        gender: 'male', date_of_birth: '', blood_group: '',
        address: '', emergency_contact: '', allergies: '',
        height: '', weight: '',
        password: 'patient123'
    });

    const fetchPatients = () => {
        patientAPI.list({ search: search || undefined })
            .then(res => setPatients(res.data.results || res.data || []))
            .catch(() => toast.error('Failed to load patients'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchPatients(); }, []);
    useEffect(() => { const t = setTimeout(fetchPatients, 300); return () => clearTimeout(t); }, [search]);

    const resetForm = () => {
        setForm({
            email: '', first_name: '', last_name: '', phone: '',
            gender: 'male', date_of_birth: '', blood_group: '',
            address: '', emergency_contact: '', allergies: '',
            height: '', weight: '',
            password: 'patient123'
        });
        setEditingPatient(null);
        setErrors({});
    };

    const openAddModal = () => { resetForm(); setShowModal(true); };

    const openEditModal = (p) => {
        setEditingPatient(p);
        setForm({
            email: p.email || '',
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            phone: p.phone || '',
            gender: p.gender || 'male',
            date_of_birth: p.date_of_birth || '',
            blood_group: p.blood_group || '',
            address: p.address || '',
            emergency_contact: p.emergency_contact || '',
            allergies: p.allergies || '',
            height: p.height_cm || '',
            weight: p.weight_kg || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            if (editingPatient) {
                // Update existing patient profile fields
                const updateData = {};
                for (const f of ['first_name', 'last_name', 'phone', 'gender', 'date_of_birth', 'blood_group', 'address', 'emergency_contact', 'allergies']) {
                    updateData[f] = form[f] || '';
                }
                updateData.height = form.height; // Logic handled in controller
                updateData.weight = form.weight;
                if (!form.date_of_birth) delete updateData.date_of_birth;

                await patientAPI.update(editingPatient.id, updateData);
                toast.success('Patient updated!');
            } else {
                // Create new patient
                const data = { ...form };
                if (data.height) data.height = parseFloat(data.height);
                else delete data.height;
                if (data.weight) data.weight = parseFloat(data.weight);
                else delete data.weight;
                if (!data.date_of_birth) delete data.date_of_birth;

                await patientAPI.create(data);
                toast.success('Patient registered!');
            }
            setShowModal(false);
            resetForm();
            fetchPatients();
        } catch (err) {
            const msg = err.response?.data;
            if (typeof msg === 'string') {
                toast.error(msg);
            } else if (msg) {
                setErrors(msg);
                // If there's a generic 'error' or 'message' field, show it as a toast
                if (msg.error || msg.message || msg.detail) {
                    toast.error(msg.error || msg.message || msg.detail);
                } else {
                    toast.error('Please check the form for errors');
                }
            } else {
                toast.error('Operation failed');
            }
        }
    };

    const handleDelete = async (patient) => {
        const name = `${patient.first_name || ''} ${patient.last_name || ''}`;
        const result = await Swal.fire({
            title: 'Delete Patient?',
            text: `Are you sure you want to delete "${name}"? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            background: '#1e293b',
            color: '#f1f5f9',
        });
        if (!result.isConfirmed) return;
        try {
            await patientAPI.delete(patient.id);
            toast.success(`${name} deleted`);
            fetchPatients();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete patient');
        }
    };

    const navigate = useNavigate();
    const canAdd = user?.role === 'admin' || user?.role === 'receptionist';
    const canDelete = user?.role === 'admin' || user?.role === 'receptionist';

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Patients</h1>
                    <p>{patients.length} registered patients</p>
                </div>
                {canAdd && (
                    <button className="btn btn-primary" onClick={openAddModal}>+ Add New Patient</button>
                )}
            </div>

            <div style={{ marginBottom: 16 }}>
                <input className="search-input" placeholder="Search patients by name..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Blood Group</th>
                            <th>Age</th>
                            <th>Allergies</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? patients.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.first_name} {p.last_name}</strong></td>
                                <td style={{ color: 'var(--text-muted)' }}>{p.email}</td>
                                <td style={{ textTransform: 'capitalize' }}>{p.gender || '—'}</td>
                                <td>{p.blood_group || '—'}</td>
                                <td>{p.age || '—'}</td>
                                <td>{p.allergies || 'None'}</td>
                                <td>{p.phone || p.emergency_contact || '—'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-sm" onClick={() => navigate(`/appointments?patientId=${p.id}`)}
                                            style={{ background: 'var(--success)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
                                            Book
                                        </button>
                                        {canAdd && (
                                            <button className="btn btn-sm" onClick={() => openEditModal(p)}
                                                style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
                                                Edit
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button className="btn btn-sm" onClick={() => handleDelete(p)}
                                                style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No patients found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Patient Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingPatient ? 'Edit Patient' : 'Register New Patient'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })}
                                        required className={errors.first_name ? 'input-error' : ''} />
                                    {errors.first_name && <span className="error-msg">{Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })}
                                        required className={errors.last_name ? 'input-error' : ''} />
                                    {errors.last_name && <span className="error-msg">{Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        required disabled={!!editingPatient} placeholder="patient@email.com" className={errors.email ? 'input-error' : ''} />
                                    {errors.email && <span className="error-msg">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+91 XXXXXXXXXX" className={errors.phone ? 'input-error' : ''} />
                                    {errors.phone && <span className="error-msg">{Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={errors.gender ? 'input-error' : ''}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <span className="error-msg">{Array.isArray(errors.gender) ? errors.gender[0] : errors.gender}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} className={errors.date_of_birth ? 'input-error' : ''} />
                                    {errors.date_of_birth && <span className="error-msg">{Array.isArray(errors.date_of_birth) ? errors.date_of_birth[0] : errors.date_of_birth}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Blood Group</label>
                                    <select value={form.blood_group} onChange={e => setForm({ ...form, blood_group: e.target.value })} className={errors.blood_group ? 'input-error' : ''}>
                                        <option value="">Select</option>
                                        <option value="A+">A+</option><option value="A-">A-</option>
                                        <option value="B+">B+</option><option value="B-">B-</option>
                                        <option value="O+">O+</option><option value="O-">O-</option>
                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    </select>
                                    {errors.blood_group && <span className="error-msg">{Array.isArray(errors.blood_group) ? errors.blood_group[0] : errors.blood_group}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact</label>
                                    <input value={form.emergency_contact} onChange={e => setForm({ ...form, emergency_contact: e.target.value })} className={errors.emergency_contact ? 'input-error' : ''} />
                                    {errors.emergency_contact && <span className="error-msg">{Array.isArray(errors.emergency_contact) ? errors.emergency_contact[0] : errors.emergency_contact}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Height (cm)</label>
                                    <input type="number" step="0.1" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="170" className={errors.height ? 'input-error' : ''} />
                                    {errors.height && <span className="error-msg">{Array.isArray(errors.height) ? errors.height[0] : errors.height}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Weight (kg)</label>
                                    <input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="65" className={errors.weight ? 'input-error' : ''} />
                                    {errors.weight && <span className="error-msg">{Array.isArray(errors.weight) ? errors.weight[0] : errors.weight}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" className={errors.address ? 'input-error' : ''} />
                                {errors.address && <span className="error-msg">{Array.isArray(errors.address) ? errors.address[0] : errors.address}</span>}
                            </div>
                            <div className="form-group">
                                <label>Allergies</label>
                                <input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="e.g., Penicillin, Peanuts" className={errors.allergies ? 'input-error' : ''} />
                                {errors.allergies && <span className="error-msg">{Array.isArray(errors.allergies) ? errors.allergies[0] : errors.allergies}</span>}
                            </div>
                            {!editingPatient && (
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                                    Default password: <strong>patient123</strong>
                                </p>
                            )}
                            <button type="submit" className="btn btn-primary btn-block">
                                {editingPatient ? 'Save Changes' : 'Register Patient'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientsPage;
