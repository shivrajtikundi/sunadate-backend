
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const limitfiles = new Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    i_limit: {
        type: Number,
        default:2
    },
    v_limit: {
        type: Number,
        default:2
    }
});

module.exports = mongoose.model('limitfiles', limitfiles);