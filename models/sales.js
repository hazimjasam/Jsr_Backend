let mongoose = require('mongoose');

let sales = mongoose.Schema({
    name: {
        type: String,
        default:'',
        index: true
    },
    company:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        required: true
    },
    discount:{
        type:Number,
        default:0
    },
    bar_code:{
        type:String,
        default:''
    },
    data_entry_name:{
        type:String,
        required: true
    },
    med_list:[{
        name:String,
        count:String,
        price:Number,
        _type:Number
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
})

module.exports = mongoose.model("sales", sales);