const mongoose = require("mongoose");

module.exports = mongoose.model("ChatMessage", new mongoose.Schema({

    username:String,
    message:String

},{timestamps:true}));