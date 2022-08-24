let mongoose = require('mongoose');

let order = mongoose.Schema({
    name: {
        type: String,
        default:'',
        index: true
    },
    price:{
        type:Number,
        required: true
    },
    count:{
        type:Number,
        default:0
    },
    link:{
        type:String,
        default:''
    },
    product_id:{
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
})

module.exports = mongoose.model("order", order);