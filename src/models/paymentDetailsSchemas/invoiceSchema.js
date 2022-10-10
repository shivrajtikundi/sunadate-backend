const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    invoiceId:{
        type:String,
        required:true
    },
    customer_id:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('invoiceSchema', invoiceSchema);
