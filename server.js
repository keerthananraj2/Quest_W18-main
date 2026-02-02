require("dotenv").config();
require("dotenv").config({ path: "./config.env" });
console.log("DEBUG MONGO_URI =", process.env.MONGO_URI);


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Important for reading JSON requests
app.use("/uploads", express.static("uploads"));

// Import Routes



// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});


const productRoutes = require("./routes/productRoutes"); // Ensure the correct path
app.use("/api", productRoutes); // Use "/api" for all product routes

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// MongoDB Connection


mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));
    

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use(require("./middleware/errorHandler"));

