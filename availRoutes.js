const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// 🟢 Route to fetch all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

// 🟢 Route to post a new product
router.post("/", async (req, res) => {
    try {
        const { commodity, price, photos } = req.body;
        const newProduct = new Product({ commodity, price, photos });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error adding product", error });
    }
});

module.exports = router;
