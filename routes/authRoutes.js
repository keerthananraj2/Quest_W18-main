const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Seller = require("../models/Seller");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { sellerId: seller._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

module.exports = router;
