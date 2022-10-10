const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchemas = new Schema({
    from_userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    to_userid: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    liked:{
        type:Boolean,
        default:true
    },
    isViewed:{
        type:Boolean,
        default:false
    },
    isMatched:{
        type:Boolean,
        default:false
    }    
});

module.exports = mongoose.model('likeSchemas', likeSchemas);