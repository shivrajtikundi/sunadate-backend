const io = require("../../socket").socketio;
const redisClient = require("../utils/redisClient");
const chatMeta = require("../models/chatMeta");

class SocketConnection {
  socketUserMap = null;
  socketUserMap = new Map();
  constructor(io) {
    this.io = io;
    this.connect(io);
  }

  connect(io) {
    io.on("connection", (socket) => {
      /*when new client join server
      data =userId
      */
      socket.on("NEW_CLIENT", async (userId) => {
        console.log("new clint joined", userId);
        await redisClient.set(`${userId}:C`, `${socket.id}`);
      });

      /* when message is send by client
      data={
        message:"Hello",
        receiver:"userId1",
        sender:"userId2"
      }
      */
     
      socket.on("SEND_MSG", async (data) => {
        await this.sendToClient(data);
        console.log(data);
      });


      /* To save all messages from redis to mongodb
      data={
        to:"userId",
        from:""
      }*/
      // socket.on("SAVE_MSGS_DB",async (data)=>{
      //   let chatId;                                                  // create chatId for redis
      //   if (data.to > data.from) {chatId = `${data.to}:${data.from}`}
      //   else {chatId = `${data.from}:${data.to}`}      
      //   let msgList= await this.getMessagesFromRedis(chatId);
      //   await this.saveMessageToMongoDB(msgList,chatId);
      // })


    });
    console.log("STARTING SOCKET CONNECTION");
  }


  async sendToClient(data) {
    console.log("send to client", data.receiver);
    var socketId = await redisClient
      .get(`${data.receiver}:C`)
      .then((res) => {
        return res;
      })
      

    if (socketId) {
      console.log("SENDING MESSAGE TO CLIENT", data.message);
      await this.io.to(socketId).emit("RECIEVE_MESSAGE", data);        
      await this.saveMessageToMongoDB(data);
     
    }else{
      console.log("reciver not found on redis");
      await this.saveMessageToMongoDB(data);
      }

    }

    async saveMessageToMongoDB(data){
      try{
      const chatMetaRec = new chatMeta(
      {
        receiver:data.sender,
        sender: data.receiver,
        message: data.message,
        time: Date.now(),
      })
      await chatMetaRec.save();
      }catch(error){
      console.log("message not saved to db",error);
    }  
    }
}

    


    

  //send the message to the reciver
/*  async sendToClient(data) {
    console.log("send to client", data.to);                (CODE TO USE REDIS AS CACHE FOR MESSAGES)
    var socketId = await redisClient
      .get(`${data.to}:C`)
      .then((res) => {
        return res;
      })
      let chatId;                                                  // create chatId for redis
      if (data.to > data.from) {          
        chatId = `${data.to}:${data.from}`;
      } else {
        chatId = `${data.from}:${data.to}`;
      }

    if (socketId) {
      console.log("SENDING MESSAGE TO CLIENT", data.message);
      await this.saveMessageToRedis(chatId,data);
      await this.io.to(socketId).emit("msgs", data.message);        //sending msg to revicer by socket
      if ((await redisClient.lLen(chatId)) > 50) {
      let msgList= await this.getMessagesFromRedis(chatId);
      await this.saveMessageToMongoDB(msgList,chatId);
      }
    }else{
      console.log("reciver not found on redis ");
      await this.saveMessageToRedis(chatId,data);
      if ((await redisClient.lLen(chatId)) > 10) {
      let msgList= await this.getMessagesFromRedis(chatId);
      await this.saveMessageToMongoDB(msgList,chatId);
      }

    }
    }


async saveMessageToMongoDB(msgList,chatId){
  await chatMeta.collection.insertMany(msgList);              //save all msg to mongodb
  await redisClient.lTrim(chatId,-1,0,function (err, reply) { // delete all msg from redis
  if (err) {console.error(err)}
  return reply;
 })
}

async saveMessageToRedis(chatId,data){
  let user = chatId.split(":");
  const chatMetaRec =
  {
    userId1: user[0],
    userId2: user[1],
    sender: data.from,
    message: data.message,
    time: Date.now(),
  }
  await redisClient.rPush(chatId, JSON.stringify(chatMetaRec)); // adding msg to redis

}
async getMessagesFromRedis(chatId){
  let msgObj = await redisClient.lRange(chatId,0,-1,          //get all msg from redis for chatId
            function (err, msgObj) {
            if (err) {console.error(err)}
            return msgObj });
  let msgList = []; 
  if (msgObj) {
      msgObj.forEach((element) => {
      msgList.push(JSON.parse(element))});
    }
  return msgList;
}*/



module.exports.getSocketInstance = (async function () {
  const socketInstance = await new SocketConnection(io);
  return Object.freeze(socketInstance);
})();