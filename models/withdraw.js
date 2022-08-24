let mongoose = require('mongoose');

let withdraw = mongoose.Schema({
  
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
   

})

module.exports = mongoose.model("withdraw", withdraw);