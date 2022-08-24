let mongoose = require('mongoose');

let room = mongoose.Schema({
    floor: {
        type: Number,
        required: true
    },
    room: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
   
    
   
})

module.exports = mongoose.model("room", room);