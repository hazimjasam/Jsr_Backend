let mongoose = require('mongoose');

let expenses = mongoose.Schema({
    type:{
        type: String, //0 other // 1 pharmsy //2 Surgery // 3 sonar //4 examine
        default:"اخرى"
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    details:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        required: true
    },
    date:{
        type:String,
        required: true,
        index: true
    },
    data_entry_name:{
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
    img:{
        type:String,
        default:''
    },
    link:{
        type:String,
        default:''
    }
})

module.exports = mongoose.model("expenses", expenses);