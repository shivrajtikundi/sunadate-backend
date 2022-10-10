const registerContent = require("../models/registerContentSchema")
var ObjectId = require('mongodb').ObjectID;

exports.postContent = async (req,res) => {
   try{
       const content = new registerContent (req.body)
      await content.save(content)
      res.status(200).send(content)

   }catch(err){
       res.status(401).send(err.message)
   }
}

exports.getcontent = async (req,res) => {
    try{
        const content = await registerContent.find({id:ObjectId(req.params._id)})
            res.status(200).send(content)
            console.log("content",content);
        }
        
    catch(err){
        res.status(401).send(err)
    }
}

exports.updatecontent = async (req,res) =>{
    try {
        const content = await registerContent.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send(content)
    }
catch(err){
    res.status(401).send(err)
}
}

exports.getAllcontent = async (req,res) => {
try {
    const content = await registerContent.find();
    console.log(content);
    res.status(200).send(content);
} catch (error) {
    res.status(404).send(error.message)
}
}

exports.deleteContent = async(req,res) => {
    try {
        const deleteContent = await registerContent.findByIdAndDelete(req.params.id)
        res.status(200).send(deleteContent);
    } catch (error) {   
        res.status(404).send(error.message)
    }
}