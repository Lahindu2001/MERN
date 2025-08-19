const mongoose = require("mongoose");

// Defining the schema for the Product model to structure product data
const ProductSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, unique: true }, // Storing unique product identifier
  product_name: { type: String, required: true, maxlength: 100 }, // Storing product name with a max length of 100
  price: { type: Number, required: true, min: 0 }, // Storing product price with a minimum value of 0
  description: { type: String }, // Storing detailed description of the product
  photo: { type: String, maxlength: 255 }, // Storing path to product image with a max length of 255
  created_by: { type: Number, required: true, ref: "Users" }, // Referencing the user who created the product
});

module.exports = mongoose.model("Product", ProductSchema);