const Medicine = require("../../models/Medicine");
const PharmacyOrder = require("../../models/PharmacyOrder");
const Prescription = require("../../models/Prescription");

exports.getMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const medicines = await Medicine.find(filter).sort({ name: 1 });
    res.json(medicines);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const { name, generic_name, category, manufacturer, price, stock, unit } =
      req.body;

    // Check if medicine with this name already exists
    const existing = await Medicine.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Medicine with this name already exists" });
    }

    const medicine = await Medicine.create({
      name,
      generic_name: generic_name || "",
      category: category || "",
      manufacturer: manufacturer || "",
      price: price || 0,
      stock: stock || 0,
      unit: unit || "tablet",
    });

    res.status(201).json(medicine);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getPharmacyOrders = async (req, res) => {
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

    const orders = await PharmacyOrder.find(filter)
      .populate({
        path: "patient",
        populate: { path: "user", select: "first_name last_name" },
      })
      .populate({
        path: "prescription",
        populate: {
          path: "doctor",
          populate: { path: "user", select: "first_name last_name" },
        },
      })
      .sort({ created_at: -1 });

    const result = orders.map((o) => ({
      id: o._id,
      status: o.status,
      items: o.items,
      subtotal: o.subtotal,
      notes: o.notes,
      created_at: o.created_at,
      prescription: o.prescription?._id,
      patient_name: o.patient?.user
        ? `${o.patient.user.first_name} ${o.patient.user.last_name}`
        : "",
      doctor_name: o.prescription?.doctor?.user
        ? `${o.prescription.doctor.user.first_name} ${o.prescription.doctor.user.last_name}`
        : "",
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createPharmacyOrder = async (req, res) => {
  try {
    const { prescription_id } = req.body;
    const rx = await Prescription.findById(prescription_id);
    if (!rx) return res.status(404).json({ error: "Prescription not found" });

    const medNames = (rx.medications || []).map((m) => m.name).filter(Boolean);
    const medDocs = await Medicine.find({ name: { $in: medNames } });

    const items = (rx.medications || []).map((m) => {
      const med = medDocs.find((d) => d.name === m.name);
      return {
        medicine_name: m.name,
        dosage: m.dosage || "",
        frequency: m.frequency || "",
        duration: m.duration || "",
        quantity: 1,
        unit_price: med ? med.price : 0,
        total: med ? med.price : 0,
        in_stock: med ? med.stock > 0 : false,
        medicine_id: med ? med._id : null,
      };
    });

    const initialSubtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

    const order = await PharmacyOrder.create({
      prescription: prescription_id,
      patient: rx.patient,
      items,
      subtotal: initialSubtotal,
    });
    res.status(201).json({ id: order._id, message: "Pharmacy order created" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.dispenseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PharmacyOrder.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // ✅ Check live stock for every item before dispensing
    const outOfStock = [];
    for (const item of order.items) {
      const requestedQty = item.quantity || 1;
      let currentStock = 0;
      if (item.medicine_id) {
        const med = await Medicine.findById(item.medicine_id).select(
          "stock name",
        );
        currentStock = med?.stock ?? 0;
        if (currentStock < requestedQty)
          outOfStock.push(`${item.medicine_name || med?.name || "Unknown"} (Need ${requestedQty}, have ${currentStock})`);
      } else if (item.medicine_name) {
        const med = await Medicine.findOne({ name: item.medicine_name }).select(
          "stock",
        );
        currentStock = med?.stock ?? 0;
        if (currentStock < requestedQty) outOfStock.push(`${item.medicine_name} (Need ${requestedQty}, have ${currentStock})`);
      }
    }

    if (outOfStock.length > 0) {
      return res.status(400).json({
        error: `Cannot dispense — insufficient stock for: ${outOfStock.join(", ")}`,
      });
    }

    let subtotal = 0;
    for (const item of order.items) {
      const qty = item.quantity || 1;
      subtotal += qty * (item.unit_price || 0);
      if (item.medicine_id) {
        await Medicine.findByIdAndUpdate(item.medicine_id, {
          $inc: { stock: -qty },
        });
      } else if (item.medicine_name) {
        await Medicine.findOneAndUpdate(
          { name: item.medicine_name },
          { $inc: { stock: -qty } },
        );
      }
    }

    order.subtotal = subtotal;
    order.status = "dispensed";
    order.dispensed_by = req.user?.user_id || null;
    await order.save();
    res.json({ message: "Order dispensed", subtotal });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PharmacyOrder.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    await PharmacyOrder.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
