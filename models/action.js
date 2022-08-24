let mongoose = require('mongoose');

let action = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color:{
        type:String,
        default: Math.floor(Math.random()*16777215).toString(16)
    }
})

module.exports = mongoose.model("action", action);