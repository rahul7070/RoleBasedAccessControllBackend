const express = require("express");
const connection = require("./db");
const { userRouter, moderatorRouter } = require("./routes/user.route");
require("dotenv").config()


const app = express();

app.get("/", (req, res)=>{
    res.send("hello world")
})

app.use(express.json())
app.use("/user", userRouter)
app.use("/moderator", moderatorRouter)



app.listen(process.env.port, async ()=>{
    try {
        connection;
        console.log("connection established");
        console.log(`connectedf to ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
})