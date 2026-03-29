import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceOrder {
  order_number: string;
  created_at: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  shipping_address?: string | null;
  notes?: string | null;
  customers?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    zip?: string | null;
    country?: string | null;
  } | null;
  order_items?: {
    product_name: string;
    variant_label?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

export const generateInvoice = (order: InvoiceOrder, currencySymbol: string = "৳") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primary = [30, 41, 59]; // slate-800
  const accent = [59, 130, 246]; // blue-500
  const muted = [100, 116, 139]; // slate-500

  // Header bar
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Store name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("T-Shirt Kella", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Fashion & Apparel Store", 14, 28);

  // Invoice title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 14, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#${order.order_number}`, pageWidth - 14, 28, { align: "right" });

  // Reset text color
  doc.setTextColor(primary[0], primary[1], primary[2]);

  // Order info row
  let y = 52;
  doc.setFontSize(9);
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.text("Date:", 14, y);
  doc.text("Status:", 80, y);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), 30, y);
  doc.text(order.status.charAt(0).toUpperCase() + order.status.slice(1), 100, y);
  doc.setFont("helvetica", "normal");

  // Divider
  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, pageWidth - 14, y);

  // Bill To section
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text("Bill To", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(primary[0], primary[1], primary[2]);

  y += 7;
  doc.setFontSize(9);
  const cust = order.customers;
  if (cust) {
    const name = [cust.first_name, cust.last_name].filter(Boolean).join(" ");
    if (name) { doc.text(name, 14, y); y += 5; }
    if (cust.email) { doc.text(cust.email, 14, y); y += 5; }
    if (cust.phone) { doc.text(cust.phone, 14, y); y += 5; }
    const addr = [cust.address_line1, cust.address_line2, cust.city, cust.state, cust.zip, cust.country].filter(Boolean).join(", ");
    if (addr) { doc.text(addr, 14, y); y += 5; }
  } else {
    doc.text("Guest Customer", 14, y); y += 5;
  }

  if (order.shipping_address) {
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("Ship To", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(primary[0], primary[1], primary[2]);
    y += 6;
    doc.text(order.shipping_address, 14, y);
    y += 5;
  }

  // Items table
  y += 6;
  const items = order.order_items ?? [];
  const tableBody = items.map((item, i) => [
    (i + 1).toString(),
    item.product_name + (item.variant_label ? ` (${item.variant_label})` : ""),
    item.quantity.toString(),
    `${currencySymbol}${Number(item.unit_price).toFixed(2)}`,
    `${currencySymbol}${Number(item.total_price).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["#", "Item", "Qty", "Unit Price", "Total"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [accent[0], accent[1], accent[2]],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      2: { cellWidth: 18, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = pageWidth - 80;

  const drawSummaryLine = (label: string, value: string, yPos: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 9);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.text(label, summaryX, yPos);
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.text(value, pageWidth - 14, yPos, { align: "right" });
  };

  let sy = finalY;
  drawSummaryLine("Subtotal", `${currencySymbol}${Number(order.subtotal).toFixed(2)}`, sy);
  sy += 6;
  drawSummaryLine("Tax", `${currencySymbol}${Number(order.tax).toFixed(2)}`, sy);
  sy += 6;
  drawSummaryLine("Shipping", `${currencySymbol}${Number(order.shipping_cost).toFixed(2)}`, sy);
  sy += 3;
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.line(summaryX, sy, pageWidth - 14, sy);
  sy += 7;
  drawSummaryLine("Total", `${currencySymbol}${Number(order.total).toFixed(2)}`, sy, true);

  // Notes
  if (order.notes) {
    sy += 14;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("Notes", 14, sy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(muted[0], muted[1], muted[2]);
    sy += 6;
    doc.text(order.notes, 14, sy);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.text("T-Shirt Kella • Thank you for your business!", pageWidth / 2, footerY, { align: "center" });

  // Download
  doc.save(`Invoice-${order.order_number}.pdf`);
};
