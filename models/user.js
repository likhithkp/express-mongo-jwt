const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/authApp");

const userSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String
});

module.exports = mongoose.model("user", userSchema); 