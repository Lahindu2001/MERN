const express = require("express");
router = express.Router();

// Insert Model
const Product = require("../Model/ProductModel");

// Import Package Controller
const ProductController = require("../Controlers/PakageController");

// Routes
router.get("/", ProductController.getAllProducts);       // Get all products
router.post("/", ProductController.addProduct);          // Add product
router.get("/:id", ProductController.getById);           // Get product by ID
router.put("/:id", ProductController.updateProduct);     // Update product
router.delete("/:id", ProductController.deleteProduct);  // Delete product

// Export
module.exports = router;