const Agora = require("agora-access-token");
const audioCallsMeta = require("../models/callsMeta");
const { ErrorHandler } = require("../utils/errorhandler");
const redisClient = require("../utils/redisClient");
const { success } = require("../utils/success");

const PRIMARY_CERTIFICATE= process.env.AGORA_PRIMARY_CERTIFICATE
const APP_ID= process.env.AGORA_APP_ID

exports.getAgoraToken = async (req, res, next) => {
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
    const role = Agora.RtcRole.PUBLISHER
    const channel = Math.floor(10000000 + Math.random() * 90000000).toString()
    const userAccount = req.body.to;
    const callType = req.body.callType
    try {
        const callsMetaRes = await new audioCallsMeta({
            from : req.body.from,
            to : req.body.to,
            callType : req.body.callType,
        })
        await callsMetaRes.save()
        const token = Agora.RtcTokenBuilder.buildTokenWithAccount(APP_ID, PRIMARY_CERTIFICATE , channel, userAccount, role, expirationTimestamp);
        const dataCred = {callType, channel, token}
        redisClient.set(userAccount, JSON.stringify(dataCred))
        // res.status(200).send({ channel, token, callType})
        res.status(200).json(success('result', { channel, token, callType}, res.statusCode));  

    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
    
};

exports.getCallTokens = async (req, res, next) =>{
    try {
       
        const data = await redisClient.get(req.params.id).then((data) => {
            return data;
        })
        // res.status(200).json(data);
        res.status(200).json(success('data', { data}, res.statusCode));  
    } catch (error) {
        return res.status(500).json(ErrorHandler(error.message, 500));
    }
   
}
