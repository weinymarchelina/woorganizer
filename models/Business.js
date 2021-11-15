const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    name: String,
    field: String,
    phone: Number,
    email: String,
    password: String,
    team: Array,
    image: {
      type: String,
      default: null,
    },
    inventory: Array,
    products: Array,
    invoice: Array,
    targets: Array,
    cash: Object,
    activities: Array,
  },
  { timestamps: true }
);

let Business =
  mongoose.models.businesses || mongoose.model("businesses", BusinessSchema);

module.exports = Business;
