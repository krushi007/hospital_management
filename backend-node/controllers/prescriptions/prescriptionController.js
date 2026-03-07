const Prescription = require("../../models/Prescription");
const DoctorProfile = require("../../models/DoctorProfile");

exports.getPrescriptions = async (req, res) => {
  try {
    const filter = {};
    if (req.user?.role && req.user.role.toLowerCase() === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({
        user: req.user.user_id,
      });
      if (!doctorProfile) return res.json([]);
      filter.doctor = doctorProfile._id;
    }
    const prescriptions = await Prescription.find(filter)
      .populate({
        path: "doctor",
        populate: { path: "user", select: "first_name last_name" },
      })
      .populate({
        path: "patient",
        populate: { path: "user", select: "first_name last_name" },
      })
      .sort({ created_at: -1 });

    const result = prescriptions.map((p) => ({
      id: p._id,
      diagnosis: p.diagnosis,
      notes: p.notes,
      medications: p.medications,
      is_analyzed: p.is_analyzed,
      ai_analysis: p.ai_analysis,
      created_at: p.created_at,
      doctor_name: p.doctor?.user
        ? `${p.doctor.user.first_name} ${p.doctor.user.last_name}`
        : "",
      patient_name: p.patient?.user
        ? `${p.patient.user.first_name} ${p.patient.user.last_name}`
        : "",
      patient_id: p.patient?._id?.toString() || null,
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const { patient, appointment, diagnosis, notes, medications } = req.body;
    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.user_id,
    });
    if (!doctorProfile)
      return res
        .status(400)
        .json({ error: "Doctor profile not found for logged-in user." });

    const rx = await Prescription.create({
      doctor: doctorProfile._id,
      patient,
      appointment: appointment || null,
      diagnosis,
      notes: notes || "",
      medications: medications || [],
    });
    res.status(201).json({ id: rx._id, message: "Prescription created" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMedicalReports = async (req, res) => {
  res.json([]);
};

exports.analyzePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const mockAnalysis = {
      risk_level: "low",
      risk_score: 15,
      summary: "Clear prescription. No immediate risks.",
      interactions: [],
    };
    const rx = await Prescription.findByIdAndUpdate(
      id,
      { ai_analysis: mockAnalysis, is_analyzed: true },
      { new: true },
    );
    res.json(rx);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
