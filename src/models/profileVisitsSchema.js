const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileVisits = new Schema({
    from_userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    to_userid: {
        type: mongoose.Types.ObjectId,
        required:true
    }  
});

module.exports = mongoose.model('profileVisits', profileVisits);