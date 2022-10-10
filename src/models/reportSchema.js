const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    from_userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    to_userid: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required: true
    }
},
{timestamps:true}
);

module.exports = mongoose.model('reportSchema', reportSchema);
