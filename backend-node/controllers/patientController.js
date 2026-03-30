const bcrypt = require("bcryptjs");
const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");
const Appointment = require("../models/Appointment");
const DoctorProfile = require("../models/DoctorProfile");
const Prescription = require("../models/Prescription");
const Admission = require("../models/Admission");
const Invoice = require("../models/Invoice");
const LabTest = require("../models/LabTest");

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

    // Filter to only show patients who have appointments/prescriptions with a specific doctor (or logged in doctor)
    const filterDoctorId = req.query.doctor_id 
        ? req.query.doctor_id 
        : (req.query.my_patients === "true" && req.user && req.user.role === "doctor" ? await DoctorProfile.findOne({ user: req.user.user_id }).then(d => d?._id) : null);

    if (filterDoctorId) {
      const mongoose = require("mongoose");
      const [apptPatientIds, rxPatientIds] = await Promise.all([
        Appointment.find({ doctor: filterDoctorId, patient: { $ne: null } }).distinct("patient"),
        Prescription.find({ doctor: filterDoctorId }).distinct("patient"),
      ]);
      // Merge unique patient IDs from both sources
      const allIds = [...new Set([
        ...apptPatientIds.map(id => id.toString()),
        ...rxPatientIds.map(id => id.toString()),
      ])];

      // Only filter if the doctor has at least one patient, otherwise result should be empty
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

    if (req.query.admission_requested === "true") {
      const Admission = require("../models/Admission");

      const [requestedAppointments, activeAdmissions] = await Promise.all([
        Appointment.find({
          admission_requested: true,
          status: { $in: ["booked", "confirmed", "in_progress", "completed"] },
        }).distinct("patient"),
        // Patients who are ALREADY in a room right now
        Admission.find({ status: "admitted" }).distinct("patient"),
      ]);

      const alreadyAdmittedSet = new Set(activeAdmissions.map((id) => id.toString()));

      // Keep only patients with an admission request AND who are NOT already admitted
      const eligibleIds = requestedAppointments.filter(
        (id) => !alreadyAdmittedSet.has(id.toString())
      );

      if (profileQuery._id) {
        profileQuery._id = {
          $in: profileQuery._id.$in.filter((id) =>
            eligibleIds.some((rId) => rId.equals(id)),
          ),
        };
      } else {
        profileQuery._id = { $in: eligibleIds };
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
      "first_name last_name email phone avatar",
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
      avatar: p.user?.avatar,
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
      "first_name last_name email phone avatar",
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
      phone: p.user?.phone,
      avatar: p.user?.avatar,
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
      avatar,
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
      avatar: avatar || "",
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
      avatar,
    } = req.body;
    const profile = await PatientProfile.findById(id);
    if (!profile) return res.status(404).json({ detail: "Not found." });
    await User.findByIdAndUpdate(profile.user, {
      first_name,
      last_name,
      phone: phone || "",
      avatar,
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

exports.getPatientEMR = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await PatientProfile.findById(id).populate('user', 'first_name last_name email phone avatar');
        if (!patient) return res.status(404).json({ detail: "Patient not found" });

        // Fetch all related records
        const [appointments, prescriptions, admissions, invoices, labs] = await Promise.all([
            Appointment.find({ patient: id })
                .populate({ path: 'doctor', populate: { path: 'user', select: 'first_name last_name' } })
                .populate('department', 'name')
                .sort({ date: -1 }),
            Prescription.find({ patient: id })
                .populate({ path: 'doctor', populate: { path: 'user', select: 'first_name last_name' } })
                .sort({ created_at: -1 }),
            Admission.find({ patient: id })
                .populate('room', 'room_number type')
                .sort({ admit_date: -1 }),
            Invoice.find({ patient: id })
                .sort({ created_at: -1 }),
            LabTest.find({ patient: id })
                .populate("requested_by", "first_name last_name")
                .sort({ created_at: -1 })
        ]);

        // Combine into a unified timeline
        const timeline = [];

        appointments.forEach(a => {
            timeline.push({
                _id: a._id.toString() + '_appt',
                type: 'appointment',
                date: new Date(a.date),
                title: 'Appointment: ' + (a.manual_patient_name || `${patient.user?.first_name} ${patient.user?.last_name}`),
                description: `Status: ${a.status} | With Dr. ${a.doctor?.user?.first_name || ''} ${a.doctor?.user?.last_name || ''}`,
                extra: `Time: ${a.time_slot} | Reason: ${a.reason || 'N/A'}`
            });
        });

        prescriptions.forEach(p => {
            timeline.push({
                _id: p._id.toString() + '_presc',
                type: 'prescription',
                date: new Date(p.created_at),
                title: 'Prescription Issued',
                description: `Diagnosis: ${p.diagnosis} | By Dr. ${p.doctor?.user?.first_name || ''} ${p.doctor?.user?.last_name || ''}`,
                extra: `Medicines: ${(p.medications || []).map(m => m.name).join(', ') || 'None'}`
            });
        });

        admissions.forEach(a => {
            timeline.push({
                _id: a._id.toString() + '_admit',
                type: 'admission',
                date: new Date(a.admit_date),
                title: 'Patient Admitted',
                description: `Room: ${a.room?.room_number || 'N/A'} (${a.room?.type || 'N/A'}) | Status: ${a.status}`,
                extra: `Reason: ${a.reason || 'N/A'}`
            });
            if (a.discharge_date) {
                timeline.push({
                    _id: a._id.toString() + '_discharge',
                    type: 'discharge',
                    date: new Date(a.discharge_date),
                    title: 'Patient Discharged',
                    description: `Discharged from Room ${a.room?.room_number || 'N/A'}`,
                    extra: `Summary: ${a.notes || 'N/A'}`
                });
            }
        });

        invoices.forEach(i => {
            timeline.push({
                _id: i._id.toString() + '_inv',
                type: 'invoice',
                date: new Date(i.created_at),
                title: 'Invoice Generated',
                description: `Amount: ₹${i.total_amount} | Status: ${i.status}`,
                extra: `Paid: ₹${i.paid_amount} | Balance: ₹${i.total_amount - i.paid_amount}`
            });
        });

        labs.forEach(l => {
            timeline.push({
                _id: l._id.toString() + '_lab',
                type: 'lab',
                date: new Date(l.created_at),
                title: 'Lab Test Requested',
                description: `Test: ${l.test_name} | Requested By: Staff ${l.requested_by?.first_name || ''} ${l.requested_by?.last_name || ''}`,
                extra: `Status: ${l.status} | Notes: ${l.notes || 'None'}`
            });
            if (l.status === 'completed' && l.completed_at) {
                timeline.push({
                    _id: l._id.toString() + '_res',
                    type: 'lab_result',
                    date: new Date(l.completed_at),
                    title: 'Lab Result Ready',
                    description: `Test: ${l.test_name}`,
                    extra: `Result: ${l.result_text || 'View Attachment'} ${l.result_url ? `[Link: ${l.result_url}]` : ''}`
                });
            }
        });

        // Sort timeline descending by date
        timeline.sort((a, b) => b.date - a.date);

        res.json({
            patient: {
                id: patient._id,
                name: `${patient.user?.first_name} ${patient.user?.last_name}`,
                avatar: patient.user?.avatar,
                blood_group: patient.blood_group,
                allergies: patient.allergies
            },
            timeline
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
