const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const Track = require("../models/Track");
const Video = require("../models/Video");
const BlogPost = require("../models/BlogPost");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

/*
HOME
*/

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/chords", (req, res) => {
    res.render("chords");
});

router.get("/tuner", (req, res) => {
    res.render("tuner");
});

/*
BLOGS
*/

router.get("/blogs", async (req, res) => {

    const posts = await BlogPost.find().sort({
        createdAt: -1
    });

    res.render("blogs", {
        posts
    });

});

router.get("/api/blogs", async (req, res) => {

    const posts = await BlogPost.find().sort({
        createdAt: -1
    });

    res.json(posts);

});

/*
MUSIC
*/

router.get("/music", requireAuth, async (req, res) => {

    const tracks = await Track.find().sort({
        createdAt: -1
    });

    res.render("music", {

        tracks,
        error: null

    });

});

router.post("/music", requireAuth, async (req, res) => {

    const {

        title,
        genre,
        link,
        description

    } = req.body;

    if (!title || !link) {

        const tracks = await Track.find().sort({
            createdAt: -1
        });

        return res.render("music", {

            tracks,
            error: "Title and link required."

        });

    }

    await Track.create({

        title,

        genre: genre || "Unspecified",

        link,

        description,

        postedBy: req.session.user.username

    });

    res.redirect("/music");

});

/*
VIDEOS
*/

router.get("/videos", requireAuth, async (req, res) => {

    const videos = await Video.find().sort({
        createdAt: -1
    });

    res.render("videos", {

        videos,
        error: null

    });

});

router.post("/videos", requireAuth, async (req, res) => {

    const {

        title,
        link,
        description

    } = req.body;

    if (!title || !link) {

        const videos = await Video.find().sort({
            createdAt: -1
        });

        return res.render("videos", {

            videos,
            error: "Title and link required."

        });

    }

    await Video.create({

        title,

        link,

        description,

        postedBy: req.session.user.username

    });

    res.redirect("/videos");

});

/*
CHAT
*/

router.get("/chat", requireAuth, async (req, res) => {

    const messages = await ChatMessage.find().sort({
        createdAt: 1
    });

    res.render("chat", {

        messages,
        error: null

    });

});

router.post("/chat", requireAuth, async (req, res) => {

    const {

        message

    } = req.body;

    if (!message || !message.trim()) {

        const messages = await ChatMessage.find().sort({
            createdAt: 1
        });

        return res.render("chat", {

            messages,
            error: "Type something."

        });

    }

    await ChatMessage.create({

        username: req.session.user.username,

        message: message.trim()

    });

    res.redirect("/chat");

});

module.exports = router;