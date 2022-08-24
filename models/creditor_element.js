let mongoose = require('mongoose');

let creditor_element = mongoose.Schema({
    creditor: {
        type: String,
        required: true,
        index: true
    },
    name:{
        type: String,
        required: true
    },
    details:{
        type: String,
        default: ""
    },
    price:{
        type:Number,
        default: 0
    },
    data_entry_name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    }
})

module.exports = mongoose.model("creditor_element", creditor_element);