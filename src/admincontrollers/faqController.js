const faqSchema = require("../models/faqSchema")
var ObjectId = require('mongodb').ObjectID;


exports.postFaq = async (req,res) => {
   try{
       const content = new faqSchema (req.body)
      await content.save(content)
      res.status(200).send(content)

   }catch(err){
       res.status(401).send(err.message)
   }
}

exports.getFaq = async (req,res) => {
    try{
        const content = await faqSchema.find({id:ObjectId(req.params.id)})
        console.log("content",content);
            res.status(200).send(content)
        }
        
    catch(err){
        res.status(401).send(err)
    }
}

exports.updateFaq = async (req,res) =>{
    try {
        const content = await faqSchema.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send(content)
    }
catch(err){
    res.status(401).send(err)
}
}

exports.getAllfaqcontent = async (req,res) => {
    try {
        const content = await faqSchema.find();
        res.status(200).send(content);
    } catch (error) {
        res.status(404).send(error.message)
    }
    }

    exports.deletefaqContent = async(req,res) => {
        try {
            const deletefaqContent = await faqSchema.findByIdAndDelete(req.params.id)
            res.status(200).send(deletefaqContent);
        } catch (error) {   
            res.status(404).send(error.message)
        }
    }    