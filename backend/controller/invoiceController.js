const PDFDocument = require("pdfkit");
const Order = require("../model/orderModel");

const downloadInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order not found");

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(22).text("BOOK STORE INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Customer: ${order.customer}`);
  doc.text(`Email: ${order.email}`);
  doc.text(`Date: ${order.createdAt.toDateString()}`);
  doc.moveDown();

  order.products.forEach(p => {
    doc.text(`${p.name} x ${p.quantity} = $${p.total}`);
  });

  doc.moveDown();
  doc.fontSize(16).text(`TOTAL: $${order.totalAmount}`, { align: "right" });

  doc.end();
};

module.exports = { downloadInvoice };
