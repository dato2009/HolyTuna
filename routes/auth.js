const express = require("express");
const userStore = require("../data/userStore");

const router = express.Router();

router.get("/register", (req, res) => {
    if (req.session.user) return res.redirect("/");

    res.render("register", {
        error: null,
        oldUsername: ""
    });
});

router.post("/register", async (req, res) => {

    const {
        username,
        password,
        confirmPassword
    } = req.body;

    if (!username || !password) {
        return res.render("register", {
            error: "Username and password are required.",
            oldUsername: username || ""
        });
    }

    if (password !== confirmPassword) {
        return res.render("register", {
            error: "Passwords do not match.",
            oldUsername: username
        });
    }

    if (password.length < 6) {
        return res.render("register", {
            error: "Password must be at least 6 characters.",
            oldUsername: username
        });
    }

    try {

        const user = await userStore.createUser(
            username.trim(),
            password
        );

        req.session.user = {
            id: user._id,
            username: user.username
        };

        res.redirect("/");

    } catch (err) {

        res.render("register", {
            error: err.message,
            oldUsername: username
        });

    }

});

router.get("/login", (req, res) => {

    if (req.session.user) return res.redirect("/");

    res.render("login", {
        error: null,
        oldUsername: ""
    });

});

router.post("/login", async (req, res) => {

    const {
        username,
        password
    } = req.body;

    const user = await userStore.findByUsername(username);

    if (!user) {

        return res.render("login", {
            error: "Incorrect username or password.",
            oldUsername: username
        });

    }

    const ok = await userStore.verifyPassword(
        user,
        password
    );

    if (!ok) {

        return res.render("login", {
            error: "Incorrect username or password.",
            oldUsername: username
        });

    }

    req.session.user = {
        id: user._id,
        username: user.username
    };

    const returnTo = req.session.returnTo;

    delete req.session.returnTo;

    res.redirect(returnTo || "/");

});

router.post("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

});

module.exports = router;