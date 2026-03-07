import React, { useState, useEffect } from 'react';
import { doctorAPI, departmentAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DoctorsPage = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        email: '', first_name: '', last_name: '', phone: '',
        department: '', specialization: '', qualification: 'MBBS',
        experience_years: '', fee: '', license_no: '',
        password: 'doctor123'
    });

    useEffect(() => { fetchDoctors(); fetchDepartments(); }, []);

    const fetchDoctors = async () => {
        try {
            const res = await doctorAPI.list();
            setDoctors(res.data.results || res.data);
        } catch { toast.error('Failed to load doctors'); }
        finally { setLoading(false); }
    };

    const fetchDepartments = async () => {
        try {
            const res = await departmentAPI.list();
            setDepartments(res.data.results || res.data);
        } catch { }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            if (selectedDoctor) {
                await doctorAPI.update(selectedDoctor.id, form);
                toast.success('Doctor updated');
            } else {
                await doctorAPI.create(form);
                toast.success('Doctor added');
            }
            setShowModal(false);
            setSelectedDoctor(null);
            setForm({ email: '', first_name: '', last_name: '', phone: '', department: '', specialization: '', qualification: 'MBBS', experience_years: '', fee: '', license_no: '', password: 'doctor123' });
            setErrors({});
            fetchDoctors();
        } catch (err) {
            const msg = err.response?.data;
            if (typeof msg === 'string') {
                toast.error(msg);
            } else if (msg) {
                setErrors(msg);
                toast.error('Please check the form for errors');
            } else {
                toast.error(err.response?.data?.detail || 'Operation failed');
            }
        }
    };

    const handleEdit = (doc) => {
        setSelectedDoctor(doc);
        setForm({
            email: doc.email || '',
            first_name: doc.first_name || '',
            last_name: doc.last_name || '',
            phone: doc.phone || '',
            department: doc.department?.id || doc.department || '',
            specialization: doc.specialization || '',
            qualification: doc.qualification || '',
            experience_years: doc.experience_years || '',
            fee: doc.fee || '',
            license_no: doc.license_no || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this doctor profile?')) return;
        try {
            await doctorAPI.delete(id);
            toast.success('Doctor removed');
            fetchDoctors();
        } catch { toast.error('Delete failed'); }
    };

    const filtered = doctors.filter(d => {
        const name = `${d.first_name || ''} ${d.last_name || ''}`.toLowerCase();
        const spec = (d.specialization || '').toLowerCase();
        const dept = (d.department_name || d.department?.name || '').toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || spec.includes(q) || dept.includes(q);
    });

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Doctors</h1>
                    <p>Manage doctor profiles and assignments</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'receptionist') && (
                    <button className="btn btn-primary" onClick={() => { setSelectedDoctor(null); setForm({ email: '', first_name: '', last_name: '', phone: '', department: '', specialization: '', qualification: 'MBBS', experience_years: '', fee: '', license_no: '', password: 'doctor123' }); setShowModal(true); }}>
                        + Add Doctor
                    </button>
                )}
            </div>

            <div style={{ marginBottom: 20 }}>
                <input className="search-input" placeholder="Search by name, specialization, or department..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Department</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Appointments</th>
                            <th>Fee</th>
                            <th>License</th>
                            {(user?.role === 'admin') && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No doctors found</td></tr>
                        ) : filtered.map(doc => (
                            <tr key={doc.id}>
                                <td>
                                    <strong>Dr. {doc.first_name} {doc.last_name}</strong>
                                    <br /><span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{doc.email}</span>
                                </td>
                                <td>{doc.department_name || doc.department?.name || '—'}</td>
                                <td>{doc.specialization}</td>
                                <td>{doc.experience_years} yrs</td>
                                <td>
                                    <div style={{ fontSize: '0.82rem' }}>
                                        <span style={{ color: '#3b82f6' }}>Pending: <strong>{doc.pending_appointments || 0}</strong></span>
                                        <br />
                                        <span style={{ color: '#eab308' }}>Ongoing: <strong>{doc.ongoing_appointments || 0}</strong></span>
                                    </div>
                                </td>
                                <td>Rs. {doc.fee}</td>
                                <td>{doc.license_no}</td>
                                {(user?.role === 'admin') && (
                                    <td>
                                        <button className="btn btn-secondary" style={{ marginRight: 6, padding: '4px 10px', fontSize: '0.82rem' }} onClick={() => handleEdit(doc)}>Edit</button>
                                        <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.82rem' }} onClick={() => handleDelete(doc.id)}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedDoctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {!selectedDoctor && (
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={errors.email ? 'input-error' : ''} />
                                    {errors.email && <span className="error-msg">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</span>}
                                </div>
                            )}
                            {!selectedDoctor && (
                                <div className="form-group">
                                    <label>Default Password (Visible)</label>
                                    <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className={errors.password ? 'input-error' : ''} />
                                    {errors.password && <span className="error-msg">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</span>}
                                </div>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required className={errors.first_name ? 'input-error' : ''} />
                                    {errors.first_name && <span className="error-msg">{Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required className={errors.last_name ? 'input-error' : ''} />
                                    {errors.last_name && <span className="error-msg">{Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Department</label>
                                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required className={errors.department ? 'input-error' : ''}>
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                    {errors.department && <span className="error-msg">{Array.isArray(errors.department) ? errors.department[0] : errors.department}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required className={errors.specialization ? 'input-error' : ''} />
                                    {errors.specialization && <span className="error-msg">{Array.isArray(errors.specialization) ? errors.specialization[0] : errors.specialization}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Experience (years)</label>
                                    <input type="number" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: e.target.value })} className={errors.experience_years ? 'input-error' : ''} />
                                    {errors.experience_years && <span className="error-msg">{Array.isArray(errors.experience_years) ? errors.experience_years[0] : errors.experience_years}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Consultation Fee</label>
                                    <input type="number" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} className={errors.fee ? 'input-error' : ''} />
                                    {errors.fee && <span className="error-msg">{Array.isArray(errors.fee) ? errors.fee[0] : errors.fee}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>License No</label>
                                    <input value={form.license_no} onChange={e => setForm({ ...form, license_no: e.target.value })} required className={errors.license_no ? 'input-error' : ''} />
                                    {errors.license_no && <span className="error-msg">{Array.isArray(errors.license_no) ? errors.license_no[0] : errors.license_no}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Qualification</label>
                                    <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className={errors.qualification ? 'input-error' : ''} />
                                    {errors.qualification && <span className="error-msg">{Array.isArray(errors.qualification) ? errors.qualification[0] : errors.qualification}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={errors.phone ? 'input-error' : ''} />
                                {errors.phone && <span className="error-msg">{Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}</span>}
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorsPage;
