const Joi = require('@hapi/joi')

const tokenSchema = Joi.object({
    from : Joi.string().required(),
    to : Joi.string().required(),
    callType : Joi.string().required()
})

exports.tokenValidation = async (req, res, next)=>{
    const validationResult =  tokenSchema.validate(req.body)
    if(validationResult.error){
        res.status(400).send({message:validationResult.error,success:false})
    }
    next()
} 