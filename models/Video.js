const mongoose = require("mongoose");

module.exports = mongoose.model("Video", new mongoose.Schema({

    title:String,
    link:String,
    description:String,
    postedBy:String

},{timestamps:true}));