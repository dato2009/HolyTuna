require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const compression = require("compression");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(compression());

app.use(express.static(path.join(__dirname, "public"), {
    maxAge: "1d"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(session({

    secret: process.env.SESSION_SECRET || "holytuna-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }

}));

app.use((req, res, next) => {

    res.locals.user = req.session.user || null;

    next();

});

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/shop"));
app.use("/", require("./routes/account"));
app.use("/", require("./routes/pages"));

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("✅ MongoDB Connected");

    app.listen(process.env.PORT || 3000, () => {

        console.log("🚀 Server Running");

    });

})

.catch(err => {

    console.error(err);

});