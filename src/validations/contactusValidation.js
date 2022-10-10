
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)




 let schemas=  {
     create: Joi.object({
        description : Joi.string()
         ,

         mailingAddress : Joi.string()
        ,  
        
        corporateAddress : Joi.string()
    }),
    update: Joi.object({
        id: Joi.objectId().
        required(),
        description : Joi.string()
         ,

         mailingAddress : Joi.string()
        ,  
        
        corporateAddress : Joi.string()
    })
};

exports.contact_usvalidations =
{
   
        create_validation :function async(req,res,next){
            console.log("schema :: ",this.schema)
            const validationResult = schemas.create.validate(req.body)
            if(validationResult.error){
                return res.status(400).send({message:validationResult.error})
            }
            next()
        },
        update_validation :function async(req,res,next){
            const validationResult = schemas.update.validate(req.params,req.body)
            if(validationResult.error){
                return res.status(400).send({message:validationResult.error})
            }
            next()
        },
        
}

