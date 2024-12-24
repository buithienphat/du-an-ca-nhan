const mongoose = require("mongoose");
const convertTimestamps = require("./format");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    original_price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

convertTimestamps(productSchema);

module.exports = mongoose.model("Product", productSchema);
