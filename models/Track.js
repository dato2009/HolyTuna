const mongoose = require("mongoose");

module.exports = mongoose.model("Track", new mongoose.Schema({

    title:String,
    genre:String,
    link:String,
    description:String,
    postedBy:String

},{timestamps:true}));