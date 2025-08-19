const Product = require("../Model/ProductModel");

// ADD PRODUCT
const addProduct = async (req, res, next) => {
    const { product_id, product_name, price, description, created_by } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : ""; // <-- store path

    const newProduct = new Product({
        product_id: Number(product_id) || 0,
        product_name,
        price: Number(price) || 0,
        description,
        photo,
        created_by: Number(created_by) || 0
    });

    try {
        await newProduct.save();
        return res.status(201).json({ product: newProduct });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Validation error", error: err.message });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const { product_id, product_name, price, description, created_by } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

    let updateData = {
        product_id: Number(product_id) || 0,
        product_name,
        price: Number(price) || 0,
        description,
        created_by: Number(created_by) || 0
    };

    if (photo !== undefined) updateData.photo = photo;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: "Unable to update product" });
        return res.status(200).json({ product: updatedProduct });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Validation error", error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ products });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.addProduct = addProduct;
exports.getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateProduct = updateProduct;
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Unable to delete product" });
        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
