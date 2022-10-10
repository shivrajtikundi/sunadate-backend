const jwt = require('jsonwebtoken');
const Admin = require("../models/adminSchema");
const {ErrorHandler} = require('../utils/errorhandler');
const User = require('../models/userSchema');
exports.auth = async (req, res, next) => {

    const token = req.headers.token

    if(!token) {
        return res.send(ErrorHandler("Please Login to access this resource",401));
    }

    try {
        const decodedData = jwt.verify(token,'test');
       req.user = await User.findById(decodedData.id);
    
    next()
     }
      catch (error) {
        if (error) {
            error = {
                success:false,
                name: 'TokenExpiredError',
                message: 'jwt expired',
                status:401
              }
           res.status(error.status).send({message:error.message,error});
          }
        console.log(error)
    }
}

exports.adminAuth = async (req, res, next) => {

    const token = req.headers.token

    if(!token) {
        return res.send(ErrorHandler("Please Login to access this resource",401));
    }

    try {
        const decodedData = jwt.verify(token,'test');
        req.user = await Admin.findById(decodedData.id);
    
    next()
     }
      catch (error) {
        if (error) {
            error = {
                success:false,
                name: 'TokenExpiredError',
                message: 'jwt expired',
                status:401
              }
           res.status(error.status).send({message:error.message,error});
          }
    }
}