const Joi = require('@hapi/joi').extend(require('@joi/date'));
Joi.objectId = require('joi-objectid')(Joi)

const userRes = Joi.object({
    questionNo:Joi.number().required(),
    question: Joi.string().required(),
    answer:Joi.array().required(),
});

// subQuestions:Joi.array().items(subQuestion)
const schemas = {
    create:Joi.object({
            firstname: Joi.string()
            .trim()
            .required(),
        
            lastname: Joi.string()
            .trim()
            .required(),
        
            gender:Joi.string()
            .required()
            .valid('male','female','others'),
        
            height:Joi.number()
            .required(),
            
            

            category:Joi.string()
            .trim()
            .required()
            .valid('sugar daddy','sugar mommy','sugar boy',"sugar baby"),
        
            // BelongTo:Joi.string()
            // .trim()
            // .required(),
        
            qualification:Joi.string()
            .trim()
            .required(),
        
            // country:Joi.string()
            // .trim()
            // .required(),
        
            maritalStatus:Joi.string()
            .trim()
            .required(),
        
            contactNo:Joi.string()
            .trim()
            .min(10)
            .max(10)
            .required(),
        
            dateOfBirth:Joi.date().format('YYYY-MM-DD').utc()
            .required(),
        
            // coordinates: Joi.array().
            // required(), 
            bodyType:Joi.string()
            .trim(),
             
            // pincode: Joi.string()
            // .required(),
            smoker:Joi.boolean(),
            
            height:Joi.number(),
            
            lifestyleBudget:Joi.number(),

            children:Joi.number(),

            complexion:Joi.string()
            .trim(),

            about:Joi.string()
            .trim(),

            location:Joi.string()
            .trim(),

            occupation:Joi.string()
            .trim(),

            hairColor:Joi.string()
            .trim(),
            
            drinker:Joi.boolean(),
            ethnicity:Joi.string(),

        
            password: Joi.string()
            .required(),

            eyeColor:Joi.string()
            .trim(),

            languages:Joi.string(),
        
            confirmPassword:Joi.string()
            .required(),
        
            email: Joi.string()
            .trim()
            .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),

        }),

    update:Joi.object({
            about: Joi.string()
            .min(5)
            .max(100),

            firstname: Joi.string()
            .trim(),

            lastname: Joi.string()
            .trim(),

            gender:Joi.string()
            .valid('male','female','others'),

            ethnicity:Joi.string(),

            height:Joi.number(),
            
            lifestyleBudget:Joi.number(),

            complexion:Joi.string()
            .trim(),

            bodyType:Joi.string()
            .trim(),
            
            eyeColor:Joi.string()
            .trim(),

            hairColor:Joi.string()
            .trim(),

            children:Joi.number(),

            location:Joi.string()
            .trim(),


            languages:Joi.string()
            .trim(),

            

            // BelongTo:Joi.string()

            // .trim(),

            qualification:Joi.string()
            .trim(),

            occupation:Joi.string(),

            dateOfBirth:Joi.date().format('YYYY-MM-DD').utc(),

            password: Joi.string(),

            confirmPassword: Joi.string(),

            // image: Joi.string(),

            // userResponse:Joi.array().items(userRes),

            // region:Joi.string(),

            smoker:Joi.boolean(),

            drinker:Joi.boolean(),

            // verifyprofile:Joi.boolean()
        }),

    login:Joi.object({
        email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }) 
        .required(),

        password: Joi.string()
        .required(),
    }),

    forgotPassword:Joi.object({
        email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }) 
        .required(),
    })  ,

    resetPassword:Joi.object({
            password: Joi.string()
            .required(),

            confirmPassword: Joi.string()
            .required(),
        })  ,

    Id:Joi.object({
        id: Joi.objectId().required()
    }),

    addUserfile:Joi.object({
        userid: Joi.objectId().required(),
        image:Joi.string(),
        video:Joi.string()
    }) ,
    updatepassword:Joi.object({
        password: Joi.string()
            .required(),

            confirmPassword: Joi.string()
            .required()
    })       

}

exports.userValidate = {
    create:function async(req,res,next){
        const validationResult = schemas.create.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        req.validatedData = validationResult.value;
        next()
    },
    update:function async(req,res,next){
        const validationResult = schemas.update.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        req.validatedData = validationResult.value;
        next()
    },
    login:function async(req,res,next){
        const validationResult = schemas.login.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },
    forgotPassword:function async(req,res,next){
        const validationResult = schemas.forgotPassword.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },

    resetPassword:function async(req,res,next){
        const validationResult = schemas.resetPassword.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },
    paramsID:function async(req,res,next){
        const validationResult = schemas.Id.validate(req.params)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },
    addUserfile:function async(req,res,next){
        const validationResult = schemas.addUserfile.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },
    updatepassword:function async(req,res,next){
        const validationResult = schemas.updatepassword.validate(req.body)
        if(validationResult.error){
            return res.status(400).send({message:validationResult.error.details[0].message, success:false})
        }
        next()
    },
}



