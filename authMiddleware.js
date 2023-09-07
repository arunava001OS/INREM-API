const jwt = require("jsonwebtoken");
const {db} = require('./firebase');

const SECRET_KEY = "INREMAPI" // move this to private file;

const {fetchUser} = require('./util');

const AuthMiddleWare = (roles) => {
    return async (req,res,next) => {
        var contactNumber = '';
        const authHeader =  req.headers["authorization"];
        if(authHeader == null){
            res.status(401).send({"message":"Auth Header Missing"});
            return;
        }else{
            const token = authHeader.split(" ")[1];
            await jwt.verify(token,SECRET_KEY,(err,decodedToken)=>{
                if(err) {
                    console.log(err);
                    res.status(401).send({"message":"Token Incorrect"});
                    return;
                } else {
                    console.log("Successfully Verified: "+ JSON.stringify(decodedToken));
                    contactNumber = decodedToken.obj;
                }
            })
        }
        var user = await fetchUser(contactNumber);
        if(!roles.includes(user.role)){
            res.status(401).send({"message":"You do not have permission to perform this action"});
            return;
        }else{
            next();
        }
  
    }
}

module.exports = {AuthMiddleWare};