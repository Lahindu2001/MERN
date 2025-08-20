const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Defining the schema for the Product model
const ProductSchema = new mongoose.Schema({
  product_name: { type: String, required: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  photo: { type: String, maxlength: 255 },
  created_by: { type: Number, required: true, ref: "Users" }, // Reference to user who created
}, { timestamps: true });

// Add auto-incrementing product_id
ProductSchema.plugin(AutoIncrement, { inc_field: "product_id" });

module.exports = mongoose.model("Product", ProductSchema);