
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklist.model");

function checkRole(permitRoles){
    return async (req, res,next)=>{
        if(permitRoles.includes(req.body.role)) next();
        else return res.send("not permitted to access this route")
    }
}


module.exports = {checkRole}