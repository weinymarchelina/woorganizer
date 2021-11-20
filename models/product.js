const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    businessId: String,
    product: [
      {
        name: String,
        desc: String,
        image: String,
        price: Number,
        capital: Number,
        qty: Number,
        active: Boolean,
        material: Array,
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

let Inventory =
  mongoose.models.product || mongoose.model("product", ProductSchema);

module.exports = Inventory;
