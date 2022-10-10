const Admin = require("../models/adminSchema");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const { ErrorHandler } = require('../utils/errorhandler');
const bcrypt = require('bcryptjs');
const { success } = require("../utils/success");


//Admin register
exports.register = async (req, res) => {
  try {
    const validatedData = req.validatedData;
    const admin = await Admin.findOne({ email: validatedData.email });

    if (admin) {
      return res.status(400).send('That user already exist')
    }
    console.log("admin :: ", req.validatedData)
    const newAdmin = new Admin(req.validatedData);
    const created_admin = await newAdmin.save();
    res.status(200).send(created_admin);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.validatedData;

  try {
    const user = await Admin.findOne({ email }, { password: 1, role: 1, username:1 ,email:1 });
    if (!user) {
      return res.status(401).json(ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json(ErrorHandler("Invalid password", 401));
    }

    sendToken(user, 200, res);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" })
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await Admin.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json(ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  console.log("user after   change ", user);
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

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

    return res.status(500).json(ErrorHander(error.message, 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  console.log("req-------", req.body);
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");


  const user = await Admin.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })


  if (!user) {
    return res.status(400).json(ErrorHander("Reset Password Token is invalid or has been expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json(ErrorHander("Password does not Matched", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

};

exports.getAdminUserDetails = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id)
    if (user) {
      res.status(200).send(user)
    }
    else{
      res.status(404).send("user does not exist")
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.getAllmoderators = async (req, res, next) => {
  try {
    let role= req.query.role;
    let searchField = req.query.username;
    const { page = 1, limit = 10 } = req.query;
    var admins;
    var allAdmins;

    if (searchField) {
      admins = await Admin.find({ username: { $regex: searchField, $options: '$i' } })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }
    else if (role){
      admins = await Admin.find({ role })
                .limit(limit * 1)
                .skip((page - 1) * limit);
    }
    else {
      admins = await Admin.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    allAdmins = await Admin.find();


    res.status(200).json({ "total": admins.length, "totalCount": allAdmins.length, admins, searchField });

  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.deleteModerator = async (req, res, next) => {
  try {
    const deleteone = await Admin.findByIdAndDelete(req.params.id)
    res.status(200).send(deleteone);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.updatePassword= async (req, res, next) => {
  try{
    console.log("req-------",req.params);
    const {password,confirmPassword} = req.body;
    if(password!=confirmPassword){
      return res.status(401).json(ErrorHandler("Password and confirmPassword does not Matched", 401));
    }
    else
    {
      const user = await Admin.findByIdAndUpdate(req.params.id,{
        password:await bcrypt.hash(password, 12), 
        confirmPassword:await bcrypt.hash(confirmPassword, 12)
      })
      console.log("user",user);
    await user.save()
      res.status(200).json(success('OK', {user}, res.statusCode));
    }
}
  catch(error){
    return res.status(500).json(ErrorHandler(error.message, 500));
  }
}
// exports.updatePassword=




exports.editAdminDetails = async (req, res) => {
  try {
    // const validationResult = updateUserSchema.validate(req.body)
    const editAdmin = await Admin.findByIdAndUpdate(req.params.id,{ 
      ...req.body, 
      password: await bcrypt.hash(req.body.password, 12),
      confirmPassword: await bcrypt.hash(req.body.confirmPassword, 12)
    });
    res.status(200).send(editAdmin)
  }
  catch (err) {
    console.log("error", err);
    res.status(404).send({ error: err });
  }

}

exports.editAdminProfile = async (req, res) => {
  try {
    // const validationResult = updateUserSchema.validate(req.body)
    const editAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body);
    await editAdmin.save();
    res.status(200).send(editAdmin)
  }
  catch (err) {
    console.log("error", err);
    res.status(404).send({ error: err });
  }

}