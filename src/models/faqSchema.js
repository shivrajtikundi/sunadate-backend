const mongoose = require('mongoose');


const faqSchema = mongoose.Schema({ 
    title:{
        type : String,
    },
    description: { 
        type:String 
    }, 
});

module.exports = mongoose.model('faqSchema', faqSchema);
