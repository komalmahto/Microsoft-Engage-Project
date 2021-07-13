mongoose = require('mongoose');


const noteSchema = mongoose.Schema({
    email:{
        type:String
    },
    title: {
        type: String
        },
    content: {
        type: String
    }
    });

const Note = mongoose.model('Note', noteSchema);
module.exports = { Note }