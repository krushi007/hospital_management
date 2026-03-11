const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const Appointment = require("../models/Appointment");

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate("user", "first_name last_name email phone")
      .populate("department", "name");

    const result = await Promise.all(
      doctors.map(async (d) => {
        const pending = await Appointment.countDocuments({
          doctor: d._id,
          status: { $in: ["booked", "confirmed"] },
        });
        const ongoing = await Appointment.countDocuments({
          doctor: d._id,
          status: "in_progress",
        });
        return {
          id: d._id,
          user_id: d.user?._id,
          first_name: d.user?.first_name,
          last_name: d.user?.last_name,
          email: d.user?.email,
          phone: d.user?.phone,
          specialization: d.specialization,
          license_no: d.license_no,
          experience_years: d.experience_years,
          qualification: d.qualification,
          fee: d.fee,
          bio: d.bio,
          is_active: d.is_active,
          department_name: d.department?.name || "",
          department: d.department?._id || null,
          pending_appointments: pending,
          ongoing_appointments: ongoing,
        };
      }),
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const d = await DoctorProfile.findById(req.params.id)
      .populate("user", "first_name last_name email phone")
      .populate("department", "name");
    if (!d) return res.status(404).json({ detail: "Not found." });
    res.json({
      id: d._id,
      first_name: d.user?.first_name,
      last_name: d.user?.last_name,
      email: d.user?.email,
      phone: d.user?.phone,
      specialization: d.specialization,
      department: d.department?._id,
      department_name: d.department?.name,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      department,
      specialization,
      experience_years,
      fee,
      license_no,
      qualification,
      phone,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password || "doctor123", 10);
    const user = await User.create({
      email,
      username: `dr_${first_name.toLowerCase()}_${Date.now()}`,
      password: hashedPassword,
      first_name,
      last_name,
      role: "doctor",
      phone: phone || "",
    });
    const profile = await DoctorProfile.create({
      user: user._id,
      email: email,
      department: department || null,
      specialization,
      license_no,
      experience_years,
      qualification,
      fee,
    });
    res
      .status(201)
      .json({ message: "Doctor created successfully", id: profile._id });
  } catch (e) {
    if (e.code === 11000)
      return res
        .status(400)
        .json({ error: "Email or credentials may already exist." });
    res.status(500).json({ error: e.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      department,
      specialization,
      experience_years,
      fee,
      license_no,
      qualification,
      phone,
    } = req.body;
    const profile = await DoctorProfile.findById(id);
    if (!profile) return res.status(404).json({ detail: "Not found." });
    await User.findByIdAndUpdate(profile.user, {
      first_name,
      last_name,
      phone,
    });
    await DoctorProfile.findByIdAndUpdate(id, {
      specialization,
      license_no,
      experience_years,
      qualification,
      fee,
      department: department || null,
    });
    res.json({ message: "Doctor profile updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await DoctorProfile.findById(id);
    if (!profile) return res.status(404).json({ detail: "Not found." });
    await User.findByIdAndDelete(profile.user);
    await DoctorProfile.findByIdAndDelete(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
