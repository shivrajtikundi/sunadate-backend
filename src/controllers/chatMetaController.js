const chatMeta = require("../models/chatMeta");
const { ErrorHandler } = require("../utils/errorhandler");
const { success } = require("../utils/success");

exports.getChatsMeta = async (req, res) =>{
    try {
        if (!req.params.userId1 && !req.params.userId2) {
            console.log("error hit")
            return res.status(400).json(ErrorHandler({message:"userId Not Present"}, 400));
        }else{
            console.log("succes hit")
            const result = await chatMeta.find({$or: [{ sender: req.params.userId1, receiver: req.params.userId2 }, { receiver: req.params.userId2, sender: req.params.userId1 }]});
            res.status(200).json(success('result', {result}, res.statusCode));  
        }
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
}
