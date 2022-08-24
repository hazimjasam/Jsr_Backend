let mongoose = require('mongoose');

let banner = mongoose.Schema({
   
    image: {
        type: String,
        required: true
    },
    product: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }
})

module.exports = mongoose.model("banner", banner);