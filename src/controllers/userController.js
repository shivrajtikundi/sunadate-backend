const User = require("../models/userSchema");
const sendToken = require("../utils/jwtToken");
const bcrypt = require('bcryptjs');
const { ErrorHandler } = require('../utils/errorhandler')
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { addUser } = require("../service/userService")
const userGallery = require("../models/userGallerySchema")
const { success } =require("../utils/success")
const likes = require("../models/likeSchemas");
var ObjectId = require('mongodb').ObjectID;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.register = async (req, res,next) => {
  //Check if this user is already exists
  try{
    const validateData = req.validatedData;
  let user = await User.findOne({ email: validateData.email });
  const { password, confirmPassword } = req.validatedData;
  if (user) {
    return res.status(400).json(ErrorHandler("That user already exist", 400))
  }
  else if (password != confirmPassword) {
    res.status(400).send("Password doesnot Match")
  }
  else {
    console.log("req--------------------------------",req.validatedData);
    const customer = await stripe.customers.create({
      email: req.validatedData.email,
    });
    const saveduser = await new User({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      contactNo:req.body.contactNo,
      dateOfBirth:req.body.dateOfBirth,
      gender:req.body.gender,
      height:req.body.height,
      complexion:req.body.complexion,
      maritalStatus:req.body.maritalStatus,
      qualification:req.body.qualification,
      category:req.body.category,
      occupation:req.body.occupation,
      about:req.body.about,
      children:req.body.children,
      hairColor:req.body.hairColor,
      location:req.body.location,
      password:req.body.password,
      confirmPassword:req.body.confirmPassword,
      lifestyleBudget:req.body.lifestyleBudget,
      eyeColor:req.body.eyeColor,
      languages:req.body.languages,
      smoker:req.body.smoker,
      drinker:req.body.drinker,
      ethnicity:req.body.ethnicity,
      bodyType:req.body.bodyType,
      customerId:customer.id,
     
    });
    console.log("req",req.body);
    await saveduser.save();
    sendToken(saveduser, 200, res);
  }
  }
  catch(error){
    console.log("err---",error);
    return res.status(500).json(ErrorHandler({message:error.message}, 500));
  }
  
}
//update User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id,req.validatedData);
    console.log(user)
    // if(req.fileurl){
    //   user.image = req.fileurl
    // };
    user.save()
    res.status(200).json(success('OK', {user}, res.statusCode));
  }
  catch (err) {
    return res.status(500).json(ErrorHandler({ error: err.message }, 500));
  }

}

//Login User
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
 
  try {
      if (!email || !password) {
          return res.status(400).json(ErrorHandler("Please Enter Email & Password", 400));
        }
        const user = await User.findOne({ email }).select("+password");
      
        if (!user) {
          return res.status(406).json(ErrorHandler("Invalid email or password", 406));
        }
      
        const isPasswordMatched = await bcrypt.compare(password, user.password);
      
        if (!isPasswordMatched) {
          return res.status(404).json(ErrorHandler("password does not match", 404));
        }
        
        if(user){
          await User.findByIdAndUpdate(user._id,{"online": true,new:true});
          sendToken(user, 200, res);
        }
        
  } catch (error) {
    console.log(error);
    return res.status(500).json(ErrorHandler({message:error.message}, 500));
  }

 
};
// Logout User

exports.logout = async (req, res, next) => {
   req.header(req.headers.token, null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });
  console.log("req.user----", req.user._id);
 let user= await User.findByIdAndUpdate(req.user._id,{online:false},{new:true});
  res.status(200).json({
    success: true,
    message: "Logged Out",
    user
  });
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json(ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });


    return res.status(500).json(ErrorHandler(error.message, 500));
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");


  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
