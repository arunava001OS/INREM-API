const {db} = require('./firebase');
const {User} = require('./model');

const fetchUser = async(userID) => {
    const userDB = db.collection('User');
    const user = await userDB.doc(userID).get();
    const userObj = new User(user.data());
    return userObj;
}

module.exports = {fetchUser}
