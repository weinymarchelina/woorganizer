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
    inventoryId: String,
    productId: String,
    invoiceId: String,
    targetId: String,
    cashId: String,
    activityId: String,
    postId: String,
  },
  { timestamps: true }
);

let Business =
  mongoose.models.businesses || mongoose.model("businesses", BusinessSchema);

module.exports = Business;
