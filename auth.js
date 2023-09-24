const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.ensureToken = (req,res,next)=>{
    const bearerHeader = req.headers["authorization"]
    if(typeof bearerHeader!=='undefined'){
        const bearer = bearerHeader.split(" ");
        var bearerToken = bearer[1];
    }
    if (!bearerToken) {
        return res.status(403).send("Unauthorized Access");
      }
    try{
        const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
        req.user = decoded;
    }
    catch{
        return res.send({"message":"unauthorized user"})
    }
    return next()

}