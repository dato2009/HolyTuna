const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const Product = require("../models/product");
const User = require("../models/user");

const router = express.Router();

/*
    SHOP PAGE
*/

router.get("/shop", (req, res) => {
    res.render("shop");
});

/*
    API PRODUCTS
*/

router.get("/api/products", async (req, res) => {

    const products = await Product.find().sort({
        createdAt: -1
    });

    res.json(products);

});

/*
    API FAVORITES
*/

router.get("/api/favorites", requireAuth, async (req, res) => {

    const user = await User.findById(req.session.user.id);

    if (!user) {
        return res.json([]);
    }

    res.json(user.favorites);

});

/*
    TOGGLE FAVORITE
*/

router.post("/shop/:id/favorite", requireAuth, async (req, res) => {

    const productId = req.params.id;

    const user = await User.findById(req.session.user.id);

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    const already = user.favorites.find(id => id.toString() === productId);

    if (already) {

        user.favorites = user.favorites.filter(
            id => id.toString() !== productId
        );

        await user.save();

        return res.json({
            favorited: false
        });

    }

    user.favorites.push(productId);

    await user.save();

    res.json({
        favorited: true
    });

});

/*
    SELL PAGE
*/

router.get("/shop/sell", requireAuth, (req, res) => {

    res.render("sell-item", {

        error: null,
        old: {}

    });

});

/*
    CREATE PRODUCT
*/

router.post("/shop/sell", requireAuth, async (req, res) => {

    const {

        name,
        price,
        count,
        image,
        category,
        description

    } = req.body;

    if (!name || !price) {

        return res.render("sell-item", {

            error: "Item name and price are required.",
            old: req.body

        });

    }

    const priceNumber = Number(price);
    const countNumber = Number(count || 1);

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {

        return res.render("sell-item", {

            error: "Price must be positive.",
            old: req.body

        });

    }

    await Product.create({

        name: name.trim(),

        price: priceNumber,

        count: Number.isNaN(countNumber)
            ? 1
            : countNumber,

        image: image && image.trim()
            ? image.trim()
            : "/styles/images/Notebook.jfif",

        type: category
            ? category
                .split(",")
                .map(t => t.trim().toLowerCase())
                .filter(Boolean)
            : ["other"],

        description: description
            ? description.trim()
            : "",

        seller: req.session.user.username

    });

    res.redirect("/shop");

});

/*
    DELETE PRODUCT
*/

router.post("/shop/:id/delete", requireAuth, async (req, res) => {

    const item = await Product.findById(req.params.id);

    if (!item) {

        return res.redirect("/shop");

    }

    if (item.seller !== req.session.user.username) {

        return res.redirect("/shop");

    }

    await Product.findByIdAndDelete(req.params.id);

    res.redirect("/shop");

});

module.exports = router;