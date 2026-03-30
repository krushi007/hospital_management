const Invoice = require('../../models/Invoice');
const PatientProfile = require('../../models/PatientProfile');

const toResult = (i) => ({
    id: i._id,
    invoice_number: i.invoice_number,
    patient_name: i.patient?.user
        ? `${i.patient.user.first_name} ${i.patient.user.last_name}`
        : '',
    patient_id: i.patient?._id,
    phone: i.patient?.user?.phone,
    email: i.patient?.user?.email,
    items: i.items,
    subtotal: i.subtotal,
    tax_percent: i.tax_percent,
    tax_amount: i.tax_amount,
    discount: i.discount,
    total_amount: i.total_amount,
    paid_amount: i.paid_amount,
    payments: i.payments || [],
    status: i.status,
    notes: i.notes,
    due_date: i.due_date,
    bill_type: i.bill_type,
    created_at: i.created_at,
});

const populate = { path: 'patient', populate: { path: 'user', select: 'first_name last_name phone email' } };

exports.getInvoices = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        // Patient: filter by their own profile
        if (req.user?.role && req.user.role.toLowerCase() === "patient") {
            const patientProfile = await PatientProfile.findOne({
                user: req.user.user_id,
            });
            if (!patientProfile) return res.json([]);
            filter.patient = patientProfile._id;
        }

        const invoices = await Invoice.find(filter)
            .populate(populate)
            .sort({ created_at: -1 });
        res.json(invoices.map(toResult));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const inv = await Invoice.findById(req.params.id).populate(populate);
        if (!inv) return res.status(404).json({ error: 'Invoice not found' });
        res.json(toResult(inv));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getPayments = async (req, res) => {
    try {
        const paidInvoices = await Invoice.find({ paid_amount: { $gt: 0 } })
            .populate(populate)
            .select('invoice_number total_amount paid_amount status updated_at patient')
            .sort({ updated_at: -1 })
            .limit(50);
        const result = paidInvoices.map(i => ({
            id: i._id,
            invoice_number: i.invoice_number,
            amount: i.paid_amount,
            status: i.status,
            date: i.updated_at,
            patient_name: i.patient?.user
                ? `${i.patient.user.first_name} ${i.patient.user.last_name}`
                : 'Unknown'
        }));
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createInvoice = async (req, res) => {
    try {
        const { patient, items, discount, tax_percent, notes, bill_type, due_date } = req.body;
        const itemList = (items || []).map(it => ({
            description: it.description,
            quantity: it.quantity || 1,
            unit_price: it.unit_price || 0,
            total: (it.quantity || 1) * (it.unit_price || 0),
        }));
        const subtotal = itemList.reduce((s, it) => s + it.total, 0);
        const taxAmt = ((tax_percent || 0) / 100) * subtotal;
        const total_amount = subtotal + taxAmt - (discount || 0);

        const inv = await Invoice.create({
            patient,
            items: itemList,
            subtotal,
            tax_percent: tax_percent || 0,
            tax_amount: taxAmt,
            discount: discount || 0,
            total_amount,
            paid_amount: 0,
            status: 'unpaid',
            notes: notes || '',
            bill_type: bill_type || 'general',
            due_date: due_date || null,
            created_by: req.user?.user_id,
        });
        res.status(201).json({ id: inv._id, invoice_number: inv.invoice_number, message: 'Invoice created' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.addPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, method, transaction_id } = req.body;
        const inv = await Invoice.findById(id);
        if (!inv) return res.status(404).json({ error: 'Invoice not found' });

        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }

        const remaining = inv.total_amount - inv.paid_amount;
        if (paymentAmount > remaining + 0.01) {
            return res.status(400).json({
                error: `Payment exceeds remaining amount. Only ₹${remaining.toFixed(2)} remaining.`
            });
        }

        inv.payments.push({
            amount: paymentAmount,
            method: method || 'cash',
            transaction_id: transaction_id || '',
            date: new Date(),
        });
        inv.paid_amount += paymentAmount;
        inv.status = inv.paid_amount >= inv.total_amount ? 'paid' : 'partial';
        await inv.save();

        // Return updated invoice
        const updated = await Invoice.findById(id).populate(populate);
        res.status(201).json(toResult(updated));
    } catch (e) { res.status(500).json({ error: e.message }); }
};
