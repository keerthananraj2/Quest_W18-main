const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
