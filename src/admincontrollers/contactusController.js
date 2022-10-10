const contactus = require("../models/contactusSchema")

exports.postContactusdetails = async (req,res) =>{
    try {
        const content = new contactus (req.body)
        await content.save()
        res.status(200).send(content)
    } catch (error) {
        res.status(401).send(error.message)
    }
}


exports.getContactusdetails = async (req, res) =>{
    try{
        const content = await contactus.find()
        res.status(200).send(content);
    }
    catch (error) {
        res.status(400).send(err)
    }
}

exports.updateContactusdetails = async (req, res) =>{
    try{
        console.log("contact update:: ",req.body);
        const content = await contactus.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send(content);
    }
    catch (error) {
        res.status(400).send(err)
    }
}

exports.deleteContactusdetails = async (req, res) =>{
    try {
        const  content = await contactus.find(req.params.id)
       await content.remove()
       res.status(200).send("deleted successfully")
    } catch (error) {
        res.status(400).send("something went wrong")
    }
}