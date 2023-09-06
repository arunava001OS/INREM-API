// user roles
//student,course-admin,admin

const User = class {
    constructor(obj){
        this.userID = obj.userID;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.password = obj.password;
        this.contactNumber = obj.contactNumber
        this.role = obj.role
    }
}

const Course = class {
    constructor(obj){
        this.courseID = obj.courseID,
        this.courseName = obj.courseName,
        this.courseDescription = obj.courseDescription,
        this.courseContent = obj.courseContent,
        this.courseInstructor = obj.courseInstructor
    }
}

module.exports = {User,Course}