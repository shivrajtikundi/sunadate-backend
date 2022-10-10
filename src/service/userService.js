const User = require('../models/userSchema');

/**
* Create a new user and returns it
* @param {Object} user - It is user input with all variables for user model
*/


const addUser = async (userInput,inp) => {
    console.log("user---",userInput);
    const user = new User(userInput,inp);
    console.log("user111---",user);

    const created_user =await user.save();
    console.log("created user---",created_user);
    return created_user;
}


module.exports = { addUser }
