const mongoose = require("mongoose");

module.exports = mongoose.model("BlogPost", new mongoose.Schema({

    title:String,
    body:String,
    author:String

},{timestamps:true}));