console.log(user);

  if (!user) {
    return res.status(400).json(ErrorHandler("Reset Password Token is invalid or has been expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json(ErrorHandler("Password does not Matched", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
    
};

exports.updatePassword= async (req, res, next) => {
  try{
    const {password,confirmPassword} = req.body;
    if(password!=confirmPassword){
      return res.status(401).json(ErrorHandler("Password and confirmPassword does not Matched", 401));
    }
    else
    {
      const user = await User.findOneAndUpdate(req.params.id,{
        password:await bcrypt.hash(password, 12), 
        confirmPassword:await bcrypt.hash(confirmPassword, 12)
      })
    await user.save()
      res.status(200).json(success('OK', {user}, res.statusCode));
    }
}
  catch(error){
    return res.status(500).json(ErrorHandler(error.message, 500));
  }
}

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  console.log("req-------", user)

  res.status(200).json({
    success: true,
    user,
  });
};

// exports.deleteUserfile = async (req, res, next)=>{
//   try
//   {
//       const userFile = await userGallery.findByIdAndDelete(req.params.id)
//       if({userFile:null}){
//       res.status(200).json({
//         success: true,
//         message: "File deleted"
//       });
//     }
//   }catch (error) {
//     return res.status(500).json(ErrorHandler(error.message, 500));
//   }
// }

//filterusers 
// exports.filterusers = async (req, res, next) => {
//   try {
//     let users;
//     if(req.body.mile && req.body.age){
//       const age = req.body.age;
//       delete req.body.age;
//       users=await User.find({location:
//         { 
//                 $near: {
//                   $geometry: {
//                     type : "Point",
//                        coordinates:[
//                         req.body.long,
//                         req.body.lat
//                         ]
//                 },
//                 $maxDistance: req.body.mile/111.12
//              } 
//         },age:{$gte:18, $lte:age},...req.body
//       })
//     }
//     else if(req.body.mile && req.body.age && req.body.religion && req.body.qualification){
//       const age = req.body.age;
//       delete req.body.age;
//       users=await User.find({location:
//         { 
//                 $near: {
//                   $geometry: {
//                     type : "Point",
//                        coordinates:[
//                         req.body.long,
//                         req.body.lat
//                         ]
//                 },
//                 $maxDistance: req.body.mile/111.12
//              } 
//         },age:{$gte:18, $lte:age},
//         religion: {$in: [req.body.religion]},
//         qualification: {$in: [req.body.qualification]},
//         ...req.body
//       })
//     }
//     else if(req.body.mile){
//       users=await User.find({location:
//         { 
//                 $near: {
//                   $geometry: {
//                     type : "Point",
//                        coordinates:[
//                         req.body.long,
//                         req.body.lat
//                         ]
//                 },
//                 $maxDistance: req.body.mile/111.12
//              }, 
//         },
//         ...req.body
//       })
//     }
//     else if(req.body.mile&& req.body.religion && req.body.qualification){
//       users=await User.find({location:
//         { 
//                 $near: {
//                   $geometry: {
//                     type : "Point",
//                        coordinates:[
//                         req.body.long,
//                         req.body.lat
//                         ]
//                 },
//                 $maxDistance: req.body.mile/111.12
//              }, 
//         },
//         religion: {$in: [req.body.religion]},
//         qualification: {$in: [req.body.qualification]},
//         ...req.body
//       })
//     }
//     else if(req.body.age){
//     const age = req.body.age;
//     delete req.body.age;
//       users = await User.find({
//         age:{$gte:18, $lte:age},
//         ...req.body
//       })
//     }
//     else if(req.body.age && req.body.religion && req.body.qualification){
//       const age = req.body.age;
//       delete req.body.age;
//         users = await User.find({
//           age:{$gte:18, $lte:age},
//           religion: {$in: [req.body.religion]},
//           qualification: {$in: [req.body.qualification]},
//           ...req.body
//         })
//     }
//     else if(req.body.religion && req.body.qualification){
//         users = await User.find({
//           religion: {$in: [req.body.religion]},
//           qualification: {$in: [req.body.qualification]},
//           ...req.body
//         })
//     }
//     else{
//       users=await User.find(req.body);
//     }
//     let liked = await likes.find({from_userid:ObjectId(req.params.id)},{to_userid:1,_id:0});
//     liked.push({to_userid:ObjectId(req.params.id)});
//     const itemsToRemove = liked.map(a => a.to_userid.toString());
//     let result = users.filter(a => !itemsToRemove.includes(a._id.toString()));

//     res.status(200).json(success('filtered users', {result}, res.statusCode));
//   }
//   catch (err) {
//     return res.status(500).json(ErrorHandler(err.message, 500));
//   }

// }

// upload userpProfile Images
// exports.uploadImages = async (req, res, next) => {
//   console.log("====",req.fileurl);
//   console.log("rreq.files", req.files)
//   try {
//     var images = new userGallery({
//       image: req.fileurl,
//       userid: req.body.userid
//     })
//     let dbResponse= await images.save()
//         res.status(200).json(success('image uploaded successfully', {dbResponse}, res.statusCode));
       
//   } catch (error) {
//     return res.status(500).json(ErrorHandler(error.message, 500));
//   }
  
// }

// exports.uploadVideos = async (req, res, next) => {
//   console.log("====",req.fileurl);
//   // console.log("rreq.files", req.files)
//   try {
//     var videos = new userGallery({
//       video: req.fileurl,
//       userid: req.body.userid
//     })
//     let dbResponse= await videos.save()

//         res.status(200).json(success('video uploaded successfully', {dbResponse}, res.statusCode));
     
//   } catch (error) {
//     return res.status(500).json(ErrorHandler(error.message, 500));
//   }
  
// }

// exports.getUserFiles = async (req, res, next) => {
//   try {
//     const user = await userGallery.find({userid:req.params.id});

//   res.status(200).json({
//     success: true,
//     user,
//   });
//   } catch (error) {
//     return res.status(500).json(ErrorHandler(error.message, 500));
//   }
// };

// exports.findLocationNearMe = async  (req,res,next)=> {
//    const response = await User.find({
//     location: 
//       { 
//               $near: {
//                 $geometry: {
//                   type : "Point",
//                      coordinates:[
//                       req.body.long,
//                       req.body.lat
//                       ]
//               },
//               $maxDistance: 5/111.12
//            } 
//       }
//     }).exec();
//     res.status(200).json({
//       success: true,
//       "length":response.length,
//       response,
//     });
// };

exports.getAllusers= async (req, res)=>{
  try{
          const users = await  User.find({
            $and:[{_id: {$ne:req.params.id}}]
          });
          if(users.length){
              res.status(200).json(success('all users', {users}, res.statusCode));
          }
          else{
              return res.status(404).json(ErrorHandler("users not found", 404));
          }
      }
  catch{
      res.status(404).send("An error occured")
  }    

};
