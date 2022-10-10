
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)


const option = Joi.object({ 
    option:Joi.string().required(), 
});

 let schemas=  {
     create: Joi.object({
        content_name: Joi.string()
        .trim()
        .required(),
        options:Joi.array().items(option).required() ,

    }),
    delete:Joi.object({
        id:Joi.objectId().
        required()
    }),
    
};


exports.validations =
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

