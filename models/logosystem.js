let mongoose = require('mongoose');

let logosystem = mongoose.Schema({

    type_:{
        type:Number,
        default:0
    },
    employee:{
        type:String,
        default:''
    },
    details:{
        type:String,
        default:''
    },
    createdAt: { type: Date, expires: '175200m', default: Date.now }
 
})

module.exports = mongoose.model("logosystem", logosystem);