const Notification = require("../models/Notification");

// Helper to create a notification (used internally by other controllers)
const createNotification = async (userId, message, type = "general", link = "") => {
  try {
    await Notification.create({ user: userId, message, type, link });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

// GET /api/notifications — list for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.user_id })
      .sort({ created_at: -1 })
      .limit(30);

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      notifications: notifications.map((n) => ({
        id: n._id,
        message: n.message,
        type: n.type,
        link: n.link,
        read: n.read,
        created_at: n.created_at,
      })),
      unread_count: unreadCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.user_id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createNotification = createNotification;
