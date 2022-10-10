const express = require('express');
const router=express.Router();
 const {uploadFileToAws,uploadFilesToAws} = require('../utils/fileUploader')
const fileupload = require('express-fileupload')

const {auth} = require('../middleware/auth')
const { authblockeduser } =  require('../middleware/authblockeduser')
const { limitImages,limitVideos} = require('../middleware/limituserfiles')

const { userValidate } = require("../validations/userValidation")
const { questionaire } = require("../validations/questionValidation")

const { register ,login,getAllusers, forgotPassword, logout,uploadVideos, resetPassword, getUserDetails ,uploadImages,updateUser,getUserFiles,deleteUserfile,filterusers,findLocationNearMe,updatePassword}= require('../controllers/userController');
const { createQuestion , getAllQuestion,updateQuestion ,deleteQuestion,getQuestionByNo}=require("../controllers/questionController")
const { createUserAnswer , getuserResponse ,updateResponse ,deleteResponse}= require("../controllers/userResponseController")
const { postliikes ,getlikesbyusers,getamatchbyusers, updateLikeViewStatus, getNotLikedUsers,rejectUser,getAllmatches}=require("../controllers/userlikesController")
const { postrequest, getrequest ,updateRequest} =require("../controllers/friendrequestController")
const { reportUser,reportCount } = require("../controllers/reportController");
const { profileVisitsCount } = require('../controllers/profileVisitsController');
const {getAgoraToken, getCallTokens} = require("../controllers/agoraController")
const {tokenValidation} = require("../validations/tokenValidation")
const {getCallsMetaByUserId} = require("../controllers/callsMetaController")
const {getChatsMeta} = require("../controllers/chatMetaController")
const { sendOtp,verifyOtp } =require('../controllers/verifyProfileController')

//validations
const { reportvalidations } = require('../validations/reportSchemaValidate')
const { friendrequest  } = require('../validations/friendRequestValidations')
const { responceValidations } = require('../validations/userResponseValidation')
const { likesvalidations } = require('../validations/likesValidations')
router.use(fileupload({
limits: {fileSize:5 * 1024 * 1024 }}
));

//UserRoutes
router.route('/register').post(userValidate.create,register);

router.route('/updateuser/:id').put(userValidate.paramsID,userValidate.update,updateUser);

// router.route('/userprofile/:id').put(userValidate.paramsID,userValidate.update,auth,uploadFileToAws,updateUser)

router.post('/login', userValidate.login,login);

router.get('/getAllusers/:id',getAllusers);

// router.post('/filterusers/:id',auth,filterusers);

router.route("/logout").get(auth,logout);

router.route("/forgot").post(userValidate.forgotPassword,forgotPassword);

router.route("/password/reset/:token").put(userValidate.resetPassword,resetPassword);

// router.route("/userdetails/:id").get(userValidate.paramsID,auth,getUserDetails);

// router.route("/uploadImage").post(userValidate.addUserfile,auth,uploadFileToAws,uploadImages); //upload file in s3 bucket

// router.route("/uploadVideo").post(userValidate.addUserfile,auth,uploadFileToAws,uploadVideos);//upload file in s3 bucket

// router.get("/userfiles/:id",userValidate.paramsID,auth,getUserFiles);

// router.route("/deleteUserfile/:id").delete(userValidate.paramsID,auth,deleteUserfile);

router.route("/updatePassword/:id").put(userValidate.updatepassword,auth,updatePassword);


//Questionroutes
// router.post("/question",questionaire.question_validate,createQuestion);

// router.post("/question",uploadFilesToAws,createQuestion);

// router.get("/ques/:questionNo",getQuestionByNo);

// router.route("/question").get(getAllQuestion);


// router.route("/question/:id").put(updateQuestion);

// router.route("/question/:id").delete(deleteQuestion);

//Answerroutes
// router.route("/answer").post(responceValidations.create,createUserAnswer);

// router.route("/answer/:id").get(responceValidations.Id,getuserResponse);

// router.route("/answer/:id").put(updateResponse);

// router.route("/answer/:id").delete(deleteResponse);

//userLikes
// router.route("/like").post(likesvalidations.create,auth,postliikes);

// router.route("/getlikes/:id").get(likesvalidations.get,auth,getlikesbyusers);

// router.route("/match").get(getamatchbyusers);

// router.route("/updateLikeStatus/:id").patch(updateLikeViewStatus);

// router.route("/notLikedUser/:id").get(getNotLikedUsers);

// router.route("/rejectUser/:id").post(rejectUser);

// router.route("/getAllmatches/:id").get(auth,getAllmatches);


//friendrequest
// router.route("/friendrequest").post(friendrequest.Create,postrequest);

// router.route("/getfriendrequest/:id").get(friendrequest.validId,getrequest);

// router.route("/updateRequest/:id").put(updateRequest);

// video || audio chat app
// router.post("/rtctoken", tokenValidation ,getAgoraToken)

// router.route("/getCallToken/:id").get(getCallTokens)

// router.route("/getCallHistory/:id").get(getCallsMetaByUserId)

// router.route("/location-near-me-find").post(findLocationNearMe);



// router.route("/getChatHistory/:userId1/:userId2").get(getChatsMeta);

//mobile otp verification
// router.route("/sendOtp").get(auth,sendOtp);

// router.route("/verifyOtp").get(auth,verifyOtp);

//reportuser
// router.route("/report").post(reportvalidations.repport_validation,reportUser)

//profile Visitor 
// router.route("/profilevisit").post(profileVisitsCount);


module.exports= router;
