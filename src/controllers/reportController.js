const reportSchema=require("../models/reportSchema");
const { ErrorHandler } = require("../utils/errorhandler");
const { success } = require("../utils/success");


exports.reportUser=async (req,res)=>{
    try{
        const report = await new reportSchema({
            from_userid:req.body.from_userid,
            to_userid:req.body.to_userid,
            description:req.body.description,
            email:req.body.email,
            name:req.body.name,
        });
        await report.save();
        res.status(201).json(success('user report', {report}, res.statusCode));  
    }
    catch(e){
        return res.status(500).json(ErrorHandler(e.message, 500));
    }
};