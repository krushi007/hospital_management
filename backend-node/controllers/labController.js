const LabTest = require("../models/LabTest");
const DoctorProfile = require("../models/DoctorProfile");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const PatientProfile = require("../models/PatientProfile");
const { createNotification } = require("./notificationController");

exports.getLabTests = async (req, res) => {
  try {
    const { status, patientId } = req.query;
    let query = {};
    if (status) query.status = status;
    if (patientId) query.patient = patientId;

    if (req.user && req.user.role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user.user_id });
      if (doctorProfile) {
        const [apptPatientIds, rxPatientIds] = await Promise.all([
          Appointment.find({ doctor: doctorProfile._id, patient: { $ne: null } }).distinct("patient"),
          Prescription.find({ doctor: doctorProfile._id }).distinct("patient"),
        ]);
        
        const allIds = [...new Set([
          ...apptPatientIds.map(id => id.toString()),
          ...rxPatientIds.map(id => id.toString()),
        ])];

        if (allIds.length > 0) {
          query.$or = [
            { doctor: doctorProfile._id }, 
            { doctor: null, patient: { $in: allIds } }, // Backward compatibility: show old tests that didn't have a doctor assigned, if it's for their patient
            { requested_by: req.user.user_id }
          ];
        } else {
          query.$or = [
            { doctor: doctorProfile._id },
            { requested_by: req.user.user_id }
          ];
        }
      } else {
        query.requested_by = req.user.user_id; // fallback if no profile exists
      }
    }

    if (req.user && req.user.role === "patient") {
      const patientProfile = await PatientProfile.findOne({ user: req.user.user_id });
      if (!patientProfile) return res.json([]);
      query.patient = patientProfile._id;
    }

    const tests = await LabTest.find(query)
      .populate({ path: "patient", populate: { path: "user", select: "first_name last_name email avatar" } })
      .populate("requested_by", "first_name last_name")
      .sort({ created_at: -1 });

    const formatted = tests.map(t => ({
      id: t._id,
      patient_id: t.patient?._id,
      patient_name: t.patient?.user ? `${t.patient.user.first_name} ${t.patient.user.last_name}` : 'Unknown',
      patient_avatar: t.patient?.user?.avatar || '',
      doctor_name: t.requested_by ? `${t.requested_by.first_name} ${t.requested_by.last_name}` : 'Unknown',
      test_name: t.test_name,
      notes: t.notes,
      status: t.status,
      result_text: t.result_text,
      result_url: t.result_url,
      created_at: t.created_at,
      completed_at: t.completed_at
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};

exports.requestLabTest = async (req, res) => {
  try {
    const { patient_id, test_name, notes, doctor_id } = req.body;
    if (!patient_id || !test_name) {
      return res.status(400).json({ detail: "Patient ID and Test Name are required." });
    }

    let assigned_doctor = null;
    if (req.user.role === 'admin' || req.user.role === 'receptionist') {
      assigned_doctor = doctor_id || null;
    } else if (req.user.role === 'doctor') {
      const profile = await DoctorProfile.findOne({ user: req.user.user_id });
      assigned_doctor = profile ? profile._id : null;
    }

    const test = await LabTest.create({
      patient: patient_id,
      requested_by: req.user.user_id,
      doctor: assigned_doctor,
      test_name,
      notes: notes || ""
    });

    res.status(201).json({ message: "Lab test requested successfully", test });
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};

exports.updateLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, result_text, result_url } = req.body;

    const updateData = { status };
    if (result_text !== undefined) updateData.result_text = result_text;
    if (result_url !== undefined) updateData.result_url = result_url;
    if (status === 'completed') updateData.completed_at = new Date();

    const test = await LabTest.findByIdAndUpdate(id, updateData, { new: true });
    if (!test) return res.status(404).json({ detail: "Test not found." });

    // Notify the requesting doctor when result is uploaded
    if (status === 'completed' && test.requested_by) {
      await createNotification(
        test.requested_by,
        `Lab result for test "${test.test_name}" has been uploaded.`,
        'lab',
        '/labs'
      );
    }

    res.json({ message: "Lab test updated successfully", test });
  } catch (err) {
    res.status(500).json({ detail: err.message, error: err.message });
  }
};

exports.deleteLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    await LabTest.findByIdAndDelete(id);
    res.json({ message: "Lab test deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
