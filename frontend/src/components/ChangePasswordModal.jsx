import React, { useState } from "react";
import { authAPI } from "../api/client";
import toast from "react-hot-toast";

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
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
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

// ── main modal ────────────────────────────────────────────────────────────────
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const strength = getStrength(newPassword);
  const match = confirmPassword && newPassword === confirmPassword;
  const mismatch = confirmPassword && newPassword !== confirmPassword;

  const reset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
    try {
      await authAPI.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully! 🎉");
      reset();
      setTimeout(onClose, 1200);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card-bg, #1e293b)",
          borderRadius: 20,
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
          position: "relative",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.05)",
            border: "none",
            color: "var(--text-muted)",
            borderRadius: 8,
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔐</div>
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Change Password
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Keep your account secure with a strong password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <PasswordField
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your current password"
          />

          {/* Divider */}
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
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 8 }}>
                {strength.score < 4 && "Use uppercase, numbers & symbols to strengthen"}
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

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text-primary)",
                fontSize: "0.92rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || mismatch}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: loading || mismatch ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontSize: "0.92rem",
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
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Changing…
                </>
              ) : (
                "🔑 Change Password"
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
