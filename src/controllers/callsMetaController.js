const audioCallsMeta = require("../models/callsMeta");
const { ErrorHandler } = require("../utils/errorhandler");
const { success } = require("../utils/success");

exports.getCallsMetaByUserId = async (req, res) =>{
    try {
        if (!req.params.id) {
            return res.status(400).json(ErrorHandler({message:"userId Not Present"}, 400));
        }else{
            const result = await audioCallsMeta.find({from : req.params.id})
            res.status(200).json(success('result', {result}, res.statusCode));  
        }
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
}
