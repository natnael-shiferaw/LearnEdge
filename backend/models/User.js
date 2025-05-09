
const mongoose = require('mongoose')

//create a User Schema
const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
});

module.exports = mongoose.model("User", UserSchema)
