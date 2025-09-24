const express = require("express");
const router = express.Router(); // ✅ Initialize Router
const Order = require("../models/Order");

// Place Order Route
router.post("/place-order", async (req, res) => {
    try {
        console.log("📥 Raw Request Body:", req.body); // Debugging log

        const { name, phone, quantity, price, address } = req.body;

        // Check if any field is missing
        if (!name || !phone || !quantity || !price || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newOrder = new Order({
            name,
            phone,
            quantity: parseInt(quantity),  
            price: parseInt(price)*quantity,  
            address
        });

        await newOrder.save();
        res.json({ message: "Order placed successfully!" });

    } catch (error) {
        console.error("🚨 Order Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router; // ✅ Export router
