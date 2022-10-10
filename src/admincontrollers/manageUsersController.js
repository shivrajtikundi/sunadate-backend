const user = require("../models/userSchema");
const userGallery = require("../models/userGallerySchema");
const limitFiles = require("../models/limitfilesSchemas");
const Answer = require("../models/answerSchema")
exports.getAllusers= async (req, res)=>{
    try{
            const users = await  user.find({
                
            });
            if(users.length){
                res.status(200).json(users);
            }
            else{
                res.status(404).json("users not found");
            }
        }
    catch{
        res.status(404).send("An error occured")
    }    

}

exports.getUserDetails= async (req, res) =>{
    try{    
    const userDetails = await user.findById(req.params.id);
        console.log("req-------", userDetails)
      
        res.status(200).json({
          success: true,
          userDetails,
        });
    }
    catch{
        res.status(400).send("user does not exist")
    }
}

exports.getuserResponse = async (req, res) => {
    console.log(req.params);
    const answer = await Answer.find({userid:req.params.id});
    console.log('ANSWER',answer);
    res.status(200).send(
      {answer}
    );
    
  };


exports.deleteUser= async(req, res, next)=>{
    try {
         await user.findByIdAndDelete(req.params.id)
        res.status(200).send("user deleted succesfully")
    } catch (error) {
        res.status(401).send(error.message)
    }
}

exports.editUserDetails = async (req, res)=>{
        try {
          // const validationResult = updateUserSchema.validate(req.body)
          const edituser = await user.findByIdAndUpdate(req.params.id, req.body);
          edituser.save()
          res.status(200).send(edituser)
        }
        catch (err) {
          console.log("error", err);
          res.status(404).send({ error: err });
        }
      
}

exports.getUserImages = async (req, res, next) => {
    try {
        const user = await userGallery.find({ userid: req.params.id,image:{$exists:true} });
        res.status(200).json({
        user,
        });
    } catch (error) {
        res.status(500).json({"message":error.message})
    }
};

exports.blockUserImage = async (req, res, next) => {
    console.log("res----",req.body);
    try {
        const gallery = await userGallery.findByIdAndUpdate( req.params.id ,{ blocked: req.body.blocked });
        res.status(200).json({ gallery });
    } catch (error) {
        res.status(500).json({"message":error.message})
    }
}

exports.getUserVideos = async (req, res, next) => {
    try {
      const user = await userGallery.find({ userid: req.params.id,video:{$exists:true} });
    res.status(200).json({
      user,
    });
    } catch (error) {
      res.status(500).json({"message":error.message})
    }
};

exports.deleteUserfile = async (req, res, next)=>{
    try
    {
        const userFile = await userGallery.findByIdAndDelete(req.params.id)
        res.status(200).json({
            userFile
        })
    }catch (error) {
        res.status(500).json({message:error.message})
    }
}


exports.limituserFiles = async (req,res,next) => {
    try {
        const limit = new limitFiles(req.body)
        await limit.save();
        res.status(200).send(limit);
    } catch (error) {
        res.status(401).json({"message":error.message})
    }
}

exports.getuserlimit = async (req, res, next) => {
    try{
        const limit = await limitFiles.find({userid:req.params.id})
        res.status(200).send(limit);
        console.log("limit", limit[0].i_limit);
        
    }
    catch(err){
        res.status(401).json({"message":err.message})
    }
}

exports.updateBlockeduser = async (req , res , next) => {
    try {
        // let count;
        const {isBlocked}=req.body;
        // const userid = await user.findById(req.params.id);
        // const {blockCount}=userid;
        if(isBlocked===true){
        const blockuser = await user.findByIdAndUpdate(req.params.id,{
            isBlocked:req.body.isBlocked,
            $inc:{blockCount:1}
        },{ new: true })
        res.status(200).send(blockuser)
        }
        else{
            const blockuser = await user.findByIdAndUpdate(req.params.id,req.body)
            res.status(200).send(blockuser)
        }
    } catch (error) {
        res.status(401).send(error.message)
    }
}

exports.getallBlockedusers= async (req, res, next) => {
    try {
        let searchField = req.query.firstname;
        const { page = 1, limit = 10 } = req.query;
        var User;
    
        if (searchField) {
          User = await user.find({isBlocked:true, firstname: { $regex: searchField, $options: '$i' } })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        }
        else {
          User = await user.find({"isBlocked":true})
            .limit(limit * 1)
            .skip((page - 1) * limit);
        }
        
        const users = await user.find({"isBlocked":true})
        res.status(200).send({"totalUsers":users.length, User,"count":User.length})
    } catch (error) {
        res.status(400).send(error.message)
    }
}
//search user api

exports.searchUser = async(req,res)=>{
    try{
        let searchField = req.query.firstname;
        const users = await user.find({firstname:{$regex:searchField ,$options:'$i'}});
        res.status(200).send(users);
    }
    catch(error){
        res.status(500).send(error.message)
    }
   
}

exports.sortBydate = async(req,res)=>{
    try{
        const users = await user.find({}).sort({ createdAt: -1}).exec();

        res.status(200).send(users);
    }
    catch(error){
        res.status(500).send(error.message)
    }
   
}



exports.pagination = async (req,res,next)=>{
    try{
        const { page = 1, limit = 10 } =req.query;
        const users = await user.find()
        .limit(limit * 1)
        .skip((page -1) * limit);
        console.log(users);
        res.status(200).json({ "total":users.length , users });

    }catch(error){
        res.status(500).send(error.message)
    }
}


exports.getAllUserPagination = async (req, res, next) => {
    try {
        let searchStatus = req.query.isBlocked;
      let searchField = req.query.firstname;
      const { page = 1, limit = 10 } = req.query;
      var users;
      var totalUsers;
  
      if (searchField) {
        users = await user.find({ firstname: { $regex: searchField, $options: '$i' } })
          .limit(limit * 1)
          .skip((page - 1) * limit);
      }
      else if(searchStatus)
      {
        users = await user.find({ isBlocked: searchStatus })
          .limit(limit * 1)
          .skip((page - 1) * limit);
      }
      else {
        users = await user.find()
          .limit(limit * 1)
          .skip((page - 1) * limit);
      }
  
      totalUsers = await user.find();
  
  
      res.status(200).json({ "total": users.length, "totalCount": totalUsers.length, users, searchField });
  
    } catch (error) {
      res.status(500).send(error.message)
    }
  }