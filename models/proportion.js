let mongoose = require('mongoose');

let proportion = mongoose.Schema({
    name:{
        type: String,
        default:"",
        index: true
    },
    employee:{
        type: String,
        required: true,
        index: true
    },
    value:{
        type:Number,
        default:0
    },
    date:{
        type:String,
        required: true,
    }
    
})

module.exports = mongoose.model("proportion", proportion);