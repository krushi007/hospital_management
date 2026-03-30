import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Brand Colors ────────────────────────────────────────────────────────────
const PRIMARY   = [14, 165, 233];   // sky-500
const DARK      = [15, 23, 42];     // slate-900
const MID       = [30, 41, 59];     // slate-800
const LIGHT_ROW = [241, 245, 249];  // slate-100
const WHITE     = [255, 255, 255];

// ─── Shared header / footer helpers ──────────────────────────────────────────
function drawHeader(doc, title, subtitle) {
  const W = doc.internal.pageSize.getWidth();

  // Colored banner
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 38, "F");

  // Hospital name
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MedCore HMS", 14, 16);

  // Title
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Hospital Management System", 14, 24);

  // Right-side title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, W - 14, 16, { align: "right" });

  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, W - 14, 24, { align: "right" });
  }

  // Generated date
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, W - 14, 32, { align: "right" });

  doc.setTextColor(...DARK);
}

function drawFooter(doc) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const pages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(...DARK);
    doc.rect(0, H - 14, W, 14, "F");

    doc.setTextColor(...WHITE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("MedCore HMS  |  Confidential Medical Record", 14, H - 5);
    doc.text(`Page ${i} of ${pages}`, W - 14, H - 5, { align: "right" });
  }
}

function sectionTitle(doc, label, y) {
  doc.setFillColor(...MID);
  doc.setDrawColor(...MID);
  doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 9, 2, 2, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(label, 18, y + 6.2);
  doc.setTextColor(...DARK);
  return y + 14;
}

function infoRow(doc, label, value, x, y, colW = 80) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text(label, x, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  doc.text(String(value || "—"), x + colW, y);
}

