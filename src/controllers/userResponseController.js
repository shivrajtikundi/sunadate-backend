const Answer = require("../models/answerSchema")
const { addAnswer } =require("../service/userResponseService");
const { ErrorHandler } = require("../utils/errorhandler");
const { success } = require("../utils/success");


exports.createUserAnswer = async(req, res, next)=> {
  try{
      const answer =  new Answer(req.body);
      await answer.save();
       res.status(201).json(success('user response', {answer}, res.statusCode));
  }
  catch(e){
    return res.status(500).json(ErrorHandler(e.message, 500));
  }
};

exports.getuserResponse = async (req, res) => {
  try {
    console.log(req.params);
    const answer = await Answer.findOne({userid:req.params.id});
    res.status(200).json(success('user response', {answer}, res.statusCode));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error.message, 500));
  }
};

// work in progress
exports.updateResponse = async (req, res) => {
  console.log("req---",req.body);
    try {
      let answer = await Answer.findByIdAndUpdate(req.params.id,req.body);
      res.status(200).json(success('Answer successfully updated', {answer}, res.statusCode));
    }
    catch (err) {
      return res.status(500).json(ErrorHandler(err.message, 500));
    }
};





