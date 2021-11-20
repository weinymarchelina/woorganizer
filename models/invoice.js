const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    businessId: String,
    invoice: [
      {
        customer: String,
        cashier: String,
        items: [
          {
            name: String,
            image: String,
            price: Number,
            capital: Number,
            qty: Number,
          },
        ],
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

let Inventory =
  mongoose.models.invoice || mongoose.model("invoice", InvoiceSchema);

module.exports = Inventory;
