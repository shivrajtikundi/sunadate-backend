var mongoose = require('mongoose')


const option = mongoose.Schema({ 
    option: { type:String }, 
    _id : false  
});

const registerContent = mongoose.Schema({ 
    content_name: { type:String }, 
    options:{type:[option]} 
});



module.exports = mongoose.model("registerContent", registerContent)