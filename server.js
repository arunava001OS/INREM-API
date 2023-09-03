
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const {signup,login,validateToken,getAllCourses,createOrUpdateCourse} = require('./functions'); 

/// Endpoints

app.get('/',async (req,res) => {
    res.json("Welcome to INREM API");
})

app.post('/signup', (req,res) => signup(req,res));
app.post('/login',(req,res)=> login(req,res));

app.get('/course',validateToken, (req,res) => getAllCourses(req,res))
app.post('/course',validateToken, (req,res) => createOrUpdateCourse(req,res))


app.listen(3000);