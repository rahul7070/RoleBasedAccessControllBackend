
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklist.model");

const authorization = async (req, res, next)=>{
    let token = req.headers.authorization;
    try {
        if(token){
            let blacklisted = await BlacklistModel.findOne({token})
            if(blacklisted) return res.send("already logged out please log in")

            jwt.verify(token, 'rahul', function(err, decoded) {
                if(decoded){
                    req.body.email = decoded.email;
                    req.body.role = decoded.role
                    next()
                }else{
                    res.send(err.message)
                }
            });
        }else{
            res.send({"msg": "enter token"})
        }
        
    } catch (error) {
        res.send({"msg": error.message})
    }
}

module.exports = {authorization}