const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)


let schemas=  {
    create:Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required().trim().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
        password: Joi.string().required(),
        confirmPassword:Joi.string().required(),
        blocked:Joi.boolean(),
        role: Joi.string().valid('Editor', 'Admin', 'Viewer'),
        
    }),
    login: Joi.object({
        email: Joi.string()
        .required()
        .trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    
        password: Joi.string()
        .required(),

    }),
    delete: Joi.object({
        id: Joi.objectId()
    }),
    updataepassword:Joi.object({
        id: Joi.objectId(),

        password: Joi.string()
        .required(),
        
        confirmPassword:Joi.string()
        .required(),
    }),
}

exports.adminvalidations ={
    CreateUserValidate:function (req,res,next){
        const validationResult =  schemas.create.validate(req.body)
        console.log("validationResult register :: ",validationResult);
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error})
        }
        req.validatedData = validationResult.value;
        next();
    },
  
    login:function (req,res,next){
        const validationResult =  schemas.login.validate(req.body)
        console.log("validationResult",validationResult);
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error})
        }
        req.validatedData = validationResult.value;
        next()
    },
    deleteUserValidate:function (req,res,next){
        const validationResult =  schemas.delete.validate(req.body)
        console.log("validationResult",validationResult);
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error})
        }
        next()
    },
    upadatePassValidate:function (req,res,next){
        const validationResult =  schemas.updataepassword.validate(req.body)
        console.log("validationResult",validationResult);
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error})
        }
        next()
    }
}
    
    