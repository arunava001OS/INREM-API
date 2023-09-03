const {User,Course} = require('./model');

const {db} = require('./firebase');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "INREMAPI" // move this to private file;
const TOKEN_EXPIRY = "3d";

const createToken = (obj)=>{
    return jwt.sign({obj},SECRET_KEY, {expiresIn: TOKEN_EXPIRY});
}

const signup = async (req,res) => {
    var userObj = new User(req.body);
    try{
        //encrypt password
        const hashedPass = await bcrypt.hash(userObj.password,10);
        userObj.password = hashedPass;
        const token = createToken(userObj.userID);
        //const token = jwt.sign({id:userObj.userID},SECRET_KEY, {expiresIn: TOKEN_EXPIRY});

        const userDB = db.collection('User');
        var userData = await userDB.doc(userObj.userID).get();
        if(userData.exists) {
            res.status(400).send("User is already present. Login");
        } else {
            var userData = await userDB.doc(userObj.userID).set(JSON.parse(JSON.stringify(userObj)));
            res.cookie('jwt',token, {httpOnly:true});
            res.status(200).send({
                "message": "User Created Successfully"
            });
        }
    }catch(e){
        res.status(400).send(e);
    }
}

const login = async (req,res) => {
    const {userID,password} = req.body;

    try{
        const userDB = db.collection('User');
        var userData = await userDB.doc(userID).get()
        if(userData.exists){
            const matchpassword = await bcrypt.compare(password,userData.data().password);
            if(matchpassword){
                const token = createToken(userID);
                //const token = jwt.sign({id:userID},SECRET_KEY,{expiresIn: TOKEN_EXPIRY});
                res.cookie('jwt',token, {httpOnly:true});
                res.status(200).send({
                    "message": "User logged in successfully"
                })
            }else{
                res.status(400).send("Incorrect Credentials");
            }
        }else{
            res.status(400).send("User does not exist. Signup First");
        }
    }catch(e){
        res.status(400).send(e);
    }
}

const getAllCourses = async (req,res) => {
    var courseDB = db.collection("Course");
    var courses = await courseDB.get();
    var courseArray = [];
    courses.forEach((doc) => {
        courseArray.push(new Course(doc.data()));
    })
    res.status(200).send(courseArray.slice(0,-1)); // returning empty obj at end not sure why ?
}

const createOrUpdateCourse = async (req,res) => {
    var courseObj = new Course(req.body);

    var courseDB = db.collection('Course');
    await courseDB.doc(courseObj.courseID).set(JSON.parse(JSON.stringify(courseObj)));
    res.status(200).send({
        "message": "Course Created Successfully"
    })

}

const validateToken = async (req,res,next) => {

    const authHeader =  req.headers["authorization"];

    if(authHeader == null){
        res.status(401).send({"message":"Auth Header Missing"});
    }else{
        const token = authHeader.split(" ")[1]; // Assume : Bearer <token> in req header
        await jwt.verify(token,SECRET_KEY,(err,decodedToken)=>{
            if(err){
                console.log(err);
                res.status(401).send({"message":"Token Incorrect"});
            }else{
                console.log("Successfully Verified: "+ JSON.stringify(decodedToken));
                next();
            }
        })
    }
}


module.exports = {signup,login,validateToken,getAllCourses,createOrUpdateCourse}