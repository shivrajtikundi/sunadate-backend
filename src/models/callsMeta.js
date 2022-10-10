var mongoose = require('mongoose')

const callsMetaSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to:{
        type: String, 
        required: true
    },
    callType:{
        type: String,  // AUDIO : A , VIDEO : V
        required: true
    },
    received:{
        type  :Boolean,
        default:false
    }
})

module.exports = mongoose.model("callsMeta", callsMetaSchema)