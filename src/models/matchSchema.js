
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const matchSchemas = new Schema({
    from_userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    to_userid: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    matched:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('matchSchemas', matchSchemas);