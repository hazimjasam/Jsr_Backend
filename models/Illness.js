let mongoose = require('mongoose');

let illness = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },

   
})

module.exports = mongoose.model("illness", illness);