let mongoose = require('mongoose');

let revenues_types = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        index: true
    },
   
})

module.exports = mongoose.model("revenues_types", revenues_types);