const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Import Controller
const ProductController = require("../Controlers/PakageController");

// ------------------- MULTER CONFIG -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ------------------- ROUTES -------------------
router.get("/", ProductController.getAllProducts);
router.post("/", upload.single("photo"), ProductController.addProduct);
router.get("/:id", ProductController.getById);
router.put("/:id", upload.single("photo"), ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
