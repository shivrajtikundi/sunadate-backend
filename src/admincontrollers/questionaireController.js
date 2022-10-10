const Question = require("../models/questionSchema")

exports.createQuestion = async (req, res, next)=> {
    try{
        const checkIfQuestionExists  = await Question.findOne({questionNo: req.body.questionNo});

        if(checkIfQuestionExists){
            res.status(400).json({message: `Question no needs to be unique, question no ${req.body.questionNo} already exists`});
        }else{
            const question = new Question(req.body);
            await  question.save();
            res.status(201).send(question);
        }
    }
    catch(e){
        res.status(406).send({message:e.message})
    }
};

exports.getQuestionByNo = async(req, res, next)=> {
    try{
        const question = await Question.find({questionNo: req.params.questionNo})
         res.status(201).send(question);
    }
    catch(e){
        console.log("e===",e);
        res.status(400).send({message:"Question not found"})
    }
}

exports.getAllQuestion = async (req, res) => {
    try {
        const question = await Question.find({}).sort({ questionNo: 1 });
        res.status(200).json(question);
    } catch (error) {
        res.status(401).send(error.message);
    }
    
}

exports.updateQuestion = async (req, res) => {
    try{
        let question = await Question.findByIdAndUpdate(req.params.id,req.body);
        res.send({message:"question successfully updated", data:question});
    }
    catch (err) {
        console.log("error",err);
        res.status(404).send({ error: err });
      }
       
}

  
exports.deleteQuestion = async (req, res) =>{
    try {
      const question = await Question.findById(req.params.id);
      await question.remove();
      res.send({data:true});
    } catch {
      res.status(404).send({ error: "question is not found!" });
    }
};

