const Question = require('../models/questionSchema')
/**
* Create a new Question and returns it
* @param {Object} userInput - It is user input with all variables for Question model
*/
const addQuestion = async (userInput) => {
const question = new Question(userInput)
await  question.save()
return question
}
module.exports = { addQuestion }
