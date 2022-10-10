const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userPayDetails = new Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    subscription_id:{
       type:String,
    },
    current_period_end:{
        type:String,
    },
    current_period_start: {
        type: String,
    },
    planName: {
        type: String,
    },
    amount:{
        type:String,
    },
    active:{
        type:String,
    },
    interval:{
        type:String,
    },
    latest_invoice:{
        type:String,
    }
});


module.exports = mongoose.model('userPayDetails', userPayDetails);
