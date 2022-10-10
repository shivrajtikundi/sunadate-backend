
const Joi = require('@hapi/joi')


const option = Joi.object({ 
    option:Joi.string().required(), 
});

let schemas ={ 
    create:Joi.object({
    
    questionNo: Joi.number()
    .required(),
    
    question: Joi.string()
    .required(),

    options: Joi.array().items(option),

    multiple: Joi.boolean()

})
}



exports.questionaire ={
   question_validate:function (req,res,next){
        const validationResult =   schemas.create.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error,success:false})
        }
        next()
}
}