const User = require("../models/userSchema");
const blockeduser = require ("../models/reportSchema")

exports.authblockeduser = async (req, res, next) => {

     try {
        let user = await User.findOne({ email: req.body.email});
        let authuser = await blockeduser.findOne({email:req.body.email})

        if(user.email === authuser.email) 
            {
                if(authuser.status=true){
                    console.log("user.email === authuser.email ",user.email === authuser.email );
                    res.status(401).send("user is not authorized")
                }
            } 
            else
            {
                next()
            }
    }
      catch (error) {
        console.log(error)
        res.send(error.message)
    }
}