import React, { useState, useEffect, useRef } from "react";
import { notificationAPI } from "../api/client";
import { useNavigate } from "react-router-dom";

const typeIcon = { appointment: "📅", lab: "🔬", leave: "🏖️", billing: "💰", admission: "🏥", general: "📢" };

const NotificationBell = () => {
  const [data, setData] = useState({ notifications: [], unread_count: 0 });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.list();
      setData(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async (notif) => {
    if (!notif.read) {
      await notificationAPI.markAsRead(notif.id);
      setData(prev => ({
        ...prev,
        unread_count: Math.max(0, prev.unread_count - 1),
        notifications: prev.notifications.map(n => n.id === notif.id ? { ...n, read: true } : n)
      }));
    }
    if (notif.link) { navigate(notif.link); setOpen(false); }
  };

  const handleMarkAll = async () => {
    await notificationAPI.markAllRead();
    setData(prev => ({
      ...prev,
      unread_count: 0,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          position: "relative", padding: "6px 10px", borderRadius: "10px",
          transition: "background 0.2s",
          color: "var(--text-secondary)",
          fontSize: "1.3rem",
        }}
        title="Notifications"
      >
        🔔
        {data.unread_count > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 4,
            background: "#ef4444", color: "#fff",
            borderRadius: "50%", fontSize: "0.62rem", fontWeight: 700,
            minWidth: 16, height: 16, display: "flex",
            alignItems: "center", justifyContent: "center",
            padding: "0 3px", lineHeight: 1
          }}>
            {data.unread_count > 99 ? "99+" : data.unread_count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "fixed", top: 60, right: 20, width: 360, maxHeight: 480,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden", display: "flex", flexDirection: "column",
          zIndex: 9999
        }}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px", borderBottom: "1px solid var(--border)"
          }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>🔔 Notifications</span>
            {data.unread_count > 0 && (
              <button
                onClick={handleMarkAll}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: "0.78rem", fontWeight: 600 }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {data.notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🔕</div>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>No notifications yet</p>
              </div>
            ) : data.notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  display: "flex", gap: 12, padding: "12px 18px",
                  cursor: n.link ? "pointer" : "default",
                  background: n.read ? "transparent" : "rgba(14,165,233,0.07)",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: 2 }}>
                  {typeIcon[n.type] || "📢"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontSize: "0.83rem", color: "var(--text-primary)", lineHeight: 1.45 }}>
                    {n.message}
                  </p>
                  <small style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{timeAgo(n.created_at)}</small>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
