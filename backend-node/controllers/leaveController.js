const LeaveRequest = require("../models/LeaveRequest");
const DoctorProfile = require("../models/DoctorProfile");
const { createNotification } = require("./notificationController");

// Get Leaves based on Role
exports.getLeaves = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user.user_id });
      if (doctorProfile) {
        query.doctor = doctorProfile._id;
      } else {
        return res.json([]);
      }
    }

    const { status, date, doctor } = req.query;
    if (status) query.status = status;
    if (date) query.date = new Date(date);
    if (doctor) query.doctor = doctor;

    const leaves = await LeaveRequest.find(query)
      .populate({ path: "doctor", populate: { path: "user", select: "first_name last_name email" } })
      .sort({ date: 1, created_at: -1 });

    const formatted = leaves.map(l => ({
      id: l._id,
      doctor_id: l.doctor?._id,
      doctor_name: l.doctor?.user ? `${l.doctor.user.first_name} ${l.doctor.user.last_name}` : 'Unknown',
      department_name: l.doctor?.department_name || '',
      date: l.date.toISOString().split('T')[0],
      reason: l.reason,
      status: l.status,
      created_at: l.created_at
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};

// Request a new leave
exports.requestLeave = async (req, res) => {
  try {
    const { date, reason, doctor_id } = req.body;
    if (!date || !reason) {
      return res.status(400).json({ detail: "Date and Reason are required." });
    }

    let targetDoctorId = null;
    if (req.user.role === 'doctor') {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user.user_id });
      if (!doctorProfile) return res.status(404).json({ detail: "Doctor profile not found." });
      targetDoctorId = doctorProfile._id;
    } else {
      if (!doctor_id) return res.status(400).json({ detail: "Doctor ID is required for admins." });
      targetDoctorId = doctor_id;
    }

    // Check if leave already exists for this date
    const existingLeave = await LeaveRequest.findOne({ doctor: targetDoctorId, date: new Date(date) });
    if (existingLeave) {
      return res.status(400).json({ detail: `A leave request already exists for ${date}.` });
    }

    const newLeave = await LeaveRequest.create({
      doctor: targetDoctorId,
      date: new Date(date),
      reason,
      status: "pending"
    });

    res.status(201).json({ message: "Leave request submitted successfully", leave: newLeave });

    // Notify the doctor their request was submitted
    const docProfile = await DoctorProfile.findById(targetDoctorId).populate('user');
    if (docProfile?.user) {
      await createNotification(
        docProfile.user._id,
        `Your leave request for ${date} has been submitted and is pending approval.`,
        'leave',
        '/leaves'
      );
    }
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};

// Update leave status (Approve/Reject)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ detail: "Invalid status." });
    }

    const leave = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true })
      .populate({ path: 'doctor', populate: { path: 'user', select: '_id first_name last_name' } });
    if (!leave) return res.status(404).json({ detail: "Leave request not found." });

    // Notify the doctor of the decision
    if (leave.doctor?.user?._id) {
      const dateStr = leave.date?.toISOString().split('T')[0];
      const msg = status === 'approved'
        ? `Your leave request for ${dateStr} has been APPROVED.`
        : `Your leave request for ${dateStr} has been REJECTED.`;
      await createNotification(leave.doctor.user._id, msg, 'leave', '/leaves');
    }

    res.json({ message: `Leave ${status}.`, leave });
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};

// Delete leave request (only if pending)
exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ detail: "Leave request not found." });

    if (leave.status !== 'pending' && req.user.role === 'doctor') {
      return res.status(400).json({ detail: "Cannot delete a processed leave request." });
    }

    await LeaveRequest.findByIdAndDelete(id);
    res.json({ message: "Leave request deleted." });
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};
