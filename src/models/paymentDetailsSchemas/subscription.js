const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    SubscriptionId:{
        type:String,
        required:true
    },
    Subscription_details: {
        type: String,
        required:true
    },
    Plan_id:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('subscriptionSchema', subscriptionSchema);
