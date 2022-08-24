let mongoose = require('mongoose');

let delivery_date_selection = mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    count:{
        type:Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }
})

module.exports = mongoose.model("delivery_date_selection", delivery_date_selection);