// ─── 1. PRESCRIPTION PDF ─────────────────────────────────────────────────────
export function generatePrescriptionPDF(prescription) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  drawHeader(doc, "PRESCRIPTION", `Ref #${prescription.id}`);

  let y = 48;

  // Patient & Doctor info block
  y = sectionTitle(doc, "Patient & Doctor Information", y);

  infoRow(doc, "Patient:", prescription.patient_name, 14, y);
  infoRow(doc, "Doctor:", prescription.doctor_name, W / 2, y);
  y += 7;

  infoRow(doc, "Date:", new Date(prescription.created_at).toLocaleDateString(), 14, y);
  infoRow(doc, "Diagnosis:", prescription.diagnosis?.substring(0, 50), W / 2, y);
  y += 7;

  if (prescription.notes) {
    infoRow(doc, "Notes:", prescription.notes, 14, y);
    y += 7;
  }

  y += 4;

  // Medications table
  if (prescription.medications?.length > 0) {
    y = sectionTitle(doc, "Prescribed Medications", y);

    autoTable(doc, {
      startY: y,
      head: [["#", "Medication", "Dosage", "Frequency", "Duration", "Instructions"]],
      body: prescription.medications.map((m, i) => [
        i + 1,
        m.name || "—",
        m.dosage || "—",
        m.frequency || "—",
        m.duration || "—",
        m.instructions || "—",
      ]),
      styles: { fontSize: 8.5, cellPadding: 3.5, textColor: DARK },
      headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
      alternateRowStyles: { fillColor: LIGHT_ROW },
      columnStyles: { 0: { cellWidth: 10 }, 5: { cellWidth: 38 } },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // AI Analysis (if present)
  if (prescription.ai_analysis && Object.keys(prescription.ai_analysis).length > 0) {
    const ai = prescription.ai_analysis;
    y = sectionTitle(doc, "AI Risk Analysis", y);

    // Risk badge
    const risk = (ai.risk_level || "unknown").toUpperCase();
    const riskColors = { LOW: [34, 197, 94], MEDIUM: [234, 179, 8], HIGH: [239, 68, 68], UNKNOWN: [100, 116, 139] };
    const riskColor = riskColors[risk] || riskColors.UNKNOWN;

    doc.setFillColor(...riskColor);
    doc.roundedRect(14, y, 40, 8, 2, 2, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Risk: ${risk}  (${ai.risk_score || 0}/100)`, 34, y + 5.5, { align: "center" });
    doc.setTextColor(...DARK);
    y += 12;

    if (ai.summary) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(ai.summary, W - 28);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 4;
    }

    if (ai.interactions?.length > 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("⚠ Drug Interactions:", 14, y);
      y += 6;

      ai.interactions.forEach((interaction) => {
        doc.setFont("helvetica", "bold");
        doc.text(`• ${(interaction.drugs || []).join(" ↔ ")}:`, 18, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(interaction.description || "", W - 36);
        doc.text(lines, 22, y);
        y += lines.length * 5 + 2;
      });
    }
  }

  drawFooter(doc);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

// ─── 2. INVOICE PDF ──────────────────────────────────────────────────────────
export function generateInvoicePDF(invoice) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  drawHeader(doc, "TAX INVOICE", invoice.invoice_number);

  let y = 48;

  // Invoice meta
  y = sectionTitle(doc, "Invoice Information", y);

  infoRow(doc, "Invoice #:", invoice.invoice_number, 14, y);
  infoRow(doc, "Date:", new Date(invoice.created_at).toLocaleDateString(), W / 2, y);
  y += 7;
  infoRow(doc, "Patient:", invoice.patient_name, 14, y);
  infoRow(doc, "Bill Type:", (invoice.bill_type || "general").toUpperCase(), W / 2, y);
  y += 7;
  const statusColors = { paid: [34, 197, 94], partial: [234, 179, 8], unpaid: [239, 68, 68], cancelled: [100, 116, 139] };
  const sc = statusColors[invoice.status] || [100, 116, 139];
  doc.setFillColor(...sc);
  doc.roundedRect(W / 2, y - 2, 32, 7, 2, 2, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.status.toUpperCase(), W / 2 + 16, y + 3.2, { align: "center" });
  doc.setTextColor(...DARK);
  y += 12;

  // Items table
  y = sectionTitle(doc, "Itemised Charges", y);

  autoTable(doc, {
    startY: y,
    head: [["#", "Description", "Qty", "Unit Price", "Total"]],
    body: (invoice.items || []).map((item, i) => [
      i + 1,
      item.description || "—",
      item.quantity,
      `Rs.${parseFloat(item.unit_price).toLocaleString()}`,
      `Rs.${parseFloat(item.total).toLocaleString()}`,
    ]),
    styles: { fontSize: 9, cellPadding: 3.5, textColor: DARK },
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_ROW },
    columnStyles: { 0: { cellWidth: 10 }, 3: { halign: "right" }, 4: { halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Totals summary (right-aligned box)
  const boxW = 90;
  const boxX = W - 14 - boxW;

  doc.setFillColor(...LIGHT_ROW);
  doc.roundedRect(boxX, y, boxW, 44, 3, 3, "F");

  const col1 = boxX + 6;
  const col2 = boxX + boxW - 6;
  const lineH = 7;
  let by = y + 8;

  const totRow = (label, val, bold = false, color = DARK) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.text(label, col1, by);
    doc.text(val, col2, by, { align: "right" });
    by += lineH;
  };

  totRow("Subtotal:", `Rs.${parseFloat(invoice.subtotal || 0).toLocaleString()}`);
  totRow(`Tax (${invoice.tax_percent || 0}%):`, `Rs.${parseFloat(invoice.tax_amount || 0).toLocaleString()}`);
  if (parseFloat(invoice.discount || 0) > 0) {
    totRow("Discount:", `-Rs.${parseFloat(invoice.discount).toLocaleString()}`, false, [34, 197, 94]);
  }

  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.4);
  doc.line(col1, by - 2, col2, by - 2);

  totRow("TOTAL:", `Rs.${parseFloat(invoice.total_amount || 0).toLocaleString()}`, true);
  totRow("Paid:", `Rs.${parseFloat(invoice.paid_amount || 0).toLocaleString()}`, false, [34, 197, 94]);
  totRow(
    "Balance Due:",
    `Rs.${(parseFloat(invoice.total_amount || 0) - parseFloat(invoice.paid_amount || 0)).toLocaleString()}`,
    true,
    [239, 68, 68],
  );

  // Payment history
  if (invoice.payments?.length > 0) {
    y = by + 8;
    y = sectionTitle(doc, "Payment History", y);

    autoTable(doc, {
      startY: y,
      head: [["Date", "Method", "Transaction ID", "Amount"]],
      body: invoice.payments.map((p) => [
        new Date(p.date).toLocaleDateString(),
        p.method,
        p.transaction_id || "—",
        `Rs.${parseFloat(p.amount).toLocaleString()}`,
      ]),
      styles: { fontSize: 8.5, cellPadding: 3, textColor: DARK },
      headStyles: { fillColor: MID, textColor: WHITE, fontStyle: "bold" },
      alternateRowStyles: { fillColor: LIGHT_ROW },
      columnStyles: { 3: { halign: "right" } },
      margin: { left: 14, right: 14 },
    });
  }

  // Notes
  if (invoice.notes) {
    const ny = (invoice.payments?.length > 0 ? doc.lastAutoTable.finalY : by) + 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", 14, ny);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(invoice.notes, W - 28);
    doc.text(lines, 14, ny + 6);
  }

  drawFooter(doc);

  const blob = doc.output("blob");
  window.open(URL.createObjectURL(blob), "_blank");
}

// ─── 3. LAB REPORT PDF ───────────────────────────────────────────────────────
export function generateLabReportPDF(lab) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  drawHeader(doc, "LAB REPORT", `Test ID: ${lab.id}`);

  let y = 48;

  y = sectionTitle(doc, "Test Information", y);

  infoRow(doc, "Patient:", lab.patient_name, 14, y);
  infoRow(doc, "Ordered By:", lab.doctor_name, W / 2, y);
  y += 7;
  infoRow(doc, "Test Name:", lab.test_name, 14, y);
  infoRow(doc, "Status:", lab.status?.toUpperCase(), W / 2, y);
  y += 7;
  infoRow(doc, "Requested:", new Date(lab.created_at).toLocaleDateString(), 14, y);
  if (lab.completed_at) {
    infoRow(doc, "Completed:", new Date(lab.completed_at).toLocaleDateString(), W / 2, y);
  }
  y += 10;

  if (lab.notes) {
    y = sectionTitle(doc, "Doctor Notes", y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(lab.notes, W - 28);
    doc.text(lines, 14, y);
    y += lines.length * 5.5 + 8;
  }

  y = sectionTitle(doc, "Test Result", y);

  if (lab.result_text) {
    // Result in a nice box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, y, W - 28, 28, 3, 3, "FD");

    doc.setTextColor(21, 128, 61);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Result:", 18, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(lab.result_text, W - 40);
    doc.text(lines, 18, y + 15);
    y += 36;
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("No result text recorded.", 14, y + 6);
    y += 14;
  }

  if (lab.result_url) {
    y += 4;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text("Attachment URL:", 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(lab.result_url, W - 28);
    doc.text(lines, 14, y + 6);
  }

  // Disclaimer
  const H = doc.internal.pageSize.getHeight();
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text(
    "This report is generated by MedCore HMS and is for informational purposes only. Please consult your physician for medical advice.",
    14,
    H - 20,
    { maxWidth: W - 28 },
  );

  drawFooter(doc);

  const blob = doc.output("blob");
  window.open(URL.createObjectURL(blob), "_blank");
}
