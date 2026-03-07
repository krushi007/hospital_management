const Appointment = require('../../models/Appointment');
const PatientProfile = require('../../models/PatientProfile');
const DoctorProfile = require('../../models/DoctorProfile');
const Department = require('../../models/Department');
const Invoice = require('../../models/Invoice');
const Room = require('../../models/Room');

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const [totalPatients, totalDoctors, totalDepartments, todayAppointments, pendingAppointments, completedToday] = await Promise.all([
            PatientProfile.countDocuments(),
            DoctorProfile.countDocuments({ is_active: true }),
            Department.countDocuments(),
            Appointment.countDocuments({ date: today }),
            Appointment.countDocuments({ status: { $in: ['booked', 'confirmed'] } }),
            Appointment.countDocuments({ date: today, status: 'completed' }),
        ]);

        // Recent appointments
        const recentAppts = await Appointment.find({ date: { $gte: today } })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'first_name last_name' } })
            .populate({ path: 'patient', populate: { path: 'user', select: 'first_name last_name' } })
            .sort({ date: 1, time_slot: 1 })
            .limit(5);

        const recentFormatted = recentAppts.map(a => ({
            id: a._id,
            patient: a.patient?.user ? `${a.patient.user.first_name} ${a.patient.user.last_name}` : (a.manual_patient_name || 'Unknown'),
            doctor: a.doctor?.user ? `Dr. ${a.doctor.user.first_name} ${a.doctor.user.last_name}` : '',
            date: a.date,
            time: a.time_slot,
            status: a.status,
        }));

        // Weekly trend
        const weeklyTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = await Appointment.countDocuments({ date: dateStr });
            weeklyTrend.push({ date: dateStr, count });
        }

        // Room occupancy
        const rooms = await Room.find();
        const totalCap = rooms.reduce((s, r) => s + r.capacity, 0);
        const totalOcc = rooms.reduce((s, r) => s + r.occupied, 0);
        const occupancyRate = totalCap > 0 ? ((totalOcc / totalCap) * 100).toFixed(1) : 0;

        res.json({
            total_patients: totalPatients,
            total_doctors: totalDoctors,
            total_departments: totalDepartments,
            today_appointments: todayAppointments,
            today_new_patients: 0,
            pending_appointments: pendingAppointments,
            completed_today: completedToday,
            monthly_revenue: 0,
            today_revenue: 0,
            occupancy_rate: parseFloat(occupancyRate),
            pending_invoices: 0,
            recent_appointments: recentFormatted,
            weekly_trend: weeklyTrend,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
