const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklist.model");
const {authorization} = require("../middleware/auth");
const { BlogModel } = require("../model/blog.model");
const { checkRole } = require("../middleware/roleChecker");

const userRouter = express.Router();
const moderatorRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        let { email, pass } = req.body;
        let registeredUser = await UserModel.findOne({ email })
        if (registeredUser) return res.send({ "msg": "email Id is already used" })

        bcrypt.hash(pass, 5, async function (err, hash) {
            if (err) res.send({ "msg": err.message })

            else {
                req.body.pass = hash
                let payload = new UserModel(req.body)
                await payload.save()
                res.send("registration success")
            }
        });

    } catch (error) {
        res.send(error)
    }
})

userRouter.post("/login", async (req, res) => {
    let { email, pass } = req.body;
    try {
        let registeredUser = await UserModel.findOne({ email })

        if (!registeredUser) return res.send({ "msg": "no user with this email, please register first" })

        bcrypt.compare(pass, registeredUser.pass, function(err, result) {

            let token = jwt.sign({ email, role:registeredUser.role }, 'rahul', {expiresIn: 60*5});
            let refreshtoken = jwt.sign({ email, role:registeredUser.role }, 'raman', {expiresIn: 60*10});

            if(result){
                res.send({"msg": "login success", token, refreshtoken})
            }else{
                return res.send("wrong pass")
            } 
        });
    } catch (error) {
        res.send(error)
    }
})

userRouter.get("/logout", async (req, res)=>{
    try {
        let token = req.headers.authorization;
        if(token){
            let payload = new BlacklistModel({token});
            await payload.save()
            res.send("logout successs")
        }else{
            res.send({"msg": "enter token"})
        }
        
    } catch (error) {
        res.send({"msg": error.message})
    }
})

userRouter.get("/refreshToken", async (req, res)=>{
    try {
        let refreshtoken = req.headers.authorization;
        if(refreshtoken){
            jwt.verify(refreshtoken, 'raman', function(err, decoded) {
                if(decoded){
                    // console.log(decoded)
                    let token = jwt.sign({ email:decoded.email, role:decoded.role }, 'rahul', {expiresIn: 60});
                    res.send({token, refreshtoken})
                }else{
                    res.send("wrong refresh token")
                }
            });
        }else{
            res.send({"msg": "enter token"})
        }
        
    } catch (error) {
        res.send({"msg": error.message})
    }
})



userRouter.post("/add", authorization, async (req, res)=>{
    try {
        let payload = new BlogModel(req.body);
        await payload.save();
        res.send("blog added")
    } catch (error) {
        res.send(error.message)
    }
})

userRouter.get("/read", authorization, async (req, res)=>{
    // let email = req.body.email;
    try {
        let blogs = await BlogModel.find()
        // console.log(blogs)
        res.send(blogs)
    } catch (error) {
        res.send(error.message)
    }
})

userRouter.patch("/update/:id", authorization, checkRole(["user"]), async (req, res)=>{
    let {email} = req.body;
    let id = req.params.id
    try {
        let blogs = await BlogModel.find({email})
        if(blogs.length>0){
            await BlogModel.findByIdAndUpdate({_id:id}, req.body);
            res.send("updated")

        }else{
            res.send("no blog available with this email")
        }
    } catch (error) {
        res.send(error.message)
    }
})

userRouter.delete("/delete/:id", authorization, checkRole(["user"]) , async (req, res)=>{
    let {email} = req.body;
    let id = req.params.id
    try {
        let blogs = await BlogModel.find({email})
        if(blogs.length>0){
            await BlogModel.findByIdAndDelete({_id:id});
            res.send("deleted by user")
        }else{
            res.send("no blog available with this email")
        }
    } catch (error) {
        res.send(error.message)
    }
})

moderatorRouter.delete("/delete/:id", authorization, checkRole(["moderator"]), async (req, res)=>{
    let {email} = req.body;

    let id = req.params.id
    try {
            await BlogModel.findByIdAndDelete({_id: id});
            res.send("deleted")

    } catch (error) {
        res.send(error.message)
    }
})




module.exports = { userRouter, moderatorRouter }