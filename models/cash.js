const mongoose = require("mongoose");

const CashSchema = new mongoose.Schema(
  {
    businessId: String,
    balance: Number,
    expenses: [
      {
        desc: String,
        cost: Number,
        addedBy: String,
      },
      { timestamps: true },
    ],
    income: [
      {
        desc: String,
        value: Number,
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

let Inventory = mongoose.models.cash || mongoose.model("cash", CashSchema);

module.exports = Inventory;
