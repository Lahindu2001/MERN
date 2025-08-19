const Product = require("../Model/ProductModel");

// ------------------- GET ALL PRODUCTS -------------------
const getAllProducts = async (req, res, next) => {
    let products;
    try {
        products = await Product.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while fetching products" });
    }

    if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ products });
};

// ------------------- ADD PRODUCT -------------------
const addProduct = async (req, res, next) => {
    // Extracting product details from the request body
    const { product_id, product_name, price, description, photo, created_by } = req.body;

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
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Validation error", error: err.message });
    }

    return res.status(201).json({ product: newProduct });
};

// ------------------- GET PRODUCT BY ID -------------------
const getById = async (req, res, next) => {
    const id = req.params.id;
    let product;

    try {
        product = await Product.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while fetching product" });
    }

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
};

// ------------------- UPDATE PRODUCT -------------------
const updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const { product_id, product_name, price, description, photo, created_by } = req.body;

    let updatedProduct;

    try {
        updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                product_id: Number(product_id) || 0,
                product_name,
                price: Number(price) || 0,
                description,
                photo,
                created_by: Number(created_by) || 0
            },
            { new: true, runValidators: true } // Return updated product and enforce schema validation
        );
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Validation error", error: err.message });
    }

    if (!updatedProduct) {
        return res.status(404).json({ message: "Unable to update product" });
    }

    return res.status(200).json({ product: updatedProduct });
};

// ------------------- DELETE PRODUCT -------------------
const deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    let product;

    try {
        product = await Product.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while deleting product" });
    }

    if (!product) {
        return res.status(404).json({ message: "Unable to delete product" });
    }

    return res.status(200).json({ product });
};

// ------------------- EXPORT FUNCTIONS -------------------
exports.getAllProducts = getAllProducts;
exports.addProduct = addProduct;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;