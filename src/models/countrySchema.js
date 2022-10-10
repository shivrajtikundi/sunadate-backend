const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const countrySchema = new Schema({
    countryName:{
        type:String,
        required:true
    },
    countryCode: {
        type: String,
        required:true
    },
    status:{
        type: Boolean,
        default:false
    }
});

module.exports = mongoose.model('countrySchema', countrySchema);
