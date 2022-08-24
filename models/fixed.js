let mongoose = require('mongoose');

let fixed = mongoose.Schema({

    details:{
        type:String,
        default:''
    },
    price_fixed:{
        type:Number,
        default:0
    },
    price_salary:{
        type:Number,
        default:0
    },
    date:{
        type:String,
        required: true,
        index: true
    },
    data_entry_name:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model("fixed", fixed);