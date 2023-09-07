
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const {signup,login,getAllCourses,upsertCourse} = require('./server'); 
const {AuthMiddleWare} = require('./authMiddleware')

/// Endpoints

app.get('/',async (req,res) => {
    res.json("Welcome to INREM API");
})

app.post('/signup', (req,res) => signup(req,res));
app.post('/login',(req,res)=> login(req,res));

app.get('/course', (req,res) => getAllCourses(req,res));
app.post('/course',AuthMiddleWare(["course-admin","admin"]),(req,res) => upsertCourse(req,res))

//todo
/**
 * get list of instructors
 * get course by ID
 * get courses enrolled by a user
 * get courses by instructor
 * 
 * create batch
 * enroll in batch
 * 
 */


app.listen(3000);