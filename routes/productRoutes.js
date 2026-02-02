const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Product = require("../models/product");

const router = express.Router();

/* =========================
   UPLOADS CONFIG
========================= */

// Correct uploads directory (project-root/uploads)
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* =========================
   CREATE PRODUCT
========================= */
router.post("/add-product", upload.array("photos", 20), async (req, res) => {
    try {
        const {
            sellerName,
            sellerEmail,
            sellerPhone,
            commodity,
            quantity,
            measurement,
            state,
            district,
            address,
            price
        } = req.body;

        if (!commodity || !quantity || !measurement || !state || !district || !address || !price) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }

        const photos = req.files?.map(file => file.filename) || [];

        const newProduct = new Product({
            sellerName: sellerName?.trim(),
            sellerEmail: sellerEmail?.trim(),
            sellerPhone,
            commodity: commodity?.trim(),
            quantity,
            measurement,
            state,
            district,
            address: address?.trim(),
            price,
            photos
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "✅ Product added successfully!",
            product: newProduct
        });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

/* =========================
   READ ALL PRODUCTS
========================= */
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}, "commodity price photos");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

/* =========================
   READ SINGLE PRODUCT
========================= */
router.get("/product/:id", async (req, res) => {

    // ✅ ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "❌ Invalid product ID"
        });
    }

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

/* =========================
   UPDATE PRODUCT
========================= */
router.put("/product/:id", async (req, res, next) => {

    // ✅ ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "❌ Invalid product ID"
        });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "❌ Product not found"
            });
        }

        res.json({
            success: true,
            message: "✅ Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        next(error);
    }
});

/* =========================
   DELETE PRODUCT
========================= */
router.delete("/product/:id", async (req, res, next) => {

    // ✅ ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "❌ Invalid product ID"
        });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "❌ Product not found"
            });
        }

        res.json({
            success: true,
            message: "🗑️ Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
