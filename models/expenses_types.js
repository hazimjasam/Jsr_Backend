let mongoose = require('mongoose');

let expenses_types = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        index: true
    },
   
})

module.exports = mongoose.model("expenses_types", expenses_types);