const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    businessId: String,
    invoice: [
      {
        customer: String,
        cashier: String,
        total: Number,
        items: Array,
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

let Inventory =
  mongoose.models.invoice || mongoose.model("invoice", InvoiceSchema);

module.exports = Inventory;
