const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

let schemas=  {
    create:Joi.object({
            from_userid: Joi.objectId().
            required(),

            to_userid: Joi.objectId().
            required(),

            email: Joi.string()
            .trim()
            .required(),

            name: Joi.string()
            .trim()
            .required(),

            status: Joi.boolean()
            ,

            description: Joi.string()
            .trim()
            .required()

        }),
  reportid: Joi.object({
    id:Joi.objectId().
    required()
  }),
  update:Joi.object({
    id:Joi.objectId().
    required(),

    status: Joi.boolean(),
  })

}

exports.reportvalidations ={
  
       repport_validation :function async(req,res,next){
           const validationResult = schemas.create.validate(req.body)
           if(validationResult.error){
               res.status(400).send({message:validationResult.error.details[0].message, success:false})
           }
           next()
       },
       repport_id :function async(req,res,next){
        const validationResult = schemas.reportid.validate(req.params)
        if(validationResult.error){
            res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },
    update :function async(req,res,next){
        const validationResult = schemas.update.validate(req.params,req.body)
        if(validationResult.error){
            res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    }
       
}