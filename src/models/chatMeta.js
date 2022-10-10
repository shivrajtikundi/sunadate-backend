var mongoose = require("mongoose");

const chatsMetaSchema = mongoose.Schema({
  // userId1: {
  //   type: String,
  //   required: true,
  // },
  // userId2: {
  //   type: String,
  //   required: true,
  // },
  // sender:{
  //   type: String,
  //   required:true,
  // },
  sender: {
    type:String,
    required:true
  },
  receiver:{
    type:String,
    required:true
  },
  message: {
    type: String,
    required: true,
  },
  receiveStatus: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    required: true,
  }
  
});

module.exports = mongoose.model("chatsMeta", chatsMetaSchema);
