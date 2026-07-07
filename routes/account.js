const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const User = require("../models/user");
const Product = require("../models/product");
const Track = require("../models/Track");
const Video = require("../models/Video");
const BlogPost = require("../models/BlogPost");

const router = express.Router();

router.get("/account", requireAuth, async (req, res) => {

    const username = req.session.user.username;

    const user = await User.findById(req.session.user.id)
        .populate("favorites");

    if (!user) {
        return res.redirect("/login");
    }

    const myProducts = await Product.find({
        seller: username
    }).sort({
        createdAt: -1
    });

    const myTracks = await Track.find({
        postedBy: username
    }).sort({
        createdAt: -1
    });

    const myVideos = await Video.find({
        postedBy: username
    }).sort({
        createdAt: -1
    });

    const myBlogPosts = await BlogPost.find({
        author: username
    }).sort({
        createdAt: -1
    });

    res.render("account", {

        profile: {

            username: user.username,

            joinedAt: user.createdAt

        },

        favoritedItems: user.favorites,

        myProducts,

        myBlogPosts,

        myTracks,

        myVideos

    });

});

module.exports = router;