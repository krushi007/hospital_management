const Department = require('../../models/Department');
const Room = require('../../models/Room');
const Admission = require('../../models/Admission');

exports.getDepartments = async (req, res) => {
    try {
        const deps = await Department.find().sort({ name: 1 });
        res.json(deps.map(d => ({ id: d._id, name: d.name, description: d.description, is_active: d.is_active })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const dep = await Department.create({ name, description: description || '' });
        res.status(201).json({ id: dep._id, message: 'Department created' });
    } catch (e) {
        if (e.code === 11000) return res.status(400).json({ error: 'Department name already exists' });
        res.status(500).json({ error: e.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, is_active } = req.body;
        await Department.findByIdAndUpdate(id, { name, description, is_active });
        res.json({ message: 'Department updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('department', 'name').sort({ room_number: 1 });
        res.json(rooms.map(r => ({ id: r._id, room_number: r.room_number, room_type: r.room_type, capacity: r.capacity, occupied: r.occupied, rate_per_day: r.rate_per_day, is_active: r.is_active, department_name: r.department?.name || '' })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find()
            .populate({ path: 'patient', populate: { path: 'user', select: 'first_name last_name' } })
            .populate('room', 'room_number room_type')
            .sort({ admit_date: -1 });
        const result = admissions.map(a => ({
            id: a._id,
            patient_name: a.patient?.user ? `${a.patient.user.first_name} ${a.patient.user.last_name}` : '',
            room_number: a.room?.room_number || '',
            room_type: a.room?.room_type || '',
            admit_date: a.admit_date,
            discharge_date: a.discharge_date,
            status: a.status,
            reason: a.reason,
            notes: a.notes,
        }));
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createAdmission = async (req, res) => {
    try {
        const { patient, room, admit_date, reason, notes } = req.body;
        const admission = await Admission.create({ patient, room, admit_date, reason: reason || '', notes: notes || '' });
        // Mark room as occupied
        await Room.findByIdAndUpdate(room, { $inc: { occupied: 1 } });
        res.status(201).json({ id: admission._id, message: 'Patient admitted successfully' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.dischargeAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        const admission = await Admission.findByIdAndUpdate(id, { status: 'discharged', discharge_date: new Date() }, { new: true });
        if (!admission) return res.status(404).json({ error: 'Admission not found' });
        await Room.findByIdAndUpdate(admission.room, { $inc: { occupied: -1 } });
        res.json({ message: 'Patient discharged successfully' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
