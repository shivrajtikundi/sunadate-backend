const Question = require("../models/questionSchema")
const {addQuestion} =require("../service/questionService");
const { ErrorHandler } = require("../utils/errorhandler");
const { success } = require("../utils/success");


exports.createQuestion = async (req, res, next)=> {
    try{
        const question=await addQuestion(req.body);
        
        
        
        // let arr=[];
        // req.options.forEach((num1, index) => {
        //     const num2 = req.body.option[index];
        //     arr.push({image:num1.fileUrl, option:num2});
        //   });
        // //   console.log("=====>>>>>>>log",arr);
        //     const question = new Question({
        //     questionNo:req.body.questionNo,
        //     question:req.body.question,
        //     options:arr,
        //     multiple:req.body.multiple
        // })
        
        await question.save();
        return res.status(201).send({message:"question added successfully",question});
    }
    catch(e){
        console.log("e===",e);
        res.status(406).send({message:"something went wrong"})
    }
};

exports.getQuestionByNo = async(req, res, next)=> {
    try{
        const question = await Question.find({questionNo: req.params.questionNo})
        if(question){
            res.status(200).json(success('queston', {question}, res.statusCode));  
        }
        else{
            res.status(204).json(success('not found', {success:false}, res.statusCode));  

        }
    }
    catch(e){
        return res.status(500).json(ErrorHandler(e.message, 500));
    }
}

exports.getAllQuestion = async (req, res) => {
    const question = await Question.find({}).sort({ questionNo: 1 })
    .then((question,err) =>{
        if (err) {
            res.json({ err: "some error!" });
        }
        else {
            res.json({question});
        }
    }).catch(err =>   res.status(500).json(ErrorHandler(err.message, 500)))


}


