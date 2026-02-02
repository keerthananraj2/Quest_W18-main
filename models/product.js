const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sellerName:{type:String,required:true},
    sellerEmail:{type:String,required:true},
    sellerPhone:{type:Number,required:true},
    commodity: { type: String, required: true },
    quantity: { type: Number, required: true },
    measurement: { type: String, required: true },
    price: {type:Number,required:true},
    state: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    photos: [{ type: String }]  // Array of image URLs
});

module.exports = mongoose.model("Product", productSchema);
