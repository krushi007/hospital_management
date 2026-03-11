const Department = require("../../models/Department");
const Room = require("../../models/Room");
const Admission = require("../../models/Admission");
const Appointment = require("../../models/Appointment");
const PDFDocument = require("pdfkit");

exports.getDepartments = async (req, res) => {
  try {
    const deps = await Department.find().sort({ name: 1 });
    res.json(
      deps.map((d) => ({
        id: d._id,
        name: d.name,
        description: d.description,
        is_active: d.is_active,
      })),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const dep = await Department.create({
      name,
      description: description || "",
    });
    res.status(201).json({ id: dep._id, message: "Department created" });
  } catch (e) {
    if (e.code === 11000)
      return res.status(400).json({ error: "Department name already exists" });
    res.status(500).json({ error: e.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    await Department.findByIdAndUpdate(id, { name, description, is_active });
    res.json({ message: "Department updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    let query = {};
    if (req.query.available === "true") {
      // Use $expr to compare two fields in the same document
      query = { $expr: { $lt: ["$occupied", "$capacity"] } };
    }
    if (req.query.type) {
      query.room_type = req.query.type;
    }
    const rooms = await Room.find(query)
      .populate("department", "name")
      .sort({ room_number: 1 });
    res.json(
      rooms.map((r) => ({
        id: r._id,
        room_number: r.room_number,
        room_type: r.room_type,
        capacity: r.capacity,
        occupied: r.occupied,
        rate_per_day: r.rate_per_day,
        is_active: r.is_active,
        department_name: r.department?.name || "",
      })),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAdmissions = async (req, res) => {
  try {
    const { admit_date, status } = req.query;

    let query = {};
    if (admit_date) {
      const startOfDay = new Date(admit_date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(admit_date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.admit_date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) {
      query.status = status;
    }

    const admissions = await Admission.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "first_name last_name" },
      })
      .populate({
        path: "room",
        select: "room_number room_type rate_per_day",
        populate: { path: "department", select: "name" },
      })
      .sort({ admit_date: -1 });
    const result = admissions.map((a) => {
      const end_date = a.discharge_date || new Date();
      const diffTime = Math.abs(end_date - new Date(a.admit_date));
      let total_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (total_days === 0) total_days = 1; // Minimum 1 day charge
      const rate_per_day = a.room?.rate_per_day || 0;
      const total_amount = total_days * rate_per_day;

      return {
        id: a._id,
        patient_name: a.patient?.user
          ? `${a.patient.user.first_name} ${a.patient.user.last_name}`
          : "",
        room_number: a.room?.room_number || "",
        room_type: a.room?.room_type || "",
        rate_per_day: rate_per_day,
        total_days: total_days,
        total_amount: total_amount,
        admit_date: a.admit_date,
        discharge_date: a.discharge_date,
        status: a.status,
        reason: a.reason,
        notes: a.notes,
      };
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createAdmission = async (req, res) => {
  try {
    const { patient, room, admit_date, reason, notes } = req.body;

    // Check room capacity before admitting
    const roomRecord = await Room.findById(room);
    if (!roomRecord) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (roomRecord.occupied >= roomRecord.capacity) {
      return res.status(400).json({ error: "Room is currently full" });
    }

    // Check if patient has an active or recently completed appointment
    const activeAppointment = await Appointment.findOne({
      patient: patient,
      status: { $in: ["booked", "confirmed", "in_progress", "completed"] },
    });

    if (!activeAppointment) {
      return res.status(400).json({
        error: "Patient must have an active appointment to be admitted",
      });
    }

    const admission = await Admission.create({
      patient,
      room,
      admit_date,
      reason: reason || "",
      notes: notes || "",
    });
    // Mark room as occupied
    await Room.findByIdAndUpdate(room, { $inc: { occupied: 1 } });

    // Clear the pending admission request flag on the appointment if it exists
    await Appointment.findByIdAndUpdate(activeAppointment._id, {
      admission_requested: false,
    });

    res
      .status(201)
      .json({ id: admission._id, message: "Patient admitted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.dischargeAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findByIdAndUpdate(
      id,
      { status: "discharged", discharge_date: new Date() },
      { new: true },
    );
    if (!admission)
      return res.status(404).json({ error: "Admission not found" });
    await Room.findByIdAndUpdate(admission.room, { $inc: { occupied: -1 } });
    res.json({ message: "Patient discharged successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.downloadBill = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id)
      .populate({ path: "patient", populate: { path: "user" } })
      .populate({ path: "room", populate: { path: "department" } });

    if (!admission)
      return res.status(404).json({ error: "Admission not found" });

    // Extract Data safely
    const user = admission.patient?.user;
    const patientName = user
      ? `${user.first_name} ${user.last_name}`
      : "Unknown Patient";
    const patientEmail = user?.email || "N/A";
    const patientPhone = user?.phone || "N/A";
    const patientAddress = admission.patient?.address || "N/A";
    const bloodGroup = admission.patient?.blood_group || "N/A";

    const room = admission.room;
    const roomNumber = room ? room.room_number : "Unknown Room";
    const roomType = room ? room.room_type : "—";
    const departmentName = room?.department ? room.department.name : "—";
    const ratePerDay = room ? parseFloat(room.rate_per_day) || 0 : 0;

    // Calculate total days
    const admitDate = new Date(admission.admit_date);
    const currentDate = admission.discharge_date
      ? new Date(admission.discharge_date)
      : new Date();
    const diffTime = Math.abs(currentDate - admitDate);
    let totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (totalDays === 0) totalDays = 1;
    const totalAmount = totalDays * ratePerDay;

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set response headers
    const filename = `Invoice_${patientName.replace(/\\s+/g, "_")}_${id.substring(0, 5)}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // ================= HEADER =================
    doc
      .fillColor("#0f172a")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("MedCore HMS", { align: "left" });
    doc
      .fillColor("#3b82f6")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("PREMIUM HOSPITAL MANAGEMENT", { align: "left" });

    // Hospital Details (Top Right)
    doc
      .fillColor("#64748b")
      .fontSize(10)
      .font("Helvetica")
      .text("123 Health Avenue, Medical District", 400, 50, { align: "right" });
    doc.text("New Delhi, India 110001", { align: "right" });
    doc.text("Phone: +91 98765 43210", { align: "right" });
    doc.text("Email: billing@medcore.com", { align: "right" });
    doc.text("www.medcore-hms.com", { align: "right" });

    // Divider
    doc.moveDown(2);
    doc
      .moveTo(50, 130)
      .lineTo(545, 130)
      .lineWidth(1)
      .strokeColor("#e2e8f0")
      .stroke();
    doc.moveDown(2);

    // ================= INVOICE INFO =================
    doc.y = 150;
    doc
      .fillColor("#0f172a")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("HOSPITAL BILL / INVOICE");

    doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold");
    doc
      .text(`Invoice Number: `, 50, 185, { continued: true })
      .font("Helvetica")
      .text(`INV-${id.substring(id.length - 6).toUpperCase()}`);
    doc
      .font("Helvetica-Bold")
      .text(`Date Generated: `, { continued: true })
      .font("Helvetica")
      .text(`${new Date().toLocaleDateString()}`);

    doc.moveDown(1.5);

    // ================= PATIENT DETAILS =================
    const startY = doc.y;

    // Left side box (Patient details)
    doc.rect(50, startY, 230, 110).fillColor("#f8fafc").fill();
    doc
      .fillColor("#0f172a")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bill To (Patient):", 60, startY + 10);
    doc
      .fillColor("#334155")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`${patientName}`, 60, startY + 30);
    doc.font("Helvetica").text(`Phone: ${patientPhone}`, 60, startY + 45);
    doc.text(`Email: ${patientEmail}`, 60, startY + 60);
    doc.text(`Blood Group: ${bloodGroup}`, 60, startY + 75);
    // Wrap address
    doc.text(
      `Address: ${patientAddress.substring(0, 40)}${patientAddress.length > 40 ? "..." : ""}`,
      60,
      startY + 90,
    );

    // Right side box (Admission details)
    doc.rect(315, startY, 230, 110).fillColor("#f8fafc").fill();
    doc
      .fillColor("#0f172a")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Admission Summary:", 325, startY + 10);
    doc
      .fillColor("#334155")
      .fontSize(10)
      .font("Helvetica")
      .text(`Admitted On: `, 325, startY + 30, { continued: true })
      .font("Helvetica-Bold")
      .text(`${admitDate.toLocaleDateString()}`);
    doc
      .font("Helvetica")
      .text(`Discharged On: `, 325, startY + 45, { continued: true })
      .font("Helvetica-Bold")
      .text(
        `${admission.discharge_date ? new Date(admission.discharge_date).toLocaleDateString() : "Present"}`,
      );
    doc
      .font("Helvetica")
      .text(`Status: `, 325, startY + 60, { continued: true })
      .font("Helvetica-Bold")
      .text(`${admission.status.toUpperCase()}`);
    doc
      .font("Helvetica")
      .text(`Department: `, 325, startY + 75, { continued: true })
      .font("Helvetica-Bold")
      .text(`${departmentName}`);
    doc
      .font("Helvetica")
      .text(`Room: `, 325, startY + 90, { continued: true })
      .font("Helvetica-Bold")
      .text(`${roomNumber} (${roomType})`);

    doc.y = startY + 140;

    // ================= BREAKDOWN TABLE =================
    // Table Header
    doc.rect(50, doc.y, 495, 25).fillColor("#0f172a").fill();
    doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");
    doc.text("Description", 60, doc.y + 8);
    doc.text("Rate (/Day)", 250, doc.y + 8, { width: 90, align: "right" });
    doc.text("Qty (Days)", 350, doc.y + 8, { width: 80, align: "center" });
    doc.text("Amount (Rs.)", 440, doc.y + 8, { width: 90, align: "right" });

    // Table Row
    const rowY = doc.y + 25;
    doc.rect(50, rowY, 495, 30).fillColor("#f1f5f9").fill();
    doc.fillColor("#334155").fontSize(10).font("Helvetica");
    doc.text(`Room Charges (${roomType})`, 60, rowY + 10);
    doc.text(`₹ ${ratePerDay.toLocaleString()}`, 250, rowY + 10, {
      width: 90,
      align: "right",
    });
    doc.text(`${totalDays}`, 350, rowY + 10, { width: 80, align: "center" });
    doc.text(`₹ ${totalAmount.toLocaleString()}`, 440, rowY + 10, {
      width: 90,
      align: "right",
    });

    // Table Total
    const totalY = doc.y + 35;
    doc
      .moveTo(50, totalY)
      .lineTo(545, totalY)
      .lineWidth(2)
      .strokeColor("#0f172a")
      .stroke();
    doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold");
    doc.text("TOTAL DUE:", 250, totalY + 15, { width: 180, align: "right" });
    doc
      .fillColor("#3b82f6")
      .text(`₹ ${totalAmount.toLocaleString()}`, 440, totalY + 15, {
        width: 90,
        align: "right",
      });

    // ================= FOOTER =================
    doc
      .fillColor("#64748b")
      .fontSize(9)
      .font("Helvetica-Oblique")
      .text(
        "Thank you for trusting MedCore HMS with your healthcare needs.",
        50,
        700,
        { align: "center" },
      );
    doc.text(
      "This is an electronically generated invoice and does not require a physical signature.",
      { align: "center" },
    );

    doc.end();
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: e.message });
    }
  }
};
