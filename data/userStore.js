const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function findByUsername(username) {
    return await User.findOne({
        username: new RegExp("^" + username + "$", "i")
    });
}

async function createUser(username, password) {

    const exists = await findByUsername(username);

    if (exists) {
        throw new Error("Username already exists.");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email: `${username}@holytuna.local`,
        password: hashed
    });

    return user;
}

async function verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
}

module.exports = {
    findByUsername,
    createUser,
    verifyPassword
};