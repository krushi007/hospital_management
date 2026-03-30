const Appointment = require("../../models/Appointment");
const DoctorProfile = require("../../models/DoctorProfile");
const PatientProfile = require("../../models/PatientProfile");
const LeaveRequest = require("../../models/LeaveRequest");
const { createNotification } = require("../notificationController");

exports.getAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;

    // Doctor: filter by their own profile
    if (req.user?.role && req.user.role.toLowerCase() === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({
        user: req.user.user_id,
      });
      if (!doctorProfile) return res.json([]);
      filter.doctor = doctorProfile._id;
    }

    // Patient: filter by their own profile
    if (req.user?.role && req.user.role.toLowerCase() === "patient") {
      const patientProfile = await PatientProfile.findOne({
        user: req.user.user_id,
      });
      if (!patientProfile) return res.json([]);
      filter.patient = patientProfile._id;
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "doctor",
        populate: { path: "user", select: "first_name last_name email" },
      })
      .populate({
        path: "patient",
        populate: { path: "user", select: "first_name last_name email" },
      })
      .sort({ date: -1, time_slot: -1 });

    const result = appointments.map((a) => ({
      id: a._id,
      date: a.date,
      time_slot: a.time_slot,
      status: a.status,
      reason: a.reason,
      notes: a.notes,
      doctor_id: a.doctor?._id,
      doctor_name: a.doctor?.user
        ? `${a.doctor.user.first_name} ${a.doctor.user.last_name}`
        : "",
      patient_id: a.patient?._id || null,
      patient_name: a.patient?.user
        ? `${a.patient.user.first_name} ${a.patient.user.last_name}`
        : a.manual_patient_name || "",
      manual_patient_name: a.manual_patient_name,
      created_at: a.created_at,
      admission_requested: a.admission_requested || false,
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { patient, manual_patient_name, doctor, date, time_slot, reason } =
      req.body;

    // Check for approved leave overlap
    const existingLeave = await LeaveRequest.findOne({
      doctor,
      date: new Date(date),
      status: "approved"
    });

    if (existingLeave) {
      return res.status(400).json({
        error: "Doctor is unavailable on this date due to approved leave."
      });
    }
      
    // Check for duplicate booking
    const existingAppt = await Appointment.findOne({
      doctor,
      patient,
      date,
      time_slot,
      status: { $ne: "cancelled" }
    });
    
    if (existingAppt) {
      return res.status(400).json({ 
        error: "Patient already has an appointment booked for this time slot with this doctor." 
      });
    }

    const appt = await Appointment.create({
      doctor,
      patient: patient || null,
      manual_patient_name: manual_patient_name || null,
      date,
      time_slot,
      reason: reason || "",
      created_by: req.user?.user_id || null,
    });
    // Notify the assigned doctor
    const doctorProfile = await DoctorProfile.findById(doctor).populate('user');
    if (doctorProfile?.user) {
      const patientName = manual_patient_name || 'a registered patient';
      await createNotification(
        doctorProfile.user._id,
        `New appointment booked for ${patientName} on ${date} at ${time_slot}.`,
        'appointment',
        '/appointments'
      );
    }

    res
      .status(201)
      .json({ id: appt._id, message: "Appointment created successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Define allowed status transitions (can only move forward, or cancel)
    const ALLOWED_TRANSITIONS = {
      booked: ["confirmed", "cancelled"],
      confirmed: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
      completed: [],    // Cannot change once completed
      cancelled: [],    // Cannot change once cancelled
    };

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const currentStatus = appointment.status;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Cannot change status from "${currentStatus}" to "${status}". ${
          currentStatus === "completed" ? "Completed appointments cannot be modified." :
          currentStatus === "cancelled" ? "Cancelled appointments cannot be modified." :
          `Allowed transitions: ${allowed.join(", ") || "none"}`
        }`
      });
    }

    await Appointment.findByIdAndUpdate(id, { status });
    res.json({ message: "Status updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.requestAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(
      id,
      { admission_requested: true },
      { new: true },
    ).populate({ path: 'patient', populate: { path: 'user', select: 'first_name last_name' } });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    // Notify all admins via a general notification (stored for the booking user)
    const patientName = appt.patient?.user
      ? `${appt.patient.user.first_name} ${appt.patient.user.last_name}`
      : appt.manual_patient_name || 'a patient';
    if (req.user?.user_id) {
      await createNotification(
        req.user.user_id,
        `Admission requested for ${patientName}. Waiting for receptionist to process.`,
        'admission',
        '/admissions'
      );
    }

    res.json({ message: "Admission requested successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
