const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const interval = mongoose.Schema({ 
    interval: { type:String }, 
    interval_count: { type:Number },
    _id : false  
});

const Data = mongoose.Schema({ 
    active: { type:Boolean ,default:true }, 
    priceId:{type:String},
    price:{type:String},
    interval:{type:interval}
});

const productSchema = new Schema({
    productId:{
        type:String,
        required:true
    },
    product_details: {
        type: [Data],
        required:true,
        _id : false
    },
    productName:{
        type:String,
        required: true,
        unique:true
    }
});

module.exports = mongoose.model('productSchema', productSchema);
