const mongoose = require('mongoose');

const onlineSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    }
})


const Online = mongoose.model('Online', onlineSchema);

module.exports = { Online }
