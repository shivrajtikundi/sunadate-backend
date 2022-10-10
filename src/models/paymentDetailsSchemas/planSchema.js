const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const planSchema = new Schema({
    planId:{
        type:String,
        required:true
    },
    plan_details: {
        type: String,
        required:true
    },
    product_id:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('planSchema', planSchema);
