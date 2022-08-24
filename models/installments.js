let mongoose = require('mongoose');

let installments = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    details:{
        type:String,
        default:''
    },
    price_full:{
        type:Number,
        required: true
    },
    price_paid:{
        type:Number,
        required: true
    },
    date:{
        type:String,
        required: true,
        index: true
    },
    date_alert:{
        type:String,
        required: true,
        index: true
    },
    data_entry_name:{
        type:String,
        required: true
    }
   
})

module.exports = mongoose.model("installments", installments);