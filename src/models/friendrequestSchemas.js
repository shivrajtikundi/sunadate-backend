const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchemas = new Schema({
    from_userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    to_userid: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:['ACCEPT',"PENDING","REJECT"],
        default:"PENDING"
    }
});

module.exports = mongoose.model('requestSchemas', requestSchemas);
