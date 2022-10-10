const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

let schemas=  {
    user:Joi.object({
            id: Joi.objectId().
            required(),
        }),
    limituser:Joi.object({
        userid: Joi.objectId().
        required(),

        i_limit:Joi.number(),

        v_limit:Joi.number()
    })

}

exports.uservalidations ={
  
       userIdvalidate :function async(req,res,next){
           const validationResult = schemas.user.validate(req.params)
           if(validationResult.error){
              return res.status(400).send({message:validationResult.error})
           }
           next()
       },
       limifilesvalidate :function async(req,res,next){
        const validationResult = schemas.limituser.validate(req.body)
        if(validationResult.error){
           return res.status(400).send({message:validationResult.error})
        }
        next()
    },
       
}