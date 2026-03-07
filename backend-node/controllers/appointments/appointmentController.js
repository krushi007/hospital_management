const Appointment = require('../../models/Appointment');
const DoctorProfile = require('../../models/DoctorProfile');

exports.getAppointments = async (req, res) => {
    try {
        const { status, date } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (date) filter.date = date;

        // Doctor: filter by their own profile
        if (req.user?.role && req.user.role.toLowerCase() === 'doctor') {
            const doctorProfile = await DoctorProfile.findOne({ user: req.user.user_id });
            if (!doctorProfile) return res.json([]);
            filter.doctor = doctorProfile._id;
        }

        const appointments = await Appointment.find(filter)
            .populate({ path: 'doctor', populate: { path: 'user', select: 'first_name last_name email' } })
            .populate({ path: 'patient', populate: { path: 'user', select: 'first_name last_name email' } })
            .sort({ date: -1, time_slot: -1 });

        const result = appointments.map(a => ({
            id: a._id,
            date: a.date,
            time_slot: a.time_slot,
            status: a.status,
            reason: a.reason,
            notes: a.notes,
            doctor_id: a.doctor?._id,
            doctor_name: a.doctor?.user ? `${a.doctor.user.first_name} ${a.doctor.user.last_name}` : '',
            patient_id: a.patient?._id || null,
            patient_name: a.patient?.user ? `${a.patient.user.first_name} ${a.patient.user.last_name}` : (a.manual_patient_name || ''),
            manual_patient_name: a.manual_patient_name,
            created_at: a.created_at,
        }));
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const { patient, manual_patient_name, doctor, date, time_slot, reason } = req.body;
        const appt = await Appointment.create({
            doctor,
            patient: patient || null,
            manual_patient_name: manual_patient_name || null,
            date,
            time_slot,
            reason: reason || '',
            created_by: req.user?.user_id || null,
        });
        res.status(201).json({ id: appt._id, message: 'Appointment created successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Appointment.findByIdAndUpdate(id, { status });
        res.json({ message: 'Status updated' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
