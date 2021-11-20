const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    businessId: String,
    inventory: [
      {
        name: String,
        desc: String,
        image: String,
        capital: Number,
        qty: Number,
        active: Boolean,
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

let Inventory =
  mongoose.models.inventory || mongoose.model("inventory", InventorySchema);

module.exports = Inventory;
