const Prescription = require("../../models/Prescription");
const DoctorProfile = require("../../models/DoctorProfile");

exports.getPrescriptions = async (req, res) => {
  try {
    const filter = {};
    const { date } = req.query;

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.created_at = { $gte: startDate, $lte: endDate };
    }

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
  try {
    const reports = await Prescription.find({ is_analyzed: true })
      .populate({
        path: "patient",
        populate: { path: "user", select: "first_name last_name" },
      })
      .select("diagnosis created_at patient ai_analysis")
      .sort({ created_at: -1 })
      .limit(50);
      
    const result = reports.map(r => ({
        id: r._id,
        patient_name: r.patient?.user ? `${r.patient.user.first_name} ${r.patient.user.last_name}` : 'Unknown',
        diagnosis: r.diagnosis,
        risk_level: r.ai_analysis?.risk_level || 'unknown',
        date: r.created_at
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.analyzePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const rx = await Prescription.findById(id);
    if (!rx) return res.status(404).json({ error: "Prescription not found" });

    // Dynamic analysis based on medications
    let score = 5;
    let risk_level = "low";
    let summary = "Clear prescription. Standard treatment protocol observed.";
    let interactions = [];

    const meds = rx.medications || [];
    
    if (meds.length > 5) {
        score += 30;
        risk_level = "high";
        summary = "High medication load (polypharmacy). Monitor for adverse interactions.";
        interactions.push("Increased risk of adverse effects due to multiple concurrent medications.");
    } else if (meds.length > 3) {
        score += 15;
        risk_level = "medium";
        summary = "Moderate medication load. Monitor patient compliance.";
    }

    // Check for high dosages or specific keywords
    for (const med of meds) {
        const name = (med.name || "").toLowerCase();
        const dosage = (med.dosage || "").toLowerCase();
        
        if (name.includes("statin") && meds.some(m => m.name.toLowerCase().includes("antibiotic"))) {
            score += 20;
            interactions.push(`Potential interaction: ${med.name} with antibiotics. Monitor for muscle pain.`);
            risk_level = "high";
        }
        
        if (dosage.includes("500mg") || dosage.includes("1000mg")) {
            score += 10;
            if (risk_level === "low") risk_level = "medium";
            interactions.push(`High dosage detected for ${med.name} (${med.dosage}). Ensure renal function is adequate.`);
        }
    }

    const aiAnalysis = {
      risk_level,
      risk_score: Math.min(score, 100),
      summary,
      interactions,
    };

    const updatedRx = await Prescription.findByIdAndUpdate(
      id,
      { ai_analysis: aiAnalysis, is_analyzed: true },
      { new: true },
    );
    res.json(updatedRx);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
