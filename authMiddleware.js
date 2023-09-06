const jwt = require("jsonwebtoken");
const {db} = require('./firebase');

const SECRET_KEY = "INREMAPI" // move this to private file;

const {fetchUser} = require('./util');

const AuthMiddleWare = (roles) => {
    return async (req,res,next) => {
        var userID = '';
        const authHeader =  req.headers["authorization"];
        if(authHeader == null){
            res.status(401).send({"message":"Auth Header Missing"});
        }else{
            const token = authHeader.split(" ")[1];
            await jwt.verify(token,SECRET_KEY,(err,decodedToken)=>{
                if(err) {
                    console.log(err);
                    res.status(401).send({"message":"Token Incorrect"});
                } else {
                    console.log("Successfully Verified: "+ JSON.stringify(decodedToken));
                    userID = decodedToken.obj;
                }
            })
        }
        var user = await fetchUser(userID);
        if(!roles.includes(user.role)){
            res.status(401).send({"message":"You do not have permission to perform this action"});
        }else{
            next();
        }
  
    }
}

module.exports = {AuthMiddleWare};