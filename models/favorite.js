const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Favorite",
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    })
);