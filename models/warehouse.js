let mongoose = require('mongoose');

let warehouse = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
   
})

module.exports = mongoose.model("warehouse", warehouse);