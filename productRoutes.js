const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/product");

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads"); // instead of ".."

//const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route to add a product with multiple images
router.post("/add-product", upload.array("photos", 20), async (req, res) => {
    try {
        const { sellerName, sellerEmail,sellerPhone,commodity, quantity, measurement, state, district, address, price } = req.body; // ✅ Added price

        if (!commodity || !quantity || !measurement || !state || !district || !address || !price) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }

        const photos = req.files.map(file => file.filename); // ✅ Store only filenames

        const newProduct = new Product({
            sellerName,
            sellerEmail,
            sellerPhone,
            commodity,
            quantity,
            measurement,
            state,
            district,
            address,
            price,
            photos
        });

        await newProduct.save();
        res.status(201).json({ message: "✅ Product added successfully!", product: newProduct });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

// Get all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}, "commodity price photos");

        res.render("buy", { products }); // ✅ No need to modify paths again
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

// Get a single product by ID
router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "❌ Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

module.exports = router;
