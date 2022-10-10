const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userGallery = new Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },

    blocked:{
        type: Boolean,
        default:false
    }

});

module.exports = mongoose.model('userGallery', userGallery);