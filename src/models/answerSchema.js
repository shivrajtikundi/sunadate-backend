var mongoose = require('mongoose');



const userRes = mongoose.Schema({ 
    questionNo:Number,
    question: { type:String } ,
    answer:{ type: [String] } ,
    _id:false 
});


var answerSchema = mongoose.Schema({
    userid: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userResponse: {
        type:[userRes],
    }
});

module.exports = mongoose.model('answer',answerSchema)
