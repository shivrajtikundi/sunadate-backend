const fileUploadService = require("../service/uploadFileservice")


exports.uploadFilesToAws= async (req, res, next) => {
  try{
    console.log("AWS------------FILES-----------",req.files);
    if(req.files && req.files.image){
        const file= req.files.image;
        
        console.log("FILES --->",file);
        if (Array.isArray(file)) {
            var responce=file.map(async (item)=>{
                 const uploadRes = await fileUploadService.uploadFileToAws(item);
                 console.log("uploadRes",uploadRes);
                 req.fileurl=uploadRes.fileUrl;
                 return uploadRes;
                })
                req.options=await Promise.all(responce);
                console.log("req.options",req.options);
                console.log("responce",await Promise.all(responce));
                next()
        } else {
            const uploadRes = await fileUploadService.uploadFileToAws(file);
             req.fileurl=uploadRes.fileUrl;
             next();
        }
    }
    else if(req.files && req.files.video){
        const file= req.files.video;
        const uploadRes = await fileUploadService.uploadFileToAws(file);
        req.fileurl=uploadRes.fileUrl;
        next()
    }
    else{
       res.status(404).send('FILES_NOT_FOUND')
    }
} catch(error){
    return next(error);
}
}
exports.uploadFileToAws= async (req, res, next) => {
    try{
  
      if(req.files && req.files.image){
          const file= req.files.image;
          const uploadRes = await fileUploadService.uploadFileToAws(file);
          req.fileurl=uploadRes.fileUrl;
          next()
      }
      else if(req.files && req.files.video){
          const file= req.files.video;
          const uploadRes = await fileUploadService.uploadFileToAws(file);
          req.fileurl=uploadRes.fileUrl;
          next()
      }
      else{
         res.status(404).send('FILES_NOT_FOUND')
      }
  } catch(error){
      return next(error);
  }
  }