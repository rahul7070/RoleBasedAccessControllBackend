const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email : String,
    pass: String,
    role: {type: String, required: true, enum:["user", "moderator"], default: "user"}
})

const UserModel = mongoose.model("user", userSchema);

module.exports = {UserModel}