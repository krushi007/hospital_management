import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>⚕️ MedCore HMS</h1>
                <p>Sign in to your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@hospital.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0, fontSize: '0.88rem' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--accent)', fontWeight: 600 }}>Forgot Password?</Link>
                </p>
                <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-primary)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Demo Credentials:</strong><br />
                    Admin: admin@hospital.com / admin123<br />
                    Doctor: dr.sharma@hospital.com / doctor123<br />
                    Reception: reception@hospital.com / recep123<br />
                    Pharmacist: pharmacist@hospital.com / pharma123<br />
                    Patient: patient@hospital.com / patient123
                </div>
            </div>
        </div>
    );
};

export default Login;
