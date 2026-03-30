import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import toast from 'react-hot-toast';

// ── password strength ─────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "transparent" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score, ...map[score] };
};

// ── eye icon ──────────────────────────────────────────────────────────────────
const EyeIcon = ({ visible }) =>
  visible ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

// ── field component ───────────────────────────────────────────────────────────
const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          style={{
            width: "100%",
            padding: "12px 44px 12px 14px",
            background: "var(--bg-primary)",
            border: "1.5px solid var(--border)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            outline: "none",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent, #6366f1)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <EyeIcon visible={show} />
        </button>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const strength = getStrength(newPassword);
    const match = confirmPassword && newPassword === confirmPassword;
    const mismatch = confirmPassword && newPassword !== confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        try {
            const response = await authAPI.forgotPassword({ email, role, newPassword });
            setSuccessMessage(response.data.message || 'Password successfully reset.');
            toast.success('Password reset successfully! 🎉');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to reset password. Check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: 440, padding: '36px 32px 28px' }}>
                <div style={{ fontSize: "2rem", marginBottom: 8, textAlign: 'center' }}>🔐</div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)", textAlign: 'center' }}>
                    Reset Password
                </h1>
                <p style={{ margin: "6px 0 24px", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: 'center' }}>
                    Verify your account details and set a new password.
                </p>
                
                {successMessage ? (
                    <div style={{ marginTop: 20, padding: 20, background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 10, textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 10 }}>✅</div>
                        <h3 style={{ color: '#22c55e', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Success!</h3>
                        <p style={{ color: 'var(--text-primary)', margin: '0 0 20px 0', fontSize: '0.95rem' }}>{successMessage}</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ display: 'inline-block' }}>
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Role</label>
                            <select 
                                value={role} 
                                onChange={e => setRole(e.target.value)} 
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    border: '1.5px solid var(--border)',
                                    background: 'var(--bg-input)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="pharmacist">Pharmacist</option>
                                <option value="patient">Patient</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder="name@hospital.com" 
                                required 
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    border: '1.5px solid var(--border)',
                                    background: 'var(--bg-input)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0 20px" }} />

                        <PasswordField
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />

                        {/* Strength bar */}
                        {newPassword && (
                            <div style={{ marginTop: -12, marginBottom: 20 }}>
                            <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                                {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                    flex: 1,
                                    height: 4,
                                    borderRadius: 99,
                                    background: i <= strength.score ? strength.color : "var(--border)",
                                    transition: "background 0.3s",
                                    }}
                                />
                                ))}
                            </div>
                            <span style={{ fontSize: "0.75rem", color: strength.color, fontWeight: 600 }}>
                                {strength.label}
                            </span>
                            </div>
                        )}

                        <PasswordField
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                        />

                        {/* Match indicator */}
                        {confirmPassword && (
                            <div style={{ marginTop: -12, marginBottom: 20, fontSize: "0.78rem", fontWeight: 600, color: match ? "#22c55e" : "#ef4444" }}>
                            {match ? "✓ Passwords match" : "✗ Passwords do not match"}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading || mismatch} 
                            style={{ 
                                marginTop: 8,
                                width: '100%',
                                padding: "12px",
                                borderRadius: 10,
                                border: "none",
                                background: loading || mismatch ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                color: "#fff",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                cursor: loading || mismatch ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                boxShadow: loading || mismatch ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            {loading ? 'Resetting...' : '🔑 Reset Password'}
                        </button>
                    </form>
                )}

                {!successMessage && (
                    <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0, fontSize: '0.88rem' }}>
                        Remember your password? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Back to Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
