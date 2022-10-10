var mongoose = require('mongoose')


const contactus = mongoose.Schema({
   description:{
       type : String
   },
   mailingAddress:{
       type : String
   },
   corporateAddress:{
       type : String
   }
})


module.exports = mongoose.model("contactus", contactus)