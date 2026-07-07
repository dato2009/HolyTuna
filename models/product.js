const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    count: {
        type: Number,
        default: 1
    },

    image: {
        type: String,
        default: "/styles/images/Notebook.jfif"
    },

    type: [{
        type: String
    }],

    description: {
        type: String,
        default: ""
    },

    seller: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);