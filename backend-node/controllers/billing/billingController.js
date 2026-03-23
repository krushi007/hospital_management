const Invoice = require('../../models/Invoice');

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({ path: 'patient', populate: { path: 'user', select: 'first_name last_name phone email' } })
            .sort({ created_at: -1 });
        const result = invoices.map(i => ({
            id: i._id, invoice_number: i.invoice_number,
            patient_name: i.patient?.user ? `${i.patient.user.first_name} ${i.patient.user.last_name}` : '',
            phone: i.patient?.user?.phone, email: i.patient?.user?.email,
            items: i.items, subtotal: i.subtotal, tax_percent: i.tax_percent,
            tax_amount: i.tax_amount, discount: i.discount, total_amount: i.total_amount,
            paid_amount: i.paid_amount, status: i.status, notes: i.notes,
            due_date: i.due_date, bill_type: i.bill_type, created_at: i.created_at,
        }));
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getPayments = async (req, res) => { 
    try {
        const paidInvoices = await Invoice.find({ paid_amount: { $gt: 0 } })
            .populate({ path: 'patient', populate: { path: 'user', select: 'first_name last_name' } })
            .select('invoice_number total_amount paid_amount status updated_at patient')
            .sort({ updated_at: -1 })
            .limit(50);
        
        const result = paidInvoices.map(i => ({
            id: i._id,
            invoice_number: i.invoice_number,
            amount: i.paid_amount,
            status: i.status,
            date: i.updated_at,
            patient_name: i.patient?.user ? `${i.patient.user.first_name} ${i.patient.user.last_name}` : 'Unknown'
        }));
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const { patient, items, total_amount, discount, tax_percent, status, notes, bill_type } = req.body;
        const subtotal = (items || []).reduce((s, i) => s + (i.total || 0), 0);
        const taxAmt = ((tax_percent || 0) / 100) * subtotal;
        const inv = await Invoice.create({
            patient, items: items || [],
            subtotal, tax_percent: tax_percent || 0, tax_amount: taxAmt,
            discount: discount || 0,
            total_amount: total_amount || (subtotal + taxAmt - (discount || 0)),
            paid_amount: 0, status: status || 'unpaid',
            notes: notes || '', bill_type: bill_type || 'general',
            created_by: req.user?.user_id,
        });
        res.status(201).json({ id: inv._id, invoice_number: inv.invoice_number, message: 'Invoice created' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

    exports.addPayment = async (req, res) => {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const inv = await Invoice.findById(id);
            if (!inv) return res.status(404).json({ error: 'Invoice not found' });
            
            const paymentAmount = parseFloat(amount);
            if (isNaN(paymentAmount) || paymentAmount <= 0) {
                return res.status(400).json({ error: 'Invalid payment amount' });
            }
            
            const remainingAmount = inv.total_amount - inv.paid_amount;
            if (paymentAmount > remainingAmount) {
                return res.status(400).json({ 
                    error: `Payment exceeds remaining amount due. Only ${remainingAmount.toFixed(2)} remaining.` 
                });
            }
            
            inv.paid_amount += paymentAmount;
            inv.status = inv.paid_amount >= inv.total_amount ? 'paid' : 'partial';
            await inv.save();
            res.status(201).json({ message: 'Payment added' });
        } catch (e) { res.status(500).json({ error: e.message }); }
    };
