var mongoose = require('mongoose')

const option = mongoose.Schema({ 
    option: { type:String },
    image: { type:String}, 
    _id : false  
});


var questionSchema = mongoose.Schema({
    questionNo: {
        type: Number,
        required: true,
        unique: true
    },
    question:{
        type: String, 
        required: true
    },
    options:{
        type  :[option],
        default:[]
    },
    multiple: {
        type: Boolean,
        default:false
    },

})
module.exports = mongoose.model('question',questionSchema)
