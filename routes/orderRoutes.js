const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/product");

// PLACE ORDER
router.post("/place-order", async (req, res) => {
    try {
        const { productId, name, phone, quantity, address } = req.body;

        if (!productId || !name || !phone || !quantity || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const totalPrice = product.price * quantity;

        const newOrder = new Order({
            productId,
            buyerName: name,
            buyerPhone: phone,
            quantity,
            totalPrice,
            address
        });

        await newOrder.save();

        res.json({
            success: true,
            message: "✅ Order placed successfully!"
        });

    } catch (error) {
        console.error("🚨 Order Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// GET ALL ORDERS (SELLER DASHBOARD)
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("productId", "commodity price");

        res.json(orders);
    } catch (error) {
        console.error("❌ Fetch Orders Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
