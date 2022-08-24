let mongoose = require('mongoose');

let creditor_paid = mongoose.Schema({
    creditor: {
        type: String,
        required: true,
        index: true
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

module.exports = mongoose.model("creditor_paid", creditor_paid);