const Appointment = require('../../models/Appointment');
const PatientProfile = require('../../models/PatientProfile');
const DoctorProfile = require('../../models/DoctorProfile');
const Department = require('../../models/Department');
const Invoice = require('../../models/Invoice');
const Room = require('../../models/Room');
const Medicine = require('../../models/Medicine');
const PharmacyOrder = require('../../models/PharmacyOrder');


exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const [
            totalPatients, totalDoctors, totalDepartments, todayAppointments, 
            pendingAppointments, completedToday, lowStockCount, pendingOrdersCount
        ] = await Promise.all([
            PatientProfile.countDocuments(),
            DoctorProfile.countDocuments({ is_active: true }),
            Department.countDocuments(),
            Appointment.countDocuments({ date: today }),
            Appointment.countDocuments({ status: { $in: ['booked', 'confirmed'] } }),
            Appointment.countDocuments({ date: today, status: 'completed' }),
            Medicine.countDocuments({ stock_quantity: { $lte: 10 } }),
            PharmacyOrder.countDocuments({ status: 'pending' }),
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

        // Active Patients Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayNewPatients = await PatientProfile.countDocuments({ created_at: { $gte: startOfDay } });

        // Revenue Calculations
        const invoices = await Invoice.find({ created_at: { $gte: monthStart } });
        const monthlyRevenue = invoices.filter(i => i.status === 'paid' || i.status === 'partial')
                                       .reduce((sum, inv) => sum + inv.paid_amount, 0);
                                       
        const todayRevenue = invoices.filter(i => i.created_at >= startOfDay && (i.status === 'paid' || i.status === 'partial'))
                                     .reduce((sum, inv) => sum + inv.paid_amount, 0);
                                     
        const pendingInvoices = await Invoice.countDocuments({ status: { $in: ['unpaid', 'partial'] } });

        // ── NEW ANALYTICS DATA ───────────────────────────────────────────────
        
        // 1. Revenue Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const revInvoices = await Invoice.find({ 
            created_at: { $gte: sixMonthsAgo },
            status: { $in: ['paid', 'partial'] }
        });

        const revenue_trend = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const year = d.getFullYear();
            
            const monthTotal = revInvoices.filter(inv => {
                const invDate = new Date(inv.created_at);
                return invDate.getMonth() === d.getMonth() && invDate.getFullYear() === year;
            }).reduce((sum, inv) => sum + inv.paid_amount, 0);
            
            revenue_trend.push({ name: monthName, revenue: monthTotal });
        }

        // 2. Department Stats (Appointments per department)
        const deptStatsRaw = await Appointment.aggregate([
            { $match: { department: { $exists: true, $ne: null } } },
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        await Department.populate(deptStatsRaw, { path: "_id", select: "name" });
        const department_stats = deptStatsRaw.map(d => ({
            name: d._id ? d._id.name : 'Unknown',
            value: d.count
        }));

        // 3. Appointment Status Breakdown
        const apptStatsRaw = await Appointment.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const appointment_stats = apptStatsRaw.map(s => ({
            name: s._id.charAt(0).toUpperCase() + s._id.slice(1).replace('_', ' '),
            value: s.count
        }));

        // 4. Top 5 Doctors (by appointment count)
        const topDoctorsRaw = await Appointment.aggregate([
            { $group: { _id: "$doctor", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        await DoctorProfile.populate(topDoctorsRaw, { path: "_id", populate: { path: "user", select: "first_name last_name" } });
        const top_doctors = topDoctorsRaw.map(d => ({
            name: d._id?.user ? `Dr. ${d._id.user.first_name} ${d._id.user.last_name}` : 'Unknown',
            count: d.count
        }));

        // 5. Monthly Patient Trend (Last 6 months)
        const patient_trend = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const year = d.getFullYear();
            const mStart = new Date(year, d.getMonth(), 1);
            const mEnd = new Date(year, d.getMonth() + 1, 0, 23, 59, 59, 999);
            
            const count = await PatientProfile.countDocuments({
                created_at: { $gte: mStart, $lte: mEnd }
            });
            patient_trend.push({ name: monthName, count });
        }

        res.json({
            total_patients: totalPatients,
            total_doctors: totalDoctors,
            total_departments: totalDepartments,
            today_appointments: todayAppointments,
            today_new_patients: todayNewPatients,
            pending_appointments: pendingAppointments,
            completed_today: completedToday,
            monthly_revenue: monthlyRevenue,
            today_revenue: todayRevenue,
            occupancy_rate: parseFloat(occupancyRate),
            pending_invoices: pendingInvoices,
            recent_appointments: recentFormatted,
            weekly_trend: weeklyTrend,
            revenue_trend,
            department_stats,
            appointment_stats,
            top_doctors,
            patient_trend,
            low_stock_count: lowStockCount || 0,
            pending_orders_count: pendingOrdersCount || 0,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
