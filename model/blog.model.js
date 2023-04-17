const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: String,
    email : String,
    body: String
})

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = {BlogModel}