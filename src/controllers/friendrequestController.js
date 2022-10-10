const friendrequest=require("../models/friendrequestSchemas");
const { ErrorHandler } = require("../utils/errorhandler");
var ObjectId = require('mongodb').ObjectID;
const { success } = require("../utils/success");

exports.postrequest=async (req,res)=>{
    try{
        const frequest = await new friendrequest({
            from_userid:req.body.from_userid,
            to_userid:req.body.to_userid
        });
        await frequest.save();
        res.status(201).json(success('friend request', {frequest}, res.statusCode));  
    }
    catch(e){
      return res.status(500).json(ErrorHandler(e.message, 500));
    }
  };


exports.getrequest= async (req,res) => {
    try{
        let pipeline= [
            {
           $match: { to_userid: ObjectId(req.params.id) }
            },
            {
            $lookup:
              {
                from: "users",
                localField: "from_userid",
                foreignField: "_id",
                as: "userRequest"
              }
              }
         ];
         const users = await friendrequest.aggregate(pipeline);
         res.status(200).json(success('friend request', {users}, res.statusCode));  
    }
    catch(e){
      return res.status(500).json(ErrorHandler(e.message, 500));
    }
}

exports.updateRequest= async (req, res) => {
      try {
        let changeStatus = await friendrequest.findOneAndUpdate({id: ObjectId(req.params.id)},req.body);
        res.status(200).json(success('friend request sattus', {changeStatus}, res.statusCode));  
      }
      catch (err) {
        return res.status(500).json(ErrorHanderHander(err.message, 500));
      }
  };