const userResponce = require('../models/answerSchema')

/**
* Create a new user and returns it
* @param {Object} userInput - It is user input with all variables for user model
*/


const addAnswer = async (userInput) => {
    const answer = await new userResponce(userInput)
    await answer.save()
    return answer
}
module.exports = { addAnswer }
