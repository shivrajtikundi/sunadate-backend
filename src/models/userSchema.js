const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { array } = require('@hapi/joi');
// let nodeGeocoder = require('node-geocoder');


// const userRes = mongoose.Schema({ 
//     questionNo:Number,
//     question: { type:String } ,
//     answer:{ type: [String] } ,
//     _id:false 
// });


const userSchema = new mongoose.Schema(
    
    {
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    contactNo: {
        type: Number,
    },
    //year-month-day
    dateOfBirth: {
        type: Date,
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female","others"]
    },
    category:{
        type:String,
        enum: ["sugar mommy", "sugar daddy","sugar baby","sugar boy"]
    },
    height: {
        type: Number,
    },
    children: {
        type: Number,
        default:0
    },
    bodyType: {
        type:String,
    },
   
    complexion: {
        type: String,
    },
    maritalStatus: {
        type: String,
        enum: ["married", "unmarried","single"]
    },
    qualification: {
        type: String,
    },
    occupation: {
        type: String,
    },
    lifestyleBudget: {
        type: Number,
    },
    eyeColor: {
        type: String,
    },
    password: {
        type: String,
    },
    confirmPassword: {
        type: String,
    },
   
    ethnicity: {
        type: String,
    },
    languages: {
        type: [String],
    },
   
    smoker:{
        type: Boolean,
        default:false,
    },
    drinker:{
        type: Boolean,
        default:false,
    },
    customerId:{
        type:String,
    },
    hairColor:{
        type:String,
        default:null
    },
     about: {
        type: String,
    },
    // online:{
    //     type: Boolean,
    //     default:true
    // },
    // profileVisits:{
    //     type:Number,
    //     default:0
    // },
    // profileVisitCount:{
    //     type:Number,
    //     default:0
    // },
     // age:{
    //     type:Number
    // },
    location: {
        type: {
            type: String,
            default:"Point",
          },
        coordinates: {
          type: [Number]
        } 
      },
    //   image:{
    //     type:String
    //   },
    //   region: {
    //     type: String,
    //   },
    // verifyprofile:{
    //     type: Boolean,
    //     default: false
    // },
    // Date: {
    //     type:Date,
    //     default:new Date
    // },
    //  active: {
    //     type: Boolean,
    //     default:true,
    //  },
    //  isBlocked: {
    //     type: Boolean,
    //     default:false,
    //  } ,
    //  blockCount:{
    //     type: Number,
    //  },  
    //  userResponse: {
    //     type:[userRes],
    // },
     resetPasswordToken: String,
    resetPasswordExpire: Date,

},
{ timestamps: true }
)

// userSchema.index({ location: "2dsphere" });


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
    }
    next()
})

// userSchema.pre('save' , async function(next){
//     try {
//         if(this.isModified('pincode')){
//             let options = {
//                 provider: 'openstreetmap'
//               };
               
//               let geoCoder = await nodeGeocoder(options);
//               const location =  await geoCoder.geocode(this.pincode);
//               console.log("loc",location);
//               this.location  = {
//                   type:"Point",
//                   coordinates:[location[0].longitude, location[0].latitude]
//                 }             
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// )


userSchema.pre('save', async function (next) {
    if (this.isModified('dateOfBirth')) {
        var ageInMilliseconds = new Date() - new Date(this.dateOfBirth);
        let age = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365);
        this.age = age;
    }
})


userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "test", {
      expiresIn: "30d",
    });
  };

userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;



