const bcrypt = require("bcryptjs");
const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");
const Appointment = require("../models/Appointment");
const DoctorProfile = require("../models/DoctorProfile");
const Prescription = require("../models/Prescription");

exports.getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    let userFilter = {};
    if (search) {
      userFilter = {
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const users = search
      ? await User.find({ ...userFilter, role: "patient" }).select(
          "_id first_name last_name email",
        )
      : await User.find({ role: "patient" }).select(
          "_id first_name last_name email",
        );
    const userIds = users.map((u) => u._id);
    let profileQuery = { user: { $in: userIds } };

    if (req.query.require_appointment === "true") {
      const activeAppointments = await Appointment.find({
        status: { $in: ["booked", "confirmed", "in_progress"] },
      }).distinct("patient");
      profileQuery._id = { $in: activeAppointments };
    }

    // Filter to only show patients who have appointments/prescriptions with the logged-in doctor
    if (req.query.my_patients === "true" && req.user && req.user.role === "doctor") {
      const mongoose = require("mongoose");
      const doctorProfile = await DoctorProfile.findOne({ user: req.user.user_id });
      if (doctorProfile) {
        const [apptPatientIds, rxPatientIds] = await Promise.all([
          Appointment.find({ doctor: doctorProfile._id, patient: { $ne: null } }).distinct("patient"),
          Prescription.find({ doctor: doctorProfile._id }).distinct("patient"),
        ]);
        // Merge unique patient IDs from both sources
        const allIds = [...new Set([
          ...apptPatientIds.map(id => id.toString()),
          ...rxPatientIds.map(id => id.toString()),
        ])];

        // Only filter if the doctor has at least one patient, otherwise show all
        if (allIds.length > 0) {
          const mergedObjectIds = allIds.map(id => new mongoose.Types.ObjectId(id));
          if (profileQuery._id) {
            profileQuery._id = {
              $in: profileQuery._id.$in.filter(id =>
                allIds.includes(id.toString())
              ),
            };
          } else {
            profileQuery._id = { $in: mergedObjectIds };
          }
        }
      }
    }

    if (req.query.admission_requested === "true") {
      const requestedAppointments = await Appointment.find({
        admission_requested: true,
        status: { $in: ["booked", "confirmed", "in_progress", "completed"] },
      }).distinct("patient");

      if (profileQuery._id) {
        profileQuery._id = {
          $in: profileQuery._id.$in.filter((id) =>
            requestedAppointments.some((rId) => rId.equals(id)),
          ),
        };
      } else {
        profileQuery._id = { $in: requestedAppointments };
      }
    }

    if (req.query.booked_date) {
      const dateAppointments = await Appointment.find({
        date: req.query.booked_date,
        status: { $in: ["booked", "confirmed", "in_progress"] },
      }).distinct("patient");

      // Intersect if we already filtered by require_appointment, otherwise just use these IDs
      if (profileQuery._id) {
        profileQuery._id = {
          $in: profileQuery._id.$in.filter((id) =>
            dateAppointments.some((dId) => dId.equals(id)),
          ),
        };
      } else {
        profileQuery._id = { $in: dateAppointments };
      }
    }

    const profiles = await PatientProfile.find(profileQuery).populate(
      "user",
      "first_name last_name email",
    );

    // Fetch all active appointments for these profiles
    const profileIds = profiles.map((p) => p._id);
    const activeAppts = await Appointment.find({
      patient: { $in: profileIds },
      status: { $in: ["booked", "confirmed", "in_progress", "completed"] },
    }).select("patient");
    const activeApptPatientIds = new Set(
      activeAppts.map((a) => a.patient.toString()),
    );

    const result = profiles.map((p) => ({
      id: p._id,
      user_id: p.user?._id,
      first_name: p.user?.first_name,
      last_name: p.user?.last_name,
      email: p.user?.email,
      gender: p.gender,
      date_of_birth: p.date_of_birth,
      blood_group: p.blood_group,
      address: p.address,
      emergency_contact: p.emergency_contact,
      allergies: p.allergies,
      height_cm: p.height_cm,
      weight_kg: p.weight_kg,
      has_active_appointment: activeApptPatientIds.has(p._id.toString()),
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const p = await PatientProfile.findById(req.params.id).populate(
      "user",
      "first_name last_name email",
    );
    if (!p) return res.status(404).json({ detail: "Not found." });
    res.json({
      id: p._id,
      first_name: p.user?.first_name,
      last_name: p.user?.last_name,
      email: p.user?.email,
      gender: p.gender,
      date_of_birth: p.date_of_birth,
      blood_group: p.blood_group,
      address: p.address,
      emergency_contact: p.emergency_contact,
      allergies: p.allergies,
      height_cm: p.height_cm,
      weight_kg: p.weight_kg,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const p = await PatientProfile.findOne({ user: req.user.user_id }).populate(
      "user",
      "first_name last_name email role",
    );
    if (!p)
      return res.status(404).json({ detail: "Patient profile not found." });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      password,
      phone,
      gender,
      date_of_birth,
      blood_group,
      address,
      emergency_contact,
      allergies,
      height,
      weight,
    } = req.body;
    if (!email || !first_name || !last_name || !password)
      return res.status(400).json({ error: "Required fields missing" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username: email,
      password: hashedPassword,
      first_name,
      last_name,
      role: "patient",
      phone: phone || "",
    });
    const profile = await PatientProfile.create({
      user: user._id,
      gender: gender || "",
      date_of_birth: date_of_birth || null,
      blood_group: blood_group || "",
      address: address || "",
      emergency_contact: emergency_contact || "",
      allergies: allergies || "",
      height_cm: parseFloat(height) || null,
      weight_kg: parseFloat(weight) || null,
    });
    res.status(201).json({
      id: profile._id,
      user_id: user._id,
      message: "Patient created successfully",
    });
  } catch (e) {
    if (e.code === 11000)
      return res
        .status(400)
        .json({ email: "This email is already registered" });
    res.status(500).json({ error: e.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      blood_group,
      phone,
      address,
      emergency_contact,
      allergies,
      height,
      weight,
    } = req.body;
    const profile = await PatientProfile.findById(id);
    if (!profile) return res.status(404).json({ detail: "Not found." });
    await User.findByIdAndUpdate(profile.user, {
      first_name,
      last_name,
      phone: phone || "",
    });
    await PatientProfile.findByIdAndUpdate(id, {
      gender,
      date_of_birth: date_of_birth || null,
      blood_group,
      address: address || "",
      emergency_contact: emergency_contact || "",
      allergies: allergies || "",
      height_cm: parseFloat(height) || null,
      weight_kg: parseFloat(weight) || null,
    });
    res.json({ message: "Patient updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await PatientProfile.findById(id);
    if (!profile) return res.status(404).json({ detail: "Not found." });
    await User.findByIdAndDelete(profile.user);
    await PatientProfile.findByIdAndDelete(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMedicalRecords = async (req, res) => {
  res.json([]);
};
exports.createMedicalRecord = async (req, res) => {
  res.status(201).json({ message: "Medical record created" });
};
