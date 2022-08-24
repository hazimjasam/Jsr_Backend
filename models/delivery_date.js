let mongoose = require('delivery_date');

let delivery_date = mongoose.Schema({
    time: {
        type: Date,
        required: true
    },
 
})

module.exports = mongoose.model("delivery_date", delivery_date);