const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

// const subQuestion = Joi.object({ 
//     question: Joi.string().required(), 
//     answer:Joi.array().required()  , 
// });
// subQuestions:Joi.array().items(subQuestion)

const userRes = Joi.object({
    questionNo:Joi.number().required(),
    question: Joi.string().required(),
    answer:Joi.array().required(),
});



const schemas ={
            create:Joi.object({
                userid: Joi.objectId().required(),
                userResponse:Joi.array().items(userRes)
            }),
            Id:Joi.object({
                id: Joi.objectId().required(),
            }),

}


exports.responceValidations = {
        create: function async(req,res,next){
            const validationResult = schemas.create.validate(req.body);
            if(validationResult.error){
                return res.status(400).send({message:validationResult.error.details[0].message, success:false});
             }
            next();
        },
        Id:function async(req,res,next){
            const validationResult = schemas.Id.validate(req.params);
            if(validationResult.error){
                return res.status(400).send({message:validationResult.error.details[0].message, success:false});
             }
            next();
        },
}

// module.exports = { answerSchema }
