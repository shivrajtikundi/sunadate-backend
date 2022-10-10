
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)




 let schemas=  {
     create: Joi.object({
        from_userid :  Joi.objectId()
        .required()
         ,

        to_userid :   Joi.objectId().
        required()
        ,  
        
    }),
    getlikes: Joi.object({
        id: Joi.objectId().
        required(),

    })
};

exports.likesvalidations =
{
        create :function async(req,res,next){
            const validationResult = schemas.create.validate(req.body)
            if(validationResult.error){
               return res.status(400).send({message:validationResult.error.details[0].message, success:false})
            }
            next()
        },
        get :function async(req,res,next){
            const validationResult = schemas.getlikes.validate(req.params)
            if(validationResult.error){
              return res.status(400).send({message:validationResult.error.details[0].message, success:false})
            }
            next()
        },
        
}

