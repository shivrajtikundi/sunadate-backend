
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)




 let schemas=  {
     create: Joi.object({
        title: Joi.string()
        .trim()
        .required(),
        description:Joi.string().required() ,

    }),
    delete:Joi.object({
        id:Joi.objectId().
        required()
    }),
    
};


exports.faqValidations =
{
   
        create_validation : function async(req,res,next){
            const validationResult = schemas.create.validate(req.body);

            if(validationResult.error){
                return res.status(400).send({message:validationResult.error});
             }
            next();
        },
        validateid : function async(req,res,next){
            const validationResult = schemas.delete.validate(req.params);
            if(validationResult.error){
                return res.status(400).send({message:validationResult.error});
             }
            next();
        },

}

