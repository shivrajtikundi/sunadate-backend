const express = require('express');
const router=express.Router();
const fileupload = require('express-fileupload')

const {adminAuth} = require('../middleware/auth')
const {roleAuth} =require('../middleware/roleAuth')

const  { register, login, forgotPassword ,logout ,
        resetPassword,getAllmoderators,deleteModerator,
        editAdminDetails,updatePassword,editAdminProfile
        ,getAdminUserDetails}=require('../admincontrollers/adminController')

const  { totalUsers,registeredToday ,onlineUsers} = require("../admincontrollers/dashboardController")

const  { getAllusers ,getUserDetails,deleteUser,editUserDetails ,
        getUserImages,getUserVideos,limituserFiles,getuserlimit,
        getuserResponse,deleteUserfile, blockUserImage, searchUser,
        sortBydate,pagination,getAllUserPagination,updateBlockeduser,
        getallBlockedusers} = require("../admincontrollers/manageUsersController")

const  { getQuestionByNo,getAllQuestion,deleteQuestion,updateQuestion,createQuestion } = require("../admincontrollers/questionaireController")
const  { countryDetails ,getAllCountryDetails,deleteCountry,updateStatus,findCountry,countrySearchAndPaginate,uploadCountryFile} = require("../admincontrollers/countryController")
const  { postContent ,getcontent ,updatecontent,getAllcontent,deleteContent} = require ("../admincontrollers/contentManagementController")
const  { postContactusdetails,getContactusdetails, updateContactusdetails, deleteContactusdetails } = require("../admincontrollers/contactusController")
const  { postFaq,getFaq,updateFaq ,getAllfaqcontent,deletefaqContent} = require("../admincontrollers/faqController")
const  { getAllreports,getReport,deleteReport,updateReportById ,reportPagination,searchReport}= require("../admincontrollers/reportUserController")

//validations

const { adminvalidations } = require("../validations/adminValidations");
const { validations } = require("../validations/contentValidation");
const { questionaire } = require("../validations/questionValidation");
const { uservalidations } = require("../validations/manageUserValidations");
const { reportvalidations } =require('../validations/reportSchemaValidate');
const { contact_usvalidations } = require('../validations/contactusValidation');
const { faqValidations } = require('../validations/faqValidations')
router.use(fileupload({
        limits: { fileSize: 5 * 1024 * 1024 }
}
));

router.route("/roleAuth").get(roleAuth);

router.route("/").post( adminvalidations.CreateUserValidate, register );

router.post("/login",adminvalidations.login,login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/logout").get(logout);

router.route("/resetPassword").put(resetPassword);

router.route('/user/:id').get(getAdminUserDetails)

router.route("/getAllmoderators").get(getAllmoderators);

router.route("/edituser/:id").patch(editAdminDetails);
//Admin/Editor

router.route("/editProfile/:id").patch(editAdminProfile);

router.route("/deletemoderators/:id").delete(adminvalidations.deleteUserValidate,deleteModerator);
//Admin/Editor
router.route("/updatePassword/:id").put(updatePassword);
//Admin/Editor
router.route("/updateBlockeduser/:id").put(updateBlockeduser);

router.route("/getallBlockedusers").get(getallBlockedusers);


//dashboard routes
router.route("/totalUsers").get(totalUsers);

router.route("/registeredToday").get(registeredToday);

router.route("/onlineUsers").get(onlineUsers);

//user management routes

router.route("/getAllusers").get(getAllusers);

router.route("/getUserById/:id").get(uservalidations.userIdvalidate,getUserDetails);

router.route("/getUserImages/:id").get(uservalidations.userIdvalidate,getUserImages);
//Admin/Editor
router.route("/blockUserImage/:id").put(uservalidations.userIdvalidate,blockUserImage);

router.route("/getUserVideos/:id").get(uservalidations.userIdvalidate,getUserVideos);
//Admin/Editor
router.route("/deleteUserfile/:id").delete(uservalidations.userIdvalidate,deleteUserfile);

router.route("/getuserResponse/:id").get(uservalidations.userIdvalidate,getuserResponse);

router.route("/searchUser").get(searchUser);

router.route("/sortBydate").get(sortBydate);

router.route("/userpage").get(pagination);
//Admin/Editor
router.route("/deleteUser/:id").delete(uservalidations.userIdvalidate,deleteUser);
//Admin/Editor
router.route("/limituserFiles").post(uservalidations.limifilesvalidate,limituserFiles); 
//Admin/Editor
router.route("/limituserFiles/:id").get(uservalidations.userIdvalidate,getuserlimit);
//Admin/Editor
router.route("/editUserDetails/:id").put(editUserDetails);

router.route("/getAllUserByPage").get(getAllUserPagination);



//questionaire management routes
//Admin/Editor
router.route("/addQuestion").post(createQuestion);

router.route("/getAllQuestion").get(getAllQuestion);

router.route("/getQuestionByNo/:questionNo").get(getQuestionByNo);
//Admin/Editor
router.route("/question/:id").put(updateQuestion);
//Admin/Editor
router.route("/question/:id").delete(deleteQuestion);


//country management routes
//Admin/Editor
// router.route("/countries").post(countryDetails)
//Admin/Editor
// router.route("/uploadCountryFile").post(uploadCountryFile)

// router.route("/getcountries").get(getAllCountryDetails)
//Admin/Editor
// router.route("/deleteCountry/:id").delete(deleteCountry)
//Admin/Editor
// router.route("/updateStatus/:id").put(updateStatus)

// router.route("/searchCountry").get(findCountry);

// router.route("/getAllCountry").get(countrySearchAndPaginate);
//registerContent management routes
//Admin/Editor
router.route("/registerContent").post(validations.create_validation ,postContent)

router.route("/getContent/:_id").get(getcontent)
//ADMIN
router.route("/updatecontent/:id").patch(updatecontent)

router.route("/getAllcontent").get(getAllcontent);
//ADMIN
router.route("/deleteContent/:id").delete(validations.validateid,deleteContent);


//contactus controllers routes
//ADMIN
router.route("/postContactusdetails").post(contact_usvalidations.create_validation,postContactusdetails)

router.route("/getContactusdetails").get(getContactusdetails)
//ADMIN
router.route("/updateContactusdetails/:id").put(contact_usvalidations.update_validation,updateContactusdetails)

// router.route("/deleteContactusdetails/:id").delete(deleteContactusdetails)

//faq controller  routes
//ADMIN
router.route("/postFaq").post(faqValidations.create_validation,postFaq);

router.route("/getFaq/:id").get(faqValidations.validateid,getFaq);
//ADMIN
router.route("/updateFaq/:id").patch(updateFaq);

router.route("/getAllfaqcontent").get(getAllfaqcontent);
//ADMIN
router.route("/deletefaqContent/:id").delete(faqValidations.validateid,deletefaqContent);


//report management routes
router.route("/getReport/:id").get(reportvalidations.repport_id,getReport);

router.route("/getAllreports").get(getAllreports);
//ADMIN
router.route("/deleteReport/:id").delete(reportvalidations.repport_id,deleteReport);
//Admin/Editor
router.route("/updateReportById/:id").patch(reportvalidations.update,updateReportById);

router.route("/reportpage").get(reportPagination)

router.route("/searchReport").get(searchReport)


module.exports = router;