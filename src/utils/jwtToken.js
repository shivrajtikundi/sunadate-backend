const dotenv = require('dotenv');
dotenv.config({path:'../../config.env'});
const sendToken =  async (user, statusCode,res) => {
  const token =  user.getJWTToken();
// options for cookie
const options = {
  expires: new Date(
    Date.now() + process.env.COOKIE_EXPIRE *24 *60 *60 *1000
    ),
  httpOnly: true,
};
  console.log("user",user);
res.status(statusCode).header("token",token,options).json({
  success: true,
  user,
  token,
 });
 
}
module.exports = sendToken; 