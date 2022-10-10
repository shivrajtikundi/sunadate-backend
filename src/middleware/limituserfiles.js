const userfiles = require("../models/userGallerySchema");
const limitfiles = require("../models/limitfilesSchemas");

exports.limitImages=async (req, res, next) => {
    try {
      console.log("req.body--------------------",req.body);
      const imagequery = await userfiles.find({userid:req.body.userid,image :{$exists:true}}).count();
      const limit = await limitfiles.findOne({userid:req.body.userid}) || {i_limit:2}
  
      const [imageCount] = await Promise.all([imagequery]);
      
      if(imageCount<=limit.i_limit){
          next()
      }
      else{
          res.status(406).send("user cannotupload more images")
      }
    } catch (error) {               
      console.log(error);                       
      res.status(500).json({"message":error.message})
    }
  };
//   const imagequery =  userGallery.find({userid: ObjectId(req.params.id),image :{$exists:true}}).count();
//     const videoquery =  userGallery.find({userid: ObjectId(req.params.id), video :{$exists:true}}).count();

//     const [imageCount, videoCount] = await Promise.all([imagequery, videoquery]);

exports.limitVideos=async (req, res, next) => {
  try {
    console.log("req.body--------------------",req.body);
    const videoquery = await userfiles.find({userid:req.body.userid,video :{$exists:true}}).count();
    const limit = await limitfiles.findOne({userid:req.body.userid}) || {v_limit:2}

    const [videoCount] = await Promise.all([videoquery]);
    
    if(videoCount<=limit.v_limit){
        next()
    }
    else{
        res.status(406).send("user cannotupload more videos")
    }
  } catch (error) {               
    console.log(error);                       
    res.status(500).json({"message":error.message})
  }
};