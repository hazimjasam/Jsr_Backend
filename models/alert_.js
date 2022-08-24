let mongoose = require('mongoose');

let alert_ = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: { type: Date, expires: '3m', default: Date.now }
})

module.exports = mongoose.model("alert_", alert_);