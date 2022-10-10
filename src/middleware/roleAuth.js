const adminUser = require('../models/adminSchema')
const jwt = require('jsonwebtoken');

exports.roleAuth = async (req, res, next) => {
    let token = req.headers.token

    const decodedData = jwt.verify(token,'test');
        console.log("decodedData",decodedData);
        user = await adminUser.findById(decodedData.id);
    let data =user.role;

    if(data == "Editor" || data == "Admin"){
        next()
    }
    else {
        res.status(401).send("you don't have permission")
    }
}