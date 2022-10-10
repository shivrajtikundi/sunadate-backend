const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)



let schemas=  {
  create:Joi.object({
        from_userid: Joi.objectId()
        .required(),

        to_userid: Joi.objectId()
        .required(),
        
        status:Joi.string()
        .valid('ACCEPT',"PENDING","REJECT"),
    }),
   validId:Joi.object({
        id: Joi.objectId()
        .required(),
  }) ,

   update:Joi.object({
        id: Joi.objectId()
        .required(),

        status:Joi.string()
        .valid('ACCEPT',"PENDING","REJECT")
        .required(),
   }) 
  


}

exports.friendrequest ={
    Create:function (req,res,next){
        const validationResult =  schemas.create.validate(req.body)
        console.log("validationResult register :: ",validationResult);
        if(validationResult.error){
           return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        req.validatedData = validationResult.value;
        next();
    },
    validId:function (req,res,next){
        const validationResult =  schemas.validId.validate(req.params)
        console.log("validationResult register :: ",validationResult);
        if(validationResult.error){
           return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        req.validatedData = validationResult.value;
        next();
    },

     update:function (req,res,next){
         console.log("schemas.update",schemas.update);
        const validationResult =  schemas.update.validate(req.params.id,req.body)
        console.log("validationResult register :: ",validationResult);
        if(validationResult.error){
           return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        req.validatedData = validationResult.value;
        next();
    },
}
    